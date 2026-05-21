import { getToken } from "next-auth/jwt";
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { checkRateLimit } from "@/lib/rate-limit";

const SECURITY_HEADERS: Record<string, string> = {
  "X-Frame-Options": "DENY",
  "X-Content-Type-Options": "nosniff",
  "Referrer-Policy": "strict-origin-when-cross-origin",
  "Permissions-Policy": "camera=(), microphone=(), geolocation=()",
  "Strict-Transport-Security":
    "max-age=63072000; includeSubDomains; preload",
  "Content-Security-Policy": [
    "default-src 'self'",
    "script-src 'self' 'unsafe-inline' 'unsafe-eval'",
    "style-src 'self' 'unsafe-inline'",
    "img-src 'self' data: blob: https://res.cloudinary.com",
    "font-src 'self' https://fonts.gstatic.com https://fonts.googleapis.com",
    "connect-src 'self' https://*.upstash.io",
    "frame-ancestors 'none'",
    "base-uri 'self'",
    "form-action 'self'",
  ].join("; "),
};

const PUBLIC_ADMIN_PATHS = ["/admin/login"];

/** Validate that a callbackUrl is a safe relative path to prevent open redirect */
function isSafeCallbackUrl(pathname: string): boolean {
  if (!pathname.startsWith("/")) return false;
  if (pathname.startsWith("//")) return false;
  if (pathname.includes("\\")) return false;
  return true;
}

function requiresAuth(pathname: string): boolean {
  if (PUBLIC_ADMIN_PATHS.includes(pathname)) return false;
  if (pathname.startsWith("/admin")) return true;
  if (pathname.startsWith("/api/v1/admin")) return true;
  return false;
}

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  if (pathname.startsWith("/api/v1/")) {
    const preset: "api" | "admin" = pathname.includes("/admin")
      ? "admin"
      : "api";
    const limited = await checkRateLimit(request, preset);
    if (!limited.success) {
      return NextResponse.json(
        {
          success: false,
          error: "Too many requests",
          code: "RATE_LIMITED",
        },
        {
          status: 429,
          headers: {
            "Retry-After": String(limited.retryAfter ?? 60),
          },
        }
      );
    }
  }

  if (pathname.startsWith("/api/auth")) {
    const limited = await checkRateLimit(request, "auth");
    if (!limited.success) {
      return NextResponse.json(
        { success: false, error: "Too many requests", code: "RATE_LIMITED" },
        { status: 429 }
      );
    }
  }

  if (requiresAuth(pathname)) {
    const token = await getToken({
      req: request,
      secret: process.env.NEXTAUTH_SECRET,
    });

    if (!token) {
      if (pathname.startsWith("/api/")) {
        return NextResponse.json(
          { success: false, error: "Unauthorized", code: "UNAUTHORIZED" },
          { status: 401 }
        );
      }

      const loginUrl = new URL("/admin/login", request.url);
      if (isSafeCallbackUrl(pathname)) {
        loginUrl.searchParams.set("callbackUrl", pathname);
      }
      return NextResponse.redirect(loginUrl);
    }
  }

  const response = NextResponse.next();

  Object.entries(SECURITY_HEADERS).forEach(([key, value]) => {
    response.headers.set(key, value);
  });

  response.headers.set("x-pathname", pathname);

  return response;
}

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
};
