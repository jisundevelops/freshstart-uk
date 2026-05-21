import { NextResponse } from "next/server";
import { toApiErrorResponse } from "@/lib/errors";

export function apiSuccess<T>(
  data: T,
  status = 200,
  headers?: HeadersInit
): NextResponse {
  return NextResponse.json({ success: true, data }, { status, headers });
}

export function apiError(error: unknown): NextResponse {
  const { status, body } = toApiErrorResponse(error);
  return NextResponse.json({ success: false, ...body }, { status });
}

export function apiNoContent(): NextResponse {
  return new NextResponse(null, { status: 204 });
}
