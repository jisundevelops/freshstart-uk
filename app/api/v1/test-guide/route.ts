import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { cacheGetOrSet, cacheKey } from "@/lib/redis";
import { PublishStatus } from "@prisma/client";

export async function GET(request: Request) {
  const url = new URL(request.url);
  const slug = url.searchParams.get("slug") ?? "open-uk-bank-account";
  
  const result: Record<string, unknown> = { slug };

  try {
    const guide = await cacheGetOrSet(
      cacheKey("guides", `slug:${slug}`),
      () =>
        prisma.guide.findFirst({
          where: { slug, status: PublishStatus.PUBLISHED },
        }),
      600
    );
    result.found = Boolean(guide);
    result.title = guide?.title;
    result.contentLength = guide?.content?.length;
    result.cacheWorked = true;
  } catch (error: unknown) {
    result.cacheError = error instanceof Error ? error.message : String(error);
    result.cacheWorked = false;
    
    // Try without cache
    try {
      const guide = await prisma.guide.findFirst({
        where: { slug, status: PublishStatus.PUBLISHED },
      });
      result.found = Boolean(guide);
      result.title = guide?.title;
      result.directQueryWorked = true;
    } catch (error2: unknown) {
      result.directQueryError = error2 instanceof Error ? error2.message : String(error2);
      result.directQueryWorked = false;
    }
  }

  return NextResponse.json({ success: true, result });
}
