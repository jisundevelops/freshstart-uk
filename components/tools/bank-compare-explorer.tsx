"use client";

import { useMemo, useState, useCallback } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { ComparisonFilters } from "@/components/tools/comparison/comparison-filters";
import { ComparisonTable } from "@/components/tools/comparison/comparison-table";
import { ComparisonCards } from "@/components/tools/comparison/comparison-cards";
import { BANK_TOOL_SLUG } from "@/lib/tools/bank-compare";
import type { BankCompareRow } from "@/types/tools";

const FILTER_CHIPS = [
  { id: "noCreditHistory", label: "No credit history" },
  { id: "noUkAddress", label: "No UK address" },
  { id: "instantOpening", label: "Instant opening" },
] as const;

const SORT_OPTIONS = [
  { id: "name", label: "Name" },
  { id: "appRating", label: "App rating" },
  { id: "monthlyFee", label: "Monthly fee" },
];

interface BankCompareExplorerProps {
  rows: BankCompareRow[];
  path: string;
}

export function BankCompareExplorer({ rows, path }: BankCompareExplorerProps) {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [query, setQuery] = useState(searchParams.get("q") ?? "");
  const [activeChip, setActiveChip] = useState<string | null>(
    searchParams.get("filter")
  );
  const [sortKey, setSortKey] = useState(
    searchParams.get("sort") ?? "appRating"
  );
  const [viewMode, setViewMode] = useState<"table" | "cards">(
    searchParams.get("view") === "cards" ? "cards" : "table"
  );

  const updateUrl = useCallback(
    (updates: Record<string, string | null>) => {
      const params = new URLSearchParams(searchParams.toString());
      Object.entries(updates).forEach(([key, value]) => {
        if (value === null || value === "") params.delete(key);
        else params.set(key, value);
      });
      const qs = params.toString();
      router.replace(qs ? `${path}?${qs}` : path, { scroll: false });
    },
    [path, router, searchParams]
  );

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    let list = rows.filter((row) => {
      const matchesQuery =
        !q ||
        row.name.toLowerCase().includes(q) ||
        row.studentOffer.toLowerCase().includes(q);
      const matchesChip =
        !activeChip ||
        (activeChip === "noCreditHistory" && row.noCreditHistory) ||
        (activeChip === "noUkAddress" && row.noUkAddress) ||
        (activeChip === "instantOpening" && row.instantOpening);
      return matchesQuery && matchesChip;
    });

    list = [...list].sort((a, b) => {
      if (sortKey === "name") return a.name.localeCompare(b.name);
      if (sortKey === "appRating") return b.appRating - a.appRating;
      if (sortKey === "monthlyFee") {
        const fee = (s: string) =>
          parseFloat(s.replace(/[^0-9.]/g, "")) || 0;
        return fee(a.monthlyFee) - fee(b.monthlyFee);
      }
      return 0;
    });

    return list;
  }, [rows, query, activeChip, sortKey]);

  return (
    <div>
      <ComparisonFilters
        query={query}
        onQueryChange={(v) => {
          setQuery(v);
          updateUrl({ q: v || null });
        }}
        chips={FILTER_CHIPS.map((c) => ({ id: c.id, label: c.label }))}
        activeChip={activeChip}
        onChipChange={(id) => {
          setActiveChip(id);
          updateUrl({ filter: id });
        }}
        sortOptions={SORT_OPTIONS}
        sortKey={sortKey}
        onSortChange={(key) => {
          setSortKey(key);
          updateUrl({ sort: key });
        }}
        viewMode={viewMode}
        onViewModeChange={(mode) => {
          setViewMode(mode);
          updateUrl({ view: mode === "table" ? null : mode });
        }}
        resultCount={filtered.length}
      />
      {viewMode === "table" ? (
        <ComparisonTable
          rows={filtered}
          toolSlug={BANK_TOOL_SLUG}
          path={path}
        />
      ) : (
        <ComparisonCards
          rows={filtered}
          toolSlug={BANK_TOOL_SLUG}
          path={path}
        />
      )}
    </div>
  );
}
