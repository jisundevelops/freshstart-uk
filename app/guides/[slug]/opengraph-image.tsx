import { fetchGuideBySlug } from "@/lib/data";
import { createOgImage, ogContentType, ogSize } from "@/lib/og";

export const size = ogSize;
export const contentType = ogContentType;

interface OgProps {
  params: { slug: string };
}

export default async function Image({ params }: OgProps) {
  const guide = await fetchGuideBySlug(params.slug);
  const title = guide?.title ?? "Student Guide";
  const subtitle = guide?.excerpt;

  return createOgImage(title, subtitle);
}
