"use client";

import { useCallback, useEffect, useMemo, useState } from "react";

const STORAGE_KEY = "research-dashboard-bookmarks-v1";

function readStoredPmids(): string[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw) as unknown;
    if (!Array.isArray(parsed)) return [];
    return parsed.filter((x): x is string => typeof x === "string");
  } catch {
    return [];
  }
}

export function useBookmarks() {
  const [pmids, setPmids] = useState<string[]>(() => []);

  useEffect(() => {
    setPmids(readStoredPmids());
  }, []);

  const toggle = useCallback((pmid: string) => {
    setPmids((prev) => {
      const exists = prev.includes(pmid);
      const next = exists ? prev.filter((p) => p !== pmid) : [...prev, pmid];
      try {
        window.localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
      } catch {
        /* ignore quota */
      }
      return next;
    });
  }, []);

  const bookmarked = useMemo(() => new Set(pmids), [pmids]);

  return {
    bookmarkedPmids: bookmarked,
    toggleBookmark: toggle,
    bookmarksCount: pmids.length,
  };
}
