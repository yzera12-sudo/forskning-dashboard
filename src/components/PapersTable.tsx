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
    <>
      <ul className="space-y-3 md:hidden" aria-label="Papers list">
        {papers.map((paper) => (
          <li key={paper.pmid}>
            <PaperCardMobile
              paper={paper}
              isSaved={bookmarked.has(paper.pmid)}
              onToggleBookmark={onToggleBookmark}
            />
          </li>
        ))}
      </ul>

      <div className="hidden overflow-x-auto rounded-xl border border-slate-200/90 bg-white shadow-card md:block">
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
            {papers.map((paper) => (
              <PaperTableRow
                key={paper.pmid}
                paper={paper}
                isSaved={bookmarked.has(paper.pmid)}
                onToggleBookmark={onToggleBookmark}
              />
            ))}
          </tbody>
        </table>
      </div>
    </>
  );
}

function PaperCardMobile({
  paper,
  isSaved,
  onToggleBookmark,
}: {
  paper: EnrichedPaper;
  isSaved: boolean;
  onToggleBookmark: (pmid: string) => void;
}) {
  const j = getJournalById(paper.journalId);
  const doiUrl = paper.doi ? `https://doi.org/${paper.doi}` : null;

  return (
    <article className="rounded-xl border border-slate-200/90 bg-white p-4 shadow-card">
      <div className="flex gap-3">
        <BookmarkButton
          isSaved={isSaved}
          onClick={() => onToggleBookmark(paper.pmid)}
        />
        <div className="min-w-0 flex-1">
          <div className="mb-2 flex flex-wrap items-center gap-2">
            <JournalBadge journalId={paper.journalId} name={j?.name ?? paper.journal} />
            <time
              dateTime={paper.pubDate}
              className="font-mono text-xs text-slate-500"
            >
              {paper.pubDate || "—"}
            </time>
          </div>
          <h3 className="font-display text-base font-semibold leading-snug text-slate-900">
            <a
              href={paper.pubmedUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-brand active:text-brand"
            >
              {paper.title}
            </a>
          </h3>
          <p className="mt-1.5 text-sm text-slate-600">
            {formatAuthorsShort(paper.authors, 3)}
          </p>
          <SubjectTags subjectIds={paper.subjectIds} className="mt-2.5" />
          <div className="mt-3 flex flex-wrap gap-2">
            <LinkPill href={paper.pubmedUrl} label="PubMed" variant="brand" />
            {doiUrl && <LinkPill href={doiUrl} label="DOI" variant="accent" />}
            <span className="inline-flex items-center rounded-full bg-slate-100 px-2.5 py-1.5 font-mono text-[11px] text-slate-500">
              {paper.pmid}
            </span>
          </div>
        </div>
      </div>
    </article>
  );
}

function PaperTableRow({
  paper,
  isSaved,
  onToggleBookmark,
}: {
  paper: EnrichedPaper;
  isSaved: boolean;
  onToggleBookmark: (pmid: string) => void;
}) {
  const j = getJournalById(paper.journalId);
  const doiUrl = paper.doi ? `https://doi.org/${paper.doi}` : null;

  return (
    <tr className="align-top transition hover:bg-brand-soft/30">
      <td className="px-2 py-2.5 text-center">
        <BookmarkButton
          isSaved={isSaved}
          onClick={() => onToggleBookmark(paper.pmid)}
        />
      </td>
      <td className="whitespace-nowrap px-3 py-2.5 font-mono text-xs text-slate-600">
        {paper.pubDate || "—"}
      </td>
      <td className="whitespace-nowrap px-3 py-2.5">
        <JournalBadge journalId={paper.journalId} name={j?.name ?? paper.journal} />
      </td>
      <td className="max-w-[200px] px-3 py-2.5">
        <SubjectTags subjectIds={paper.subjectIds} />
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
          <span className="font-mono text-[10px] text-slate-400">{paper.pmid}</span>
        </div>
      </td>
    </tr>
  );
}

function BookmarkButton({
  isSaved,
  onClick,
}: {
  isSaved: boolean;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      aria-label={isSaved ? "Remove bookmark" : "Add bookmark"}
      aria-pressed={isSaved}
      onClick={onClick}
      className={`inline-flex size-11 shrink-0 items-center justify-center rounded-lg text-xl leading-none transition touch-manipulation ${
        isSaved
          ? "text-amber-500 active:bg-amber-50"
          : "text-slate-300 active:bg-slate-100 active:text-amber-500"
      }`}
    >
      {isSaved ? "★" : "☆"}
    </button>
  );
}

function JournalBadge({
  journalId,
  name,
}: {
  journalId: string;
  name: string;
}) {
  const j = getJournalById(journalId);
  return (
    <span
      className="inline-flex max-w-full items-center truncate rounded-md bg-brand-soft px-2 py-0.5 text-xs font-semibold text-brand"
      title={name}
    >
      {j?.shortLabel ?? journalId}
    </span>
  );
}

function SubjectTags({
  subjectIds,
  className = "",
}: {
  subjectIds: string[];
  className?: string;
}) {
  if (subjectIds.length === 0) {
    return <span className={`text-xs text-slate-400 ${className}`}>—</span>;
  }
  return (
    <div className={`flex flex-wrap gap-1 ${className}`}>
      {subjectIds.map((sid) => (
        <span
          key={sid}
          className="rounded bg-accent-soft px-1.5 py-0.5 text-[11px] font-medium text-accent"
        >
          {subjectLabel(sid)}
        </span>
      ))}
    </div>
  );
}

function LinkPill({
  href,
  label,
  variant,
}: {
  href: string;
  label: string;
  variant: "brand" | "accent";
}) {
  const styles =
    variant === "brand"
      ? "bg-brand-soft text-brand active:bg-brand/10"
      : "bg-accent-soft text-accent active:bg-teal-100";
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className={`inline-flex min-h-[44px] items-center rounded-full px-4 py-2 text-sm font-medium touch-manipulation ${styles}`}
    >
      {label}
    </a>
  );
}
