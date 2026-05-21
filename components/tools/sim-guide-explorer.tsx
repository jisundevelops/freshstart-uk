"use client";

import { useMemo, useState, useCallback } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { ComparisonFilters } from "@/components/tools/comparison/comparison-filters";
import { ComparisonTable } from "@/components/tools/comparison/comparison-table";
import { ComparisonCards } from "@/components/tools/comparison/comparison-cards";
import { SIM_TOOL_SLUG } from "@/lib/tools/sim-guide";
import type { SimGuideRow } from "@/types/tools";

const FILTER_CHIPS = [
  { id: "internationalCalls", label: "International calls" },
  { id: "unlimitedData", label: "Unlimited data" },
  { id: "cheapest", label: "Cheapest" },
  { id: "eSimSupport", label: "eSIM" },
] as const;

const SORT_OPTIONS = [
  { id: "name", label: "Name" },
  { id: "monthlyCost", label: "Monthly cost" },
];

interface SimGuideExplorerProps {
  rows: SimGuideRow[];
  path: string;
}

export function SimGuideExplorer({ rows, path }: SimGuideExplorerProps) {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [query, setQuery] = useState(searchParams.get("q") ?? "");
  const [activeChip, setActiveChip] = useState<string | null>(
    searchParams.get("filter")
  );
  const [sortKey, setSortKey] = useState(
    searchParams.get("sort") ?? "monthlyCost"
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
        row.planType.toLowerCase().includes(q);
      const matchesChip =
        !activeChip ||
        (activeChip === "internationalCalls" && row.internationalCalls) ||
        (activeChip === "unlimitedData" && row.unlimitedData) ||
        (activeChip === "cheapest" && row.cheapest) ||
        (activeChip === "eSimSupport" && row.eSimSupport);
      return matchesQuery && matchesChip;
    });

    list = [...list].sort((a, b) => {
      if (sortKey === "name") return a.name.localeCompare(b.name);
      if (sortKey === "monthlyCost") {
        const cost = (s: string) =>
          parseFloat(s.replace(/[^0-9.]/g, "")) || 999;
        return cost(a.monthlyCost) - cost(b.monthlyCost);
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
          toolSlug={SIM_TOOL_SLUG}
          path={path}
        />
      ) : (
        <ComparisonCards
          rows={filtered}
          toolSlug={SIM_TOOL_SLUG}
          path={path}
        />
      )}
    </div>
  );
}
