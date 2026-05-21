"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { toast } from "sonner";
import { createGuide, updateGuideById } from "@/actions/admin/guides";
import { generateSlug } from "@/lib/admin/slug";
import { RichTextEditor } from "@/components/admin/rich-text-editor";
import { SeoFields, type SeoFieldsValue } from "@/components/admin/seo-fields";
import { ImageUpload } from "@/components/admin/image-upload";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import type { Guide } from "@prisma/client";
import { PublishStatus } from "@prisma/client";

const CATEGORIES = ["banking", "mobile", "health", "work", "visa", "general"];

interface GuideFormProps {
  guide?: Guide;
  seo?: SeoFieldsValue;
  readOnly?: boolean;
}

export function GuideForm({ guide, seo: initialSeo, readOnly }: GuideFormProps) {
  const router = useRouter();
  const [pending, startTransition] = useTransition();
  const [title, setTitle] = useState(guide?.title ?? "");
  const [slug, setSlug] = useState(guide?.slug ?? "");
  const [excerpt, setExcerpt] = useState(guide?.excerpt ?? "");
  const [content, setContent] = useState(guide?.content ?? "<p></p>");
  const [category, setCategory] = useState(guide?.category ?? "general");
  const [coverImage, setCoverImage] = useState(guide?.coverImage ?? "");
  const [status, setStatus] = useState<PublishStatus>(
    guide?.status ?? PublishStatus.DRAFT
  );
  const [featured, setFeatured] = useState(guide?.featured ?? false);
  const [sortOrder, setSortOrder] = useState(guide?.sortOrder ?? 0);
  const [seo, setSeo] = useState<SeoFieldsValue>(
    initialSeo ?? { metaTitle: "", metaDesc: "", ogImage: "" }
  );

  function handleTitleChange(v: string) {
    setTitle(v);
    if (!guide) setSlug(generateSlug(v));
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (readOnly) return;

    const payload = {
      title,
      slug,
      excerpt,
      content,
      category,
      coverImage,
      status,
      featured,
      sortOrder,
      seo,
    };

    startTransition(async () => {
      const result = guide
        ? await updateGuideById(guide.id, payload)
        : await createGuide(payload);

      if (result.success) {
        toast.success(guide ? "Guide updated" : "Guide created");
        router.push("/admin/guides");
        router.refresh();
      } else {
        toast.error(result.error);
      }
    });
  }

  return (
    <form onSubmit={handleSubmit} className="mx-auto max-w-4xl space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <h2 className="font-heading text-xl font-semibold">
          {guide ? "Edit guide" : "New guide"}
        </h2>
        <div className="flex gap-2">
          {guide?.status === PublishStatus.PUBLISHED && (
            <Button variant="outline" size="sm" asChild>
              <Link href={`/guides/${guide.slug}`} target="_blank">
                Preview live
              </Link>
            </Button>
          )}
          <Button variant="ghost" size="sm" asChild>
            <Link href="/admin/guides">Cancel</Link>
          </Button>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <div className="space-y-2">
          <Label htmlFor="title">Title</Label>
          <Input
            id="title"
            value={title}
            onChange={(e) => handleTitleChange(e.target.value)}
            required
            disabled={readOnly}
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="slug">Slug</Label>
          <Input
            id="slug"
            value={slug}
            onChange={(e) => setSlug(e.target.value)}
            required
            disabled={readOnly}
          />
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="excerpt">Excerpt</Label>
        <Input
          id="excerpt"
          value={excerpt}
          onChange={(e) => setExcerpt(e.target.value)}
          required
          disabled={readOnly}
        />
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <div className="space-y-2">
          <Label htmlFor="category">Category</Label>
          <select
            id="category"
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            disabled={readOnly}
            className="flex h-10 w-full rounded-md border border-border bg-surface/50 px-3 text-sm"
          >
            {CATEGORIES.map((c) => (
              <option key={c} value={c}>
                {c}
              </option>
            ))}
          </select>
        </div>
        <div className="space-y-2">
          <Label htmlFor="status">Status</Label>
          <select
            id="status"
            value={status}
            onChange={(e) => setStatus(e.target.value as PublishStatus)}
            disabled={readOnly}
            className="flex h-10 w-full rounded-md border border-border bg-surface/50 px-3 text-sm"
          >
            {Object.values(PublishStatus).map((s) => (
              <option key={s} value={s}>
                {s}
              </option>
            ))}
          </select>
        </div>
        <div className="space-y-2">
          <Label htmlFor="sortOrder">Sort order</Label>
          <Input
            id="sortOrder"
            type="number"
            value={sortOrder}
            onChange={(e) => setSortOrder(Number(e.target.value))}
            disabled={readOnly}
          />
        </div>
      </div>

      <label className="flex items-center gap-2 text-sm">
        <input
          type="checkbox"
          checked={featured}
          onChange={(e) => setFeatured(e.target.checked)}
          disabled={readOnly}
        />
        Featured guide
      </label>

      {!readOnly && (
        <ImageUpload
          label="Cover image"
          value={coverImage}
          onChange={setCoverImage}
          folder="guides"
        />
      )}

      <div>
        <Label className="mb-2 block">Content</Label>
        <RichTextEditor
          content={content}
          onChange={setContent}
          editable={!readOnly}
        />
      </div>

      <SeoFields value={seo} onChange={setSeo} />

      {!readOnly && (
        <Button type="submit" disabled={pending}>
          {pending ? "Saving…" : guide ? "Update guide" : "Create guide"}
        </Button>
      )}
    </form>
  );
}
