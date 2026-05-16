import { JOURNALS } from "@/lib/journals";

interface JournalOverviewProps {
  counts: Record<string, number>;
}

export function JournalOverview({ counts }: JournalOverviewProps) {
  return (
    <section className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
      {JOURNALS.map((journal) => (
        <div
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
        </div>
      ))}
    </section>
  );
}
