import { SITE_TAGLINE, SITE_NAME } from "@/lib/constants";
import { createOgImage, ogContentType, ogSize } from "@/lib/og";

export const runtime = "edge";
export const alt = SITE_NAME;
export const size = ogSize;
export const contentType = ogContentType;

export default function Image() {
  return createOgImage(SITE_NAME, SITE_TAGLINE);
}
