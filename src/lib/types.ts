export interface Journal {
  id: string;
  /** Compact label for badges and table (e.g. JAACAP). */
  shortLabel: string;
  name: string;
  pubmedQuery: string;
  publisher: string;
  impactNote?: string;
}

export interface Paper {
  pmid: string;
  title: string;
  authors: string[];
  journal: string;
  journalId: string;
  pubDate: string;
  epubDate?: string;
  doi?: string;
  abstract?: string;
  pubmedUrl: string;
}

export interface PapersResponse {
  papers: Paper[];
  fetchedAt: string;
  journalCounts: Record<string, number>;
}
