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
    <div className="flex flex-wrap gap-2">
      <FilterChip
        active={selected === null}
        label="All journals"
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
    </div>
  );
}

function FilterChip({
  active,
  label,
  count,
  title,
  onClick,
}: {
  active: boolean;
  label: string;
  count: number;
  title?: string;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      title={title}
      onClick={onClick}
      className={`inline-flex items-center gap-1.5 rounded-full border px-3 py-1.5 text-sm font-medium transition ${
        active
          ? "border-brand bg-brand text-white shadow-sm"
          : "border-slate-200 bg-white text-slate-700 hover:border-brand-light/40 hover:bg-brand-soft"
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
