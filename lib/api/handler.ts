import type { NextRequest } from "next/server";
import { ZodSchema } from "zod";
import { ValidationError } from "@/lib/errors";
import { checkRateLimit, type RateLimitPreset } from "@/lib/rate-limit";

type RouteHandler<T> = (
  request: NextRequest,
  context: { params: Record<string, string>; body: T }
) => Promise<Response>;

interface ApiHandlerOptions<TBody> {
  schema?: ZodSchema<TBody>;
  rateLimit?: RateLimitPreset;
  requireAuth?: boolean;
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
      if (options.schema && request.method !== "GET") {
        const json: unknown = await request.json();
        const parsed = options.schema.safeParse(json);
        if (!parsed.success) {
          throw new ValidationError(parsed.error.message);
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
