import { prisma } from "@/lib/prisma";
import { PublishStatus } from "@prisma/client";
import { notFound } from "next/navigation";
import { cacheGetOrSet, cacheKey } from "@/lib/redis";

export const dynamic = "force-dynamic";
export const dynamicParams = true;

interface Props {
  params: { slug: string };
}

export default async function TestDynamicPage({ params }: Props) {
  let guide;
  try {
    guide = await cacheGetOrSet(
      cacheKey("guides", `slug:${params.slug}`),
      () =>
        prisma.guide.findFirst({
          where: { slug: params.slug, status: PublishStatus.PUBLISHED },
        }),
      600
    );
  } catch {
    notFound();
  }

  if (!guide) {
    notFound();
  }

  return (
    <div>
      <h1>{guide.title}</h1>
      <p>{guide.excerpt}</p>
      <p>Slug: {params.slug}</p>
      <p>Cache: working</p>
    </div>
  );
}
