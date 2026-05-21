"use client";

import { useMemo, useState } from "react";
import { Search } from "lucide-react";
import { GuideCard } from "@/components/content/guide-card";
import { EmptyState } from "@/components/content/empty-state";
import { Input } from "@/components/ui/input";
import { cn, formatLabel } from "@/lib/utils";
import type { GuideListItem } from "@/types/content";

interface GuidesExplorerProps {
  guides: GuideListItem[];
  categories: string[];
}

export function GuidesExplorer({ guides, categories }: GuidesExplorerProps) {
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState<string | null>(null);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return guides.filter((guide) => {
      const matchesCategory = !category || guide.category === category;
      const matchesQuery =
        !q ||
        guide.title.toLowerCase().includes(q) ||
        guide.excerpt.toLowerCase().includes(q) ||
        guide.category.toLowerCase().includes(q);
      return matchesCategory && matchesQuery;
    });
  }, [guides, query, category]);

  return (
    <div>
      <div className="mb-8 flex flex-col gap-4 md:flex-row md:items-center">
        <div className="relative flex-1">
          <Search
            className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted"
            aria-hidden
          />
          <Input
            type="search"
            placeholder="Search guides…"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="pl-10"
            aria-label="Search guides"
          />
        </div>
        <div
          className="flex flex-wrap gap-2"
          role="group"
          aria-label="Filter by category"
        >
          <button
            type="button"
            onClick={() => setCategory(null)}
            className={cn(
              "rounded-full border px-4 py-1.5 text-sm transition-colors",
              category === null
                ? "border-accent bg-accent/10 text-accent"
                : "border-border text-muted-foreground hover:border-accent/40"
            )}
          >
            All
          </button>
          {categories.map((cat) => (
            <button
              key={cat}
              type="button"
              onClick={() => setCategory(cat)}
              className={cn(
                "rounded-full border px-4 py-1.5 text-sm transition-colors",
                category === cat
                  ? "border-accent bg-accent/10 text-accent"
                  : "border-border text-muted-foreground hover:border-accent/40"
              )}
            >
              {formatLabel(cat)}
            </button>
          ))}
        </div>
      </div>

      {filtered.length === 0 ? (
        <EmptyState
          title="No guides found"
          description="Try a different search term or category filter."
          actionLabel="Clear filters"
          actionHref="/guides"
        />
      ) : (
        <ul className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {filtered.map((guide) => (
            <li key={guide.id}>
              <GuideCard guide={guide} />
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
