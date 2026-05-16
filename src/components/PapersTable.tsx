"use client";

import type { Paper } from "@/lib/types";
import { getJournalById } from "@/lib/journals";
import { subjectLabel } from "@/lib/subjects";

export type EnrichedPaper = Paper & { subjectIds: string[] };

function formatAuthorsShort(authors: string[], max = 2): string {
  if (authors.length === 0) return "—";
  if (authors.length <= max) return authors.join(", ");
  return `${authors.slice(0, max).join(", ")} et al.`;
}

interface PapersTableProps {
  papers: EnrichedPaper[];
  bookmarked: Set<string>;
  onToggleBookmark: (pmid: string) => void;
}

export function PapersTable({
  papers,
  bookmarked,
  onToggleBookmark,
}: PapersTableProps) {
  if (papers.length === 0) return null;

  return (
    <div className="overflow-x-auto rounded-xl border border-slate-200/90 bg-white shadow-card">
      <table className="w-full min-w-[860px] border-collapse text-left text-sm">
        <thead>
          <tr className="border-b border-slate-200 bg-slate-50/90 text-xs font-semibold uppercase tracking-wide text-slate-500">
            <th scope="col" className="w-10 whitespace-nowrap px-2 py-3 text-center">
              ★
            </th>
            <th scope="col" className="whitespace-nowrap px-3 py-3">
              Date
            </th>
            <th scope="col" className="whitespace-nowrap px-3 py-3">
              Journal
            </th>
            <th scope="col" className="whitespace-nowrap px-3 py-3">
              Subjects
            </th>
            <th scope="col" className="max-w-[200px] px-3 py-3">
              Authors
            </th>
            <th scope="col" className="min-w-[280px] px-3 py-3">
              Title
            </th>
            <th scope="col" className="whitespace-nowrap px-3 py-3">
              Links
            </th>
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-100">
          {papers.map((paper) => {
            const j = getJournalById(paper.journalId);
            const doiUrl = paper.doi ? `https://doi.org/${paper.doi}` : null;
            const isSaved = bookmarked.has(paper.pmid);

            return (
              <tr
                key={paper.pmid}
                className="align-top transition hover:bg-brand-soft/30"
              >
                <td className="px-2 py-2.5 text-center">
                  <button
                    type="button"
                    aria-label={
                      isSaved ? "Remove bookmark" : "Add bookmark"
                    }
                    aria-pressed={isSaved}
                    onClick={() => onToggleBookmark(paper.pmid)}
                    className={`inline-flex size-9 items-center justify-center rounded-lg text-lg leading-none transition ${
                      isSaved
                        ? "text-amber-500 hover:bg-amber-50 hover:text-amber-600"
                        : "text-slate-300 hover:bg-slate-100 hover:text-amber-500"
                    }`}
                  >
                    {isSaved ? "★" : "☆"}
                  </button>
                </td>
                <td className="whitespace-nowrap px-3 py-2.5 font-mono text-xs text-slate-600">
                  {paper.pubDate || "—"}
                </td>
                <td className="whitespace-nowrap px-3 py-2.5">
                  <span
                    className="inline-flex max-w-[9rem] items-center truncate rounded-md bg-brand-soft px-2 py-0.5 text-xs font-semibold text-brand"
                    title={j?.name ?? paper.journal}
                  >
                    {j?.shortLabel ?? paper.journalId}
                  </span>
                </td>
                <td className="max-w-[200px] px-3 py-2.5">
                  {paper.subjectIds.length === 0 ? (
                    <span className="text-xs text-slate-400">—</span>
                  ) : (
                    <div className="flex flex-wrap gap-1">
                      {paper.subjectIds.map((sid) => (
                        <span
                          key={sid}
                          className="rounded bg-accent-soft px-1.5 py-0 text-[11px] font-medium text-accent"
                        >
                          {subjectLabel(sid)}
                        </span>
                      ))}
                    </div>
                  )}
                </td>
                <td className="max-w-[200px] px-3 py-2.5 text-xs text-slate-600">
                  <span title={paper.authors.join(", ")}>
                    {formatAuthorsShort(paper.authors)}
                  </span>
                </td>
                <td className="px-3 py-2.5">
                  <a
                    href={paper.pubmedUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    title={paper.title}
                    className="font-display font-medium leading-snug text-slate-900 hover:text-brand hover:underline"
                  >
                    {paper.title}
                  </a>
                </td>
                <td className="whitespace-nowrap px-3 py-2.5">
                  <div className="flex flex-col gap-1 text-xs">
                    <a
                      href={paper.pubmedUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="font-medium text-brand-light hover:text-brand"
                    >
                      PubMed
                    </a>
                    {doiUrl && (
                      <a
                        href={doiUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="font-medium text-accent hover:underline"
                      >
                        DOI
                      </a>
                    )}
                    <span className="font-mono text-[10px] text-slate-400">
                      {paper.pmid}
                    </span>
                  </div>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
