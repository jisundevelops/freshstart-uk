import { prisma } from "@/lib/prisma";
import { PublishStatus } from "@prisma/client";
import { notFound } from "next/navigation";

export const dynamic = "force-dynamic";
export const dynamicParams = true;

interface Props {
  params: { slug: string };
}

export default async function TestDynamicPage({ params }: Props) {
  const guide = await prisma.guide.findFirst({
    where: { slug: params.slug, status: PublishStatus.PUBLISHED },
  });

  if (!guide) {
    notFound();
  }

  return (
    <div>
      <h1>{guide.title}</h1>
      <p>{guide.excerpt}</p>
      <p>Slug: {params.slug}</p>
    </div>
  );
}
