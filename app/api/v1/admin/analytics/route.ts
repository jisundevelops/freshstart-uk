import { getAnalyticsSummary } from "@/lib/analytics";
import { apiSuccess } from "@/lib/api/response";
import { createApiHandler } from "@/lib/api/handler";
import { analyticsQuerySchema } from "@/lib/validations/analytics";
import { ValidationError } from "@/lib/errors";

export const dynamic = "force-dynamic";

export const GET = createApiHandler(
  async (request) => {
    const params = Object.fromEntries(request.nextUrl.searchParams);
    const parsed = analyticsQuerySchema.safeParse(params);
    if (!parsed.success) {
      throw new ValidationError(parsed.error.message);
    }
    const { days } = parsed.data;
    const summary = await getAnalyticsSummary(days);
    return apiSuccess({ summary });
  },
  { rateLimit: "api", requireAuth: true }
);
