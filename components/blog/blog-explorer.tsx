"use client";

import { useMemo, useState } from "react";
import { BlogCard } from "@/components/content/blog-card";
import { EmptyState } from "@/components/content/empty-state";
import { cn } from "@/lib/utils";
import type { BlogListItem } from "@/types/content";

interface BlogExplorerProps {
  posts: BlogListItem[];
  tags: string[];
}

export function BlogExplorer({ posts, tags }: BlogExplorerProps) {
  const [tag, setTag] = useState<string | null>(null);

  const filtered = useMemo(() => {
    if (!tag) return posts;
    return posts.filter((post) => post.tags.includes(tag));
  }, [posts, tag]);

  return (
    <div>
      {tags.length > 0 && (
        <div
          className="mb-8 flex flex-wrap gap-2"
          role="group"
          aria-label="Filter by tag"
        >
          <button
            type="button"
            onClick={() => setTag(null)}
            className={cn(
              "rounded-full border px-4 py-1.5 text-sm transition-colors",
              tag === null
                ? "border-accent bg-accent/10 text-accent"
                : "border-border text-muted-foreground hover:border-accent/40"
            )}
          >
            All topics
          </button>
          {tags.map((t) => (
            <button
              key={t}
              type="button"
              onClick={() => setTag(t)}
              className={cn(
                "rounded-full border px-4 py-1.5 text-sm transition-colors",
                tag === t
                  ? "border-accent bg-accent/10 text-accent"
                  : "border-border text-muted-foreground hover:border-accent/40"
              )}
            >
              {t}
            </button>
          ))}
        </div>
      )}

      {filtered.length === 0 ? (
        <EmptyState
          title="No posts found"
          description="No blog posts match this tag yet."
          actionLabel="View all posts"
          actionHref="/blog"
        />
      ) : (
        <ul className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {filtered.map((post) => (
            <li key={post.id}>
              <BlogCard post={post} />
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
