import { prisma } from "@/lib/prisma";
import { PublishStatus } from "@prisma/client";

export const dynamic = "force-dynamic";

export default async function TestGuidePage() {
  const guides = await prisma.guide.findMany({
    where: { status: PublishStatus.PUBLISHED },
    take: 5,
    select: { slug: true, title: true },
  });

  return (
    <div>
      <h1>Test Guide Page</h1>
      <pre>{JSON.stringify(guides, null, 2)}</pre>
    </div>
  );
}
