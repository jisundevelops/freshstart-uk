import { getPublishedBlogPosts, getBlogPostBySlug } from "@/actions/blog";
import { getPublishedGuides, getGuideBySlug } from "@/actions/guides";
import { getPublishedTools } from "@/actions/tools";
import type { BlogListItem, GuideListItem, ToolListItem } from "@/types/content";

export async function fetchPublishedGuides(
  input?: Parameters<typeof getPublishedGuides>[0]
): Promise<GuideListItem[]> {
  const result = await getPublishedGuides(input);
  return result.success ? result.data : [];
}

export async function fetchGuideBySlug(slug: string) {
  const result = await getGuideBySlug(slug);
  return result.success ? result.data : null;
}

export async function fetchPublishedBlogPosts(
  input?: Parameters<typeof getPublishedBlogPosts>[0]
): Promise<BlogListItem[]> {
  const result = await getPublishedBlogPosts(input);
  return result.success ? result.data : [];
}

export async function fetchBlogPostBySlug(slug: string) {
  const result = await getBlogPostBySlug(slug);
  return result.success ? result.data : null;
}

export async function fetchPublishedTools(): Promise<ToolListItem[]> {
  const result = await getPublishedTools();
  return result.success ? result.data : [];
}
