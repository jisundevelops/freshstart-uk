import { z } from "zod";

const serverSchema = z.object({
  NODE_ENV: z
    .enum(["development", "test", "production"])
    .default("development"),
  DATABASE_URL: z.string().min(1),
  NEXTAUTH_SECRET: z.string().min(32),
  NEXTAUTH_URL: z.string().url(),
  UPSTASH_REDIS_REST_URL: z.string().url().optional(),
  UPSTASH_REDIS_REST_TOKEN: z.string().min(1).optional(),
  ADMIN_SEED_PASSWORD: z.string().min(8).optional(),
});

const clientSchema = z.object({
  NEXT_PUBLIC_APP_URL: z.string().url(),
});

export type ServerEnv = z.infer<typeof serverSchema>;
export type ClientEnv = z.infer<typeof clientSchema>;

function parseServerEnv(): ServerEnv {
  const isBuild = process.env.npm_lifecycle_event === "build";

  const parsed = serverSchema.safeParse({
    NODE_ENV: process.env.NODE_ENV,
    DATABASE_URL: process.env.DATABASE_URL,
    NEXTAUTH_SECRET:
      process.env.NEXTAUTH_SECRET ??
      (isBuild
        ? "build-time-placeholder-secret-min-32-chars"
        : undefined),
    NEXTAUTH_URL:
      process.env.NEXTAUTH_URL ??
      process.env.NEXT_PUBLIC_APP_URL ??
      "http://localhost:3000",
    UPSTASH_REDIS_REST_URL: process.env.UPSTASH_REDIS_REST_URL,
    UPSTASH_REDIS_REST_TOKEN: process.env.UPSTASH_REDIS_REST_TOKEN,
    ADMIN_SEED_PASSWORD: process.env.ADMIN_SEED_PASSWORD,
  });

  if (!parsed.success) {
    const message = parsed.error.flatten().fieldErrors;
    throw new Error(
      `Invalid server environment variables: ${JSON.stringify(message)}`
    );
  }

  return parsed.data;
}

function parseClientEnv(): ClientEnv {
  const parsed = clientSchema.safeParse({
    NEXT_PUBLIC_APP_URL:
      process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3000",
  });

  if (!parsed.success) {
    throw new Error("Invalid client environment variables");
  }

  return parsed.data;
}

export const serverEnv = parseServerEnv();
export const clientEnv = parseClientEnv();

export function hasRedis(): boolean {
  return Boolean(
    serverEnv.UPSTASH_REDIS_REST_URL && serverEnv.UPSTASH_REDIS_REST_TOKEN
  );
}
