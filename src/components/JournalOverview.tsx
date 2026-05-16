"use client";

import { useState } from "react";
import { JOURNALS } from "@/lib/journals";

interface JournalOverviewProps {
  counts: Record<string, number>;
}

function JournalCards({ counts }: JournalOverviewProps) {
  return (
  <>
    {JOURNALS.map((journal) => (
      <article
        key={journal.id}
        className="rounded-lg border border-slate-200/80 bg-white/60 px-4 py-3 backdrop-blur-sm"
      >
        <p className="text-xs font-semibold uppercase tracking-wide text-brand">
          {counts[journal.id] ?? 0} recent
        </p>
        <h3 className="mt-1 text-sm font-medium leading-snug text-slate-800">
          {journal.name}
        </h3>
        <p className="mt-1 text-xs text-slate-500">{journal.publisher}</p>
        {journal.impactNote && (
          <p className="mt-2 text-xs leading-relaxed text-slate-400">
            {journal.impactNote}
          </p>
        )}
      </article>
    ))}
  </>
  );
}

export function JournalOverview({ counts }: JournalOverviewProps) {
  const [open, setOpen] = useState(false);
  const total = Object.values(counts).reduce((a, b) => a + b, 0);

  return (
    <>
      <div className="md:hidden">
        <button
          type="button"
          onClick={() => setOpen((v) => !v)}
          className="flex w-full min-h-[48px] items-center justify-between rounded-lg border border-slate-200 bg-white px-4 py-3 text-left text-sm font-medium text-slate-800 touch-manipulation"
          aria-expanded={open}
        >
          <span>
            {JOURNALS.length} journals · {total} papers loaded
          </span>
          <span className="text-brand" aria-hidden>
            {open ? "▲" : "▼"}
          </span>
        </button>
        {open && (
          <section className="mt-3 grid gap-3">
            <JournalCards counts={counts} />
          </section>
        )}
      </div>

      <section className="hidden gap-3 md:grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        <JournalCards counts={counts} />
      </section>
    </>
  );
}
