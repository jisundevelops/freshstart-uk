"use client";

import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";

interface FilterChip {
  id: string;
  label: string;
}

interface ComparisonFiltersProps {
  query: string;
  onQueryChange: (value: string) => void;
  chips?: FilterChip[];
  activeChip?: string | null;
  onChipChange?: (id: string | null) => void;
  sortOptions: { id: string; label: string }[];
  sortKey: string;
  onSortChange: (key: string) => void;
  viewMode: "table" | "cards";
  onViewModeChange: (mode: "table" | "cards") => void;
  resultCount: number;
}

export function ComparisonFilters({
  query,
  onQueryChange,
  chips,
  activeChip,
  onChipChange,
  sortOptions,
  sortKey,
  onSortChange,
  viewMode,
  onViewModeChange,
  resultCount,
}: ComparisonFiltersProps) {
  return (
    <div className="sticky top-16 z-40 -mx-4 mb-6 border-b border-border/50 bg-background/90 px-4 py-4 backdrop-blur-xl md:top-[4.5rem]">
      <div className="flex flex-col gap-4">
        <div className="relative">
          <Search
            className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted"
            aria-hidden
          />
          <Input
            type="search"
            value={query}
            onChange={(e) => onQueryChange(e.target.value)}
            placeholder="Search providers…"
            className="pl-10"
            aria-label="Search providers"
          />
        </div>

        <div className="flex flex-col gap-3 sm:flex-row sm:flex-wrap sm:items-center sm:justify-between">
          {chips && chips.length > 0 && onChipChange && (
            <div
              className="flex flex-wrap gap-2"
              role="group"
              aria-label="Filters"
            >
              <button
                type="button"
                onClick={() => onChipChange(null)}
                className={cn(
                  "rounded-full border px-3 py-1 text-xs font-medium transition-colors",
                  activeChip === null
                    ? "border-accent bg-accent/10 text-accent"
                    : "border-border text-muted-foreground hover:border-accent/40"
                )}
              >
                All
              </button>
              {chips.map((chip) => (
                <button
                  key={chip.id}
                  type="button"
                  onClick={() => onChipChange(chip.id)}
                  className={cn(
                    "rounded-full border px-3 py-1 text-xs font-medium transition-colors",
                    activeChip === chip.id
                      ? "border-accent bg-accent/10 text-accent"
                      : "border-border text-muted-foreground hover:border-accent/40"
                  )}
                >
                  {chip.label}
                </button>
              ))}
            </div>
          )}

          <div className="flex flex-wrap items-center gap-3">
            <label className="flex items-center gap-2 text-xs text-muted-foreground">
              Sort
              <select
                value={sortKey}
                onChange={(e) => onSortChange(e.target.value)}
                className="rounded-md border border-border bg-surface/50 px-2 py-1 text-sm text-foreground"
                aria-label="Sort by"
              >
                {sortOptions.map((opt) => (
                  <option key={opt.id} value={opt.id}>
                    {opt.label}
                  </option>
                ))}
              </select>
            </label>
            <div
              className="flex rounded-md border border-border p-0.5"
              role="group"
              aria-label="View mode"
            >
              {(["table", "cards"] as const).map((mode) => (
                <button
                  key={mode}
                  type="button"
                  onClick={() => onViewModeChange(mode)}
                  className={cn(
                    "rounded px-2.5 py-1 text-xs font-medium capitalize transition-colors",
                    viewMode === mode
                      ? "bg-accent/15 text-accent"
                      : "text-muted-foreground hover:text-foreground"
                  )}
                  aria-pressed={viewMode === mode}
                >
                  {mode}
                </button>
              ))}
            </div>
            <span className="text-xs text-muted" aria-live="polite">
              {resultCount} result{resultCount !== 1 ? "s" : ""}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
