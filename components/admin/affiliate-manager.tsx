"use client";

import { useState, useTransition } from "react";
import { toast } from "sonner";
import { Copy, Trash2 } from "lucide-react";
import {
  saveAffiliate,
  deleteAffiliate,
} from "@/actions/admin/affiliates";
import { AffiliateCategory, PublishStatus } from "@prisma/client";
import type { AffiliateLink } from "@prisma/client";
import { StatusBadge } from "@/components/admin/status-badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { generateSlug } from "@/lib/admin/slug";

interface AffiliateManagerProps {
  affiliates: AffiliateLink[];
  clickCounts: { slug: string; name: string; count: number }[];
  readOnly?: boolean;
}

export function AffiliateManager({
  affiliates: initial,
  clickCounts,
  readOnly,
}: AffiliateManagerProps) {
  const [affiliates, setAffiliates] = useState(initial);
  const [filter, setFilter] = useState<string>("all");
  const [editing, setEditing] = useState<Partial<AffiliateLink> | null>(null);
  const [pending, startTransition] = useTransition();

  const filtered =
    filter === "all"
      ? affiliates
      : affiliates.filter((a) => a.category === filter);

  const clicksMap = new Map(clickCounts.map((c) => [c.slug, c.count]));

  function startNew() {
    setEditing({
      name: "",
      slug: "",
      description: "",
      url: "",
      category: AffiliateCategory.BANK,
      status: PublishStatus.PUBLISHED,
      featured: false,
      sortOrder: 0,
    });
  }

  function handleSave(e: React.FormEvent) {
    e.preventDefault();
    if (!editing || readOnly) return;

    startTransition(async () => {
      const result = await saveAffiliate(
        {
          name: editing.name!,
          slug: editing.slug!,
          description: editing.description!,
          url: editing.url!,
          category: editing.category!,
          logoUrl: editing.logoUrl ?? "",
          promoCode: editing.promoCode ?? "",
          featured: editing.featured ?? false,
          sortOrder: editing.sortOrder ?? 0,
          status: editing.status ?? PublishStatus.PUBLISHED,
        },
        "id" in editing && editing.id ? editing.id : undefined
      );

      if (result.success) {
        toast.success("Affiliate saved");
        setEditing(null);
        window.location.reload();
      } else {
        toast.error(result.error);
      }
    });
  }

  function handleDelete(id: string) {
    if (!confirm("Delete this affiliate link?")) return;
    startTransition(async () => {
      const result = await deleteAffiliate(id);
      if (result.success) {
        toast.success("Deleted");
        setAffiliates((list) => list.filter((a) => a.id !== id));
      } else toast.error(result.error);
    });
  }

  return (
    <div className="space-y-8">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <select
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
          className="rounded-md border border-border bg-surface/50 px-3 py-2 text-sm"
          aria-label="Filter by category"
        >
          <option value="all">All categories</option>
          {Object.values(AffiliateCategory).map((c) => (
            <option key={c} value={c}>
              {c}
            </option>
          ))}
        </select>
        {!readOnly && (
          <Button type="button" onClick={startNew}>
            Add affiliate
          </Button>
        )}
      </div>

      {editing && !readOnly && (
        <Card className="glass-strong">
          <CardHeader>
            <CardTitle>
              {editing.id ? "Edit affiliate" : "New affiliate"}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSave} className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <Label>Name</Label>
                <Input
                  value={editing.name ?? ""}
                  onChange={(e) => {
                    setEditing({
                      ...editing,
                      name: e.target.value,
                      slug: editing.id
                        ? editing.slug
                        : generateSlug(e.target.value),
                    });
                  }}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label>Slug</Label>
                <Input
                  value={editing.slug ?? ""}
                  onChange={(e) =>
                    setEditing({ ...editing, slug: e.target.value })
                  }
                  required
                />
              </div>
              <div className="space-y-2 md:col-span-2">
                <Label>URL</Label>
                <Input
                  type="url"
                  value={editing.url ?? ""}
                  onChange={(e) =>
                    setEditing({ ...editing, url: e.target.value })
                  }
                  required
                />
              </div>
              <div className="space-y-2 md:col-span-2">
                <Label>Description</Label>
                <Input
                  value={editing.description ?? ""}
                  onChange={(e) =>
                    setEditing({ ...editing, description: e.target.value })
                  }
                />
              </div>
              <div className="flex gap-2 md:col-span-2">
                <Button type="submit" disabled={pending}>
                  Save
                </Button>
                <Button
                  type="button"
                  variant="ghost"
                  onClick={() => setEditing(null)}
                >
                  Cancel
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      )}

      <ul className="space-y-3">
        {filtered.map((link) => (
          <li key={link.id}>
            <Card className="glass">
              <CardContent className="flex flex-col gap-3 p-4 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="font-medium">{link.name}</span>
                    <StatusBadge status={link.status} />
                    <span className="text-xs text-muted">
                      {clicksMap.get(link.slug) ?? 0} clicks (30d)
                    </span>
                  </div>
                  <p className="mt-1 text-sm text-muted-foreground">
                    {link.description}
                  </p>
                </div>
                <div className="flex shrink-0 gap-2">
                  <Button
                    type="button"
                    size="sm"
                    variant="outline"
                    onClick={() => {
                      navigator.clipboard.writeText(link.url);
                      toast.success("URL copied");
                    }}
                  >
                    <Copy className="h-3.5 w-3.5" />
                  </Button>
                  {!readOnly && (
                    <>
                      <Button
                        type="button"
                        size="sm"
                        variant="secondary"
                        onClick={() => setEditing(link)}
                      >
                        Edit
                      </Button>
                      <Button
                        type="button"
                        size="sm"
                        variant="ghost"
                        onClick={() => handleDelete(link.id)}
                      >
                        <Trash2 className="h-3.5 w-3.5 text-red-400" />
                      </Button>
                    </>
                  )}
                </div>
              </CardContent>
            </Card>
          </li>
        ))}
      </ul>
    </div>
  );
}
