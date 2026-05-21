import type { NextRequest } from "next/server";
import { z, ZodSchema } from "zod";
import { ValidationError } from "@/lib/errors";
import { checkRateLimit, type RateLimitPreset } from "@/lib/rate-limit";

type HttpMethod = "GET" | "POST" | "PUT" | "PATCH" | "DELETE";

type RouteHandler<T> = (
  request: NextRequest,
  context: { params: Record<string, string>; body: T }
) => Promise<Response>;

interface ApiHandlerOptions<TBody> {
  schema?: z.ZodType<TBody>;
  rateLimit?: RateLimitPreset;
  requireAuth?: boolean;
  methods?: HttpMethod[];
}

/** Maximum request body size in bytes (1 MB) */
const MAX_BODY_SIZE = 1024 * 1024;

/**
 * Validate CSRF by checking Origin / Referer header matches our host.
 * Next.js server actions have built-in CSRF, but API routes do not.
 */
function isCsrfValid(request: NextRequest): boolean {
  const origin = request.headers.get("origin");
  const referer = request.headers.get("referer");
  const host = request.headers.get("host");

  if (!host) return true; // Non-HTTP requests (unlikely but safe)

  const allowedOrigins = [host];

  if (origin) {
    const originHost = origin.replace(/^https?:\/\//, "");
    return allowedOrigins.some((h) => originHost === h);
  }

  if (referer) {
    try {
      const refererUrl = new URL(referer);
      return allowedOrigins.some((h) => refererUrl.host === h);
    } catch {
      return false;
    }
  }

  // GET/HEAD/OPTIONS don't need CSRF
  const method = request.method.toUpperCase();
  if (method === "GET" || method === "HEAD" || method === "OPTIONS") {
    return true;
  }

  // No origin or referer on a mutating request — reject
  return false;
}

export function createApiHandler<TBody = undefined>(
  handler: RouteHandler<TBody>,
  options: ApiHandlerOptions<TBody> = {}
) {
  return async (
    request: NextRequest,
    routeContext?: { params?: Promise<Record<string, string>> }
  ): Promise<Response> => {
    try {
      // Method validation
      if (options.methods && options.methods.length > 0) {
        const method = request.method.toUpperCase() as HttpMethod;
        if (!options.methods.includes(method)) {
          return new Response(
            JSON.stringify({
              success: false,
              error: "Method not allowed",
              code: "METHOD_NOT_ALLOWED",
            }),
            { status: 405, headers: { "Content-Type": "application/json" } }
          );
        }
      }

      // CSRF protection for mutating requests
      const method = request.method.toUpperCase();
      if (
        (method === "POST" ||
          method === "PUT" ||
          method === "PATCH" ||
          method === "DELETE") &&
        !isCsrfValid(request)
      ) {
        return new Response(
          JSON.stringify({
            success: false,
            error: "CSRF validation failed",
            code: "CSRF_ERROR",
          }),
          { status: 403, headers: { "Content-Type": "application/json" } }
        );
      }

      if (options.rateLimit) {
        const limited = await checkRateLimit(request, options.rateLimit);
        if (!limited.success) {
          return new Response(
            JSON.stringify({
              success: false,
              error: "Too many requests",
              code: "RATE_LIMITED",
            }),
            {
              status: 429,
              headers: {
                "Content-Type": "application/json",
                "Retry-After": String(limited.retryAfter ?? 60),
              },
            }
          );
        }
      }

      if (options.requireAuth) {
        const { getServerSession } = await import("next-auth");
        const { authOptions } = await import("@/lib/auth");
        const session = await getServerSession(authOptions);
        if (!session?.user) {
          return new Response(
            JSON.stringify({
              success: false,
              error: "Unauthorized",
              code: "UNAUTHORIZED",
            }),
            { status: 401, headers: { "Content-Type": "application/json" } }
          );
        }
      }

      let body = undefined as TBody;
      if (options.schema && method !== "GET") {
        const rawBody = await request.text();

        // Body size limit
        if (rawBody.length > MAX_BODY_SIZE) {
          return new Response(
            JSON.stringify({
              success: false,
              error: "Request body too large",
              code: "PAYLOAD_TOO_LARGE",
            }),
            { status: 413, headers: { "Content-Type": "application/json" } }
          );
        }

        let json: unknown;
        try {
          json = JSON.parse(rawBody);
        } catch {
          throw new ValidationError("Invalid JSON in request body");
        }

        const parsed = options.schema.safeParse(json);
        if (!parsed.success) {
          // Return first error message only — avoid leaking full Zod tree
          const firstError = parsed.error.issues[0];
          const message = firstError
            ? `${firstError.path.join(".")}: ${firstError.message}`
            : "Validation failed";
          throw new ValidationError(message);
        }
        body = parsed.data;
      }

      const params = routeContext?.params
        ? await routeContext.params
        : {};

      return handler(request, { params, body });
    } catch (error) {
      const { toApiErrorResponse } = await import("@/lib/errors");
      const { status, body } = toApiErrorResponse(error);
      return new Response(JSON.stringify({ success: false, ...body }), {
        status,
        headers: { "Content-Type": "application/json" },
      });
    }
  };
}
