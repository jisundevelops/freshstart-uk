"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { toast } from "sonner";
import { createBlogPost, updateBlogPost } from "@/actions/admin/blog";
import { generateSlug } from "@/lib/admin/slug";
import { RichTextEditor } from "@/components/admin/rich-text-editor";
import { SeoFields, type SeoFieldsValue } from "@/components/admin/seo-fields";
import { ImageUpload } from "@/components/admin/image-upload";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import type { BlogPost } from "@prisma/client";
import { PublishStatus } from "@prisma/client";

interface BlogFormProps {
  post?: BlogPost;
  seo?: SeoFieldsValue;
  readOnly?: boolean;
}

export function BlogForm({ post, seo: initialSeo, readOnly }: BlogFormProps) {
  const router = useRouter();
  const [pending, startTransition] = useTransition();
  const [title, setTitle] = useState(post?.title ?? "");
  const [slug, setSlug] = useState(post?.slug ?? "");
  const [excerpt, setExcerpt] = useState(post?.excerpt ?? "");
  const [content, setContent] = useState(post?.content ?? "<p></p>");
  const [authorName, setAuthorName] = useState(
    post?.authorName ?? "FreshStart UK Team"
  );
  const [coverImage, setCoverImage] = useState(post?.coverImage ?? "");
  const [tagsInput, setTagsInput] = useState(post?.tags.join(", ") ?? "");
  const [status, setStatus] = useState<PublishStatus>(
    post?.status ?? PublishStatus.DRAFT
  );
  const [featured, setFeatured] = useState(post?.featured ?? false);
  const [seo, setSeo] = useState<SeoFieldsValue>(
    initialSeo ?? { metaTitle: "", metaDesc: "", ogImage: "" }
  );

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (readOnly) return;

    const tags = tagsInput
      .split(",")
      .map((t) => t.trim())
      .filter(Boolean);

    const payload = {
      title,
      slug,
      excerpt,
      content,
      authorName,
      coverImage,
      tags,
      status,
      featured,
      seo,
    };

    startTransition(async () => {
      const result = post
        ? await updateBlogPost(post.id, payload)
        : await createBlogPost(payload);

      if (result.success) {
        toast.success(post ? "Post updated" : "Post created");
        router.push("/admin/blog");
        router.refresh();
      } else {
        toast.error(result.error);
      }
    });
  }

  return (
    <form onSubmit={handleSubmit} className="mx-auto max-w-4xl space-y-6">
      <div className="flex flex-wrap justify-between gap-4">
        <h2 className="font-heading text-xl font-semibold">
          {post ? "Edit post" : "New post"}
        </h2>
        {post?.status === PublishStatus.PUBLISHED && (
          <Button variant="outline" size="sm" asChild>
            <Link href={`/blog/${post.slug}`} target="_blank">
              Preview live
            </Link>
          </Button>
        )}
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <div className="space-y-2">
          <Label htmlFor="title">Title</Label>
          <Input
            id="title"
            value={title}
            onChange={(e) => {
              setTitle(e.target.value);
              if (!post) setSlug(generateSlug(e.target.value));
            }}
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

      <div className="grid gap-4 md:grid-cols-2">
        <div className="space-y-2">
          <Label htmlFor="author">Author</Label>
          <Input
            id="author"
            value={authorName}
            onChange={(e) => setAuthorName(e.target.value)}
            disabled={readOnly}
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="tags">Tags (comma-separated)</Label>
          <Input
            id="tags"
            value={tagsInput}
            onChange={(e) => setTagsInput(e.target.value)}
            disabled={readOnly}
          />
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="status">Status</Label>
        <select
          id="status"
          value={status}
          onChange={(e) => setStatus(e.target.value as PublishStatus)}
          disabled={readOnly}
          className="flex h-10 w-full max-w-xs rounded-md border border-border bg-surface/50 px-3 text-sm"
        >
          {Object.values(PublishStatus).map((s) => (
            <option key={s} value={s}>
              {s}
            </option>
          ))}
        </select>
      </div>

      {!readOnly && (
        <ImageUpload
          label="Cover image"
          value={coverImage}
          onChange={setCoverImage}
          folder="blog"
        />
      )}

      <RichTextEditor
        content={content}
        onChange={setContent}
        editable={!readOnly}
      />

      <SeoFields value={seo} onChange={setSeo} />

      {!readOnly && (
        <Button type="submit" disabled={pending}>
          {pending ? "Saving…" : post ? "Update post" : "Publish draft"}
        </Button>
      )}
    </form>
  );
}
