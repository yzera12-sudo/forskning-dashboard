"use client";

import { JOURNALS } from "@/lib/journals";

interface JournalFilterProps {
  selected: string | null;
  counts: Record<string, number>;
  onSelect: (journalId: string | null) => void;
}

export function JournalFilter({
  selected,
  counts,
  onSelect,
}: JournalFilterProps) {
  const total = Object.values(counts).reduce((a, b) => a + b, 0);

  return (
    <>
      <p className="mb-2 text-xs text-slate-500 md:hidden">
        Swipe sideways for more journals →
      </p>
      <section
        aria-label="Filter by journal"
        className="scrollbar-thin -mx-1 flex gap-2 overflow-x-auto px-1 pb-1 md:mx-0 md:flex-wrap md:overflow-visible md:px-0"
      >
        <FilterChip
          active={selected === null}
          label="All journals"
          title="All journals"
          count={total}
          onClick={() => onSelect(null)}
        />
        {JOURNALS.map((j) => (
          <FilterChip
            key={j.id}
            active={selected === j.id}
            label={j.shortLabel}
            title={j.name}
            count={counts[j.id] ?? 0}
            onClick={() => onSelect(selected === j.id ? null : j.id)}
          />
        ))}
      </section>
    </>
  );
}

function FilterChip({
  active,
  label,
  title,
  count,
  onClick,
}: {
  active: boolean;
  label: string;
  title: string;
  count: number;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      title={title}
      onClick={onClick}
      className={`inline-flex shrink-0 snap-start items-center gap-1.5 rounded-full border px-3.5 py-2.5 text-sm font-medium transition touch-manipulation md:py-1.5 ${
        active
          ? "border-brand bg-brand text-white shadow-sm"
          : "border-slate-200 bg-white text-slate-700 active:bg-brand-soft"
      }`}
    >
      {label}
      <span
        className={`rounded-full px-1.5 py-0.5 text-xs ${
          active ? "bg-white/20 text-white" : "bg-slate-100 text-slate-500"
        }`}
      >
        {count}
      </span>
    </button>
  );
}
