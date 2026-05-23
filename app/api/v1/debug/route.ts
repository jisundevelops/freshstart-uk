import { NextResponse } from "next/server";

export async function GET() {
  const debug: Record<string, unknown> = {
    timestamp: new Date().toISOString(),
    nodeEnv: process.env.NODE_ENV,
    hasDatabaseUrl: Boolean(process.env.DATABASE_URL),
    databaseUrlPrefix: process.env.DATABASE_URL?.substring(0, 30) + "...",
    hasRedis: Boolean(process.env.UPSTASH_REDIS_REST_URL),
    hasNextAuthSecret: Boolean(process.env.NEXTAUTH_SECRET),
    hasNextAuthUrl: Boolean(process.env.NEXTAUTH_URL),
  };

  try {
    const { prisma } = await import("@/lib/prisma");
    const guideCount = await prisma.guide.count();
    const blogCount = await prisma.blogPost.count();
    debug.databaseConnected = true;
    debug.guideCount = guideCount;
    debug.blogCount = blogCount;
  } catch (error: unknown) {
    debug.databaseConnected = false;
    debug.databaseError = error instanceof Error ? error.message : String(error);
  }

  return NextResponse.json({ success: true, debug });
}
