import { fetchBlogPostBySlug } from "@/lib/data";
import { createOgImage, ogContentType, ogSize } from "@/lib/og";

export const size = ogSize;
export const contentType = ogContentType;

interface OgProps {
  params: { slug: string };
}

export default async function Image({ params }: OgProps) {
  const post = await fetchBlogPostBySlug(params.slug);
  const title = post?.title ?? "Blog Article";
  const subtitle = post?.excerpt;

  return createOgImage(title, subtitle);
}
