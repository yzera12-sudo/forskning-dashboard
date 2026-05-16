"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import type { Paper, PapersResponse } from "@/lib/types";
import { JournalFilter } from "./JournalFilter";
import { JournalOverview } from "./JournalOverview";
import { PapersTable, type EnrichedPaper } from "./PapersTable";
import { useBookmarks } from "@/hooks/useBookmarks";
import {
  inferSubjectIds,
  SUBJECT_DEFINITIONS,
  subjectLabel,
} from "@/lib/subjects";
import { getJournalById } from "@/lib/journals";
import { parsePubDate } from "@/lib/pubmed";

type SortMode = "date" | "subject" | "journal" | "bookmarks_first";

export function Dashboard() {
  const [papers, setPapers] = useState<Paper[]>([]);
  const [journalCounts, setJournalCounts] = useState<Record<string, number>>(
    {}
  );
  const [fetchedAt, setFetchedAt] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedJournal, setSelectedJournal] = useState<string | null>(null);
  const [search, setSearch] = useState("");
  const [subjectFilter, setSubjectFilter] = useState<string>("all");
  const [sortMode, setSortMode] = useState<SortMode>("date");
  const [bookmarksOnly, setBookmarksOnly] = useState(false);

  const { bookmarkedPmids, toggleBookmark, bookmarksCount } = useBookmarks();

  const loadPapers = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/papers");
      if (!res.ok) {
        const body = await res.json().catch(() => ({}));
        throw new Error(body.error ?? `Request failed (${res.status})`);
      }
      const data: PapersResponse = await res.json();
      setPapers(data.papers);
      setJournalCounts(data.journalCounts);
      setFetchedAt(data.fetchedAt);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Could not load papers");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadPapers();
  }, [loadPapers]);

  const enriched: EnrichedPaper[] = useMemo(
    () =>
      papers.map((p) => ({
        ...p,
        subjectIds: inferSubjectIds(p),
      })),
    [papers]
  );

  const filtered = useMemo(() => {
    let list = enriched;
    if (selectedJournal) {
      list = list.filter((p) => p.journalId === selectedJournal);
    }
    const q = search.trim().toLowerCase();
    if (q) {
      list = list.filter(
        (p) =>
          p.title.toLowerCase().includes(q) ||
          p.authors.some((a) => a.toLowerCase().includes(q))
      );
    }
    if (subjectFilter !== "all") {
      list = list.filter((p) => p.subjectIds.includes(subjectFilter));
    }
    if (bookmarksOnly) {
      list = list.filter((p) => bookmarkedPmids.has(p.pmid));
    }
    return list;
  }, [
    enriched,
    selectedJournal,
    search,
    subjectFilter,
    bookmarksOnly,
    bookmarkedPmids,
  ]);

  const sorted = useMemo(() => {
    const copy = [...filtered];
    const subjectSortKey = (p: EnrichedPaper) => {
      if (p.subjectIds.length === 0) return "\uFFFF";
      return p.subjectIds
        .map((id) => subjectLabel(id))
        .sort((a, b) => a.localeCompare(b))[0];
    };
    const journalSortKey = (p: EnrichedPaper) =>
      getJournalById(p.journalId)?.shortLabel ?? p.journalId;

    copy.sort((a, b) => {
      if (sortMode === "bookmarks_first") {
        const ab = bookmarkedPmids.has(a.pmid) ? 1 : 0;
        const bb = bookmarkedPmids.has(b.pmid) ? 1 : 0;
        if (bb !== ab) return bb - ab;
      }
      if (sortMode === "subject") {
        const cmp = subjectSortKey(a).localeCompare(subjectSortKey(b));
        if (cmp !== 0) return cmp;
      }
      if (sortMode === "journal") {
        const cmp = journalSortKey(a).localeCompare(journalSortKey(b));
        if (cmp !== 0) return cmp;
      }
      return parsePubDate(b.pubDate) - parsePubDate(a.pubDate);
    });
    return copy;
  }, [filtered, sortMode, bookmarkedPmids]);

  return (
    <div className="min-h-screen">
      <header className="border-b border-slate-200/80 bg-gradient-to-br from-brand via-brand-light to-[#3a7ca5] text-white">
        <div className="mx-auto max-w-7xl px-4 py-7 sm:px-6 sm:py-10 lg:px-8">
          <p className="text-xs font-medium uppercase tracking-widest text-white/70 sm:text-sm">
            Research monitor
          </p>
          <h1 className="mt-2 font-display text-2xl font-bold tracking-tight sm:text-3xl lg:text-4xl">
            Child &amp; Adolescent Psychiatry
          </h1>
          <p className="mt-3 max-w-2xl text-sm text-white/85 sm:text-base">
            Latest publications from specialist CAP journals plus flagship
            psychiatry sources, from PubMed (refreshed hourly).
          </p>
        </div>
      </header>

      <main className="mx-auto max-w-7xl px-3 py-6 sm:px-6 sm:py-8 lg:px-8">
        <section className="mb-6 sm:mb-10">
          <h2 className="mb-3 hidden font-display text-lg font-semibold text-slate-800 sm:mb-4 sm:block sm:text-xl">
            Journals tracked
          </h2>
          {!loading && !error && <JournalOverview counts={journalCounts} />}
        </section>

        <section className="mb-6 space-y-4">
          <div className="flex flex-col gap-1">
            <label htmlFor="search" className="text-xs font-medium text-slate-500">
              Search
            </label>
            <input
              id="search"
              type="search"
              placeholder="Title or author…"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full rounded-lg border border-slate-200 bg-white py-3 pl-4 pr-4 text-base shadow-sm outline-none ring-brand/20 transition focus:border-brand-light focus:ring-2 sm:py-2.5 sm:text-sm"
            />
          </div>
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
            <div className="flex flex-col gap-1">
              <label
                htmlFor="subject"
                className="text-xs font-medium text-slate-500"
              >
                Subject
              </label>
              <select
                id="subject"
                value={subjectFilter}
                onChange={(e) => setSubjectFilter(e.target.value)}
                className="w-full rounded-lg border border-slate-200 bg-white py-3 pl-3 pr-8 text-base shadow-sm outline-none ring-brand/20 focus:border-brand-light focus:ring-2 sm:py-2.5 sm:text-sm"
              >
                <option value="all">All topics</option>
                {SUBJECT_DEFINITIONS.map((s) => (
                  <option key={s.id} value={s.id}>
                    {s.label}
                  </option>
                ))}
              </select>
            </div>
            <div className="flex flex-col gap-1">
              <label htmlFor="sort" className="text-xs font-medium text-slate-500">
                Sort by
              </label>
              <select
                id="sort"
                value={sortMode}
                onChange={(e) => setSortMode(e.target.value as SortMode)}
                className="w-full rounded-lg border border-slate-200 bg-white py-3 pl-3 pr-8 text-base shadow-sm outline-none ring-brand/20 focus:border-brand-light focus:ring-2 sm:py-2.5 sm:text-sm"
              >
                <option value="date">Newest first</option>
                <option value="subject">Subject (A–Z), then date</option>
                <option value="journal">Journal (A–Z), then date</option>
                <option value="bookmarks_first">Bookmarks first</option>
              </select>
            </div>
          </div>
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <label className="flex min-h-[48px] cursor-pointer items-center gap-3 rounded-lg border border-slate-200 bg-white px-4 py-3 text-sm font-medium text-slate-700 shadow-sm touch-manipulation">
              <input
                type="checkbox"
                checked={bookmarksOnly}
                onChange={(e) => setBookmarksOnly(e.target.checked)}
                className="size-4 rounded border-slate-300 text-brand focus:ring-brand"
              />
              Bookmarks only ({bookmarksCount})
            </label>
            <div className="flex flex-wrap items-center gap-3 text-sm text-slate-500">
            {fetchedAt && (
              <span>
                Updated{" "}
                {new Date(fetchedAt).toLocaleString(undefined, {
                  dateStyle: "medium",
                  timeStyle: "short",
                })}
              </span>
            )}
            <button
              type="button"
              onClick={loadPapers}
              disabled={loading}
              className="min-h-[48px] flex-1 rounded-lg border border-slate-200 bg-white px-4 py-2.5 font-medium text-brand shadow-sm transition active:bg-brand-soft disabled:opacity-50 sm:min-h-0 sm:flex-none"
            >
              {loading ? "Loading…" : "Refresh"}
            </button>
            </div>
          </div>
        </section>

        {!loading && !error && (
          <JournalFilter
            selected={selectedJournal}
            counts={journalCounts}
            onSelect={setSelectedJournal}
          />
        )}

        <div className="mt-8">
          {loading && <LoadingTableSkeleton />}
          {error && <ErrorState message={error} onRetry={loadPapers} />}
          {!loading && !error && sorted.length === 0 && (
            <p className="rounded-lg border border-dashed border-slate-200 bg-white py-12 text-center text-slate-500">
              No papers match your filters.
            </p>
          )}
          {!loading && !error && sorted.length > 0 && (
            <>
              <p className="mb-4 text-sm text-slate-500">
                Showing {sorted.length} paper
                {sorted.length === 1 ? "" : "s"}
              </p>
              <PapersTable
                papers={sorted}
                bookmarked={bookmarkedPmids}
                onToggleBookmark={toggleBookmark}
              />
            </>
          )}
        </div>

        <footer className="mt-16 border-t border-slate-200 pt-6 text-center text-xs text-slate-400">
          Bookmarks stay in this browser (localStorage). Data from{" "}
          <a
            href="https://pubmed.ncbi.nlm.nih.gov/"
            className="underline hover:text-slate-600"
            target="_blank"
            rel="noopener noreferrer"
          >
            PubMed
          </a>
          . Topic tags are heuristic (title/text); add an{" "}
          <code className="rounded bg-slate-100 px-1">NCBI_API_KEY</code> for
          higher rate limits.
        </footer>
      </main>
    </div>
  );
}

function LoadingTableSkeleton() {
  return (
    <>
      <ul className="space-y-3 md:hidden" aria-hidden>
        {Array.from({ length: 5 }).map((_, i) => (
          <li
            key={i}
            className="h-36 animate-pulse rounded-xl border border-slate-100 bg-white"
          />
        ))}
      </ul>
      <div className="hidden overflow-x-auto rounded-xl border border-slate-100 bg-white md:block">
      <table className="w-full min-w-[860px]">
        <tbody>
          {Array.from({ length: 10 }).map((_, i) => (
            <tr key={i} className="border-b border-slate-50">
              <td className="w-12 p-3">
                <div className="mx-auto h-9 w-9 animate-pulse rounded-lg bg-slate-100" />
              </td>
              <td className="w-28 p-3">
                <div className="h-4 animate-pulse rounded bg-slate-100" />
              </td>
              <td className="w-24 p-3">
                <div className="h-6 animate-pulse rounded bg-slate-100" />
              </td>
              <td className="p-3">
                <div className="h-10 animate-pulse rounded bg-slate-100" />
              </td>
              <td className="max-w-[200px] p-3">
                <div className="h-4 animate-pulse rounded bg-slate-100" />
              </td>
              <td className="min-w-[280px] p-3">
                <div className="h-5 animate-pulse rounded bg-slate-100" />
              </td>
              <td className="w-20 p-3">
                <div className="h-16 animate-pulse rounded bg-slate-100" />
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
    </>
  );
}

function ErrorState({
  message,
  onRetry,
}: {
  message: string;
  onRetry: () => void;
}) {
  return (
    <div className="rounded-xl border border-red-200 bg-red-50 p-6 text-center">
      <p className="font-medium text-red-800">Could not load papers</p>
      <p className="mt-1 text-sm text-red-600">{message}</p>
      <button
        type="button"
        onClick={onRetry}
        className="mt-4 rounded-lg bg-red-800 px-4 py-2 text-sm font-medium text-white hover:bg-red-900"
      >
        Try again
      </button>
    </div>
  );
}
