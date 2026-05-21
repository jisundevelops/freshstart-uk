import { apiSuccess } from "@/lib/api/response";
import { createApiHandler } from "@/lib/api/handler";

export const GET = createApiHandler(
  async () => {
    return apiSuccess({
      status: "ok",
      service: "freshstart-uk",
      timestamp: new Date().toISOString(),
    });
  },
  { rateLimit: "api" }
);
