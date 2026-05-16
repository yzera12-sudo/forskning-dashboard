import { JOURNALS, PAPERS_PER_JOURNAL } from "./journals";
import type { Journal, Paper } from "./types";

const EUTILS_BASE = "https://eutils.ncbi.nlm.nih.gov/entrez/eutils";
const REQUEST_DELAY_MS = 120;

interface ESearchResult {
  esearchresult?: {
    idlist?: string[];
  };
}

interface ESummaryAuthor {
  name?: string;
}

interface ESummaryArticle {
  title?: string;
  authors?: ESummaryAuthor[];
  source?: string;
  pubdate?: string;
  epubdate?: string;
  elocationid?: string;
  articleids?: { idtype?: string; value?: string }[];
}

interface ESummaryResult {
  result?: {
    uids?: string[];
    [pmid: string]: ESummaryArticle | string[] | undefined;
  };
}

function delay(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

function withApiKey(params: URLSearchParams): URLSearchParams {
  const key = process.env.NCBI_API_KEY;
  if (key) params.set("api_key", key);
  return params;
}

async function fetchJson<T>(url: string): Promise<T> {
  const res = await fetch(url, {
    headers: { Accept: "application/json" },
    next: { revalidate: 3600 },
  });
  if (!res.ok) {
    throw new Error(`PubMed request failed: ${res.status} ${res.statusText}`);
  }
  return res.json() as Promise<T>;
}

async function searchJournalPmids(
  journal: Journal,
  retmax: number
): Promise<string[]> {
  const params = withApiKey(
    new URLSearchParams({
      db: "pubmed",
      term: journal.pubmedQuery,
      sort: "date",
      retmax: String(retmax),
      retmode: "json",
    })
  );
  const data = await fetchJson<ESearchResult>(
    `${EUTILS_BASE}/esearch.fcgi?${params}`
  );
  return data.esearchresult?.idlist ?? [];
}

async function fetchSummaries(pmids: string[]): Promise<ESummaryResult> {
  if (pmids.length === 0) return { result: { uids: [] } };
  const params = withApiKey(
    new URLSearchParams({
      db: "pubmed",
      id: pmids.join(","),
      retmode: "json",
    })
  );
  return fetchJson<ESummaryResult>(
    `${EUTILS_BASE}/esummary.fcgi?${params}`
  );
}

function extractDoi(article: ESummaryArticle): string | undefined {
  const ids = article.articleids ?? [];
  const doiEntry = ids.find((a) => a.idtype === "doi");
  if (doiEntry?.value) return doiEntry.value;
  const eloc = article.elocationid ?? "";
  if (eloc.toLowerCase().startsWith("doi:")) {
    return eloc.replace(/^doi:\s*/i, "").trim();
  }
  return undefined;
}

function mapArticleToPaper(
  pmid: string,
  article: ESummaryArticle,
  journal: Journal
): Paper {
  const authors =
    article.authors?.map((a) => a.name).filter((n): n is string => !!n) ??
    [];
  return {
    pmid,
    title: article.title?.replace(/\.$/, "") ?? "Untitled",
    authors,
    journal: article.source ?? journal.name,
    journalId: journal.id,
    pubDate: article.pubdate ?? "",
    epubDate: article.epubdate,
    doi: extractDoi(article),
    pubmedUrl: `https://pubmed.ncbi.nlm.nih.gov/${pmid}/`,
  };
}

export async function fetchLatestPapers(): Promise<Paper[]> {
  const allPmids: { pmid: string; journal: Journal }[] = [];

  for (const journal of JOURNALS) {
    const ids = await searchJournalPmids(journal, PAPERS_PER_JOURNAL);
    for (const pmid of ids) {
      allPmids.push({ pmid, journal });
    }
    await delay(REQUEST_DELAY_MS);
  }

  const uniquePmids = [...new Set(allPmids.map((p) => p.pmid))];
  const pmidToJournal = new Map(
    allPmids.map((p) => [p.pmid, p.journal])
  );

  const batchSize = 200;
  const papers: Paper[] = [];

  for (let i = 0; i < uniquePmids.length; i += batchSize) {
    const batch = uniquePmids.slice(i, i + batchSize);
    const summary = await fetchSummaries(batch);
    const result = summary.result;
    if (!result) continue;

    for (const pmid of batch) {
      const raw = result[pmid];
      if (!raw || typeof raw === "object" && Array.isArray(raw)) continue;
      const article = raw as ESummaryArticle;
      const journal = pmidToJournal.get(pmid);
      if (!journal) continue;
      papers.push(mapArticleToPaper(pmid, article, journal));
    }
    if (i + batchSize < uniquePmids.length) {
      await delay(REQUEST_DELAY_MS);
    }
  }

  return sortPapersByDate(papers);
}

export function parsePubDate(dateStr: string): number {
  if (!dateStr) return 0;
  const parts = dateStr.trim().split(/\s+/);
  const year = parseInt(parts[0], 10);
  const months: Record<string, number> = {
    Jan: 0, Feb: 1, Mar: 2, Apr: 3, May: 4, Jun: 5,
    Jul: 6, Aug: 7, Sep: 8, Oct: 9, Nov: 10, Dec: 11,
  };
  let month = 0;
  let day = 1;
  if (parts.length >= 2 && months[parts[1]] !== undefined) {
    month = months[parts[1]];
  }
  if (parts.length >= 3) {
    const d = parseInt(parts[2], 10);
    if (!Number.isNaN(d)) day = d;
  }
  return new Date(year, month, day).getTime();
}

export function sortPapersByDate(papers: Paper[]): Paper[] {
  return [...papers].sort(
    (a, b) => parsePubDate(b.pubDate) - parsePubDate(a.pubDate)
  );
}
