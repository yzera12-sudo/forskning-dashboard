import { NextResponse } from "next/server";
import { fetchLatestPapers } from "@/lib/pubmed";
import type { PapersResponse } from "@/lib/types";

export const dynamic = "force-dynamic";
export const revalidate = 3600;

export async function GET() {
  try {
    const papers = await fetchLatestPapers();
    const journalCounts: Record<string, number> = {};
    for (const paper of papers) {
      journalCounts[paper.journalId] =
        (journalCounts[paper.journalId] ?? 0) + 1;
    }

    const body: PapersResponse = {
      papers,
      fetchedAt: new Date().toISOString(),
      journalCounts,
    };

    return NextResponse.json(body, {
      headers: {
        "Cache-Control": "public, s-maxage=3600, stale-while-revalidate=7200",
      },
    });
  } catch (err) {
    const message =
      err instanceof Error ? err.message : "Failed to fetch papers";
    console.error("[api/papers]", message);
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
