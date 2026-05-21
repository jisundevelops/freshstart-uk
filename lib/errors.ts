export class AppError extends Error {
  readonly statusCode: number;
  readonly code: string;
  readonly isOperational: boolean;

  constructor(
    message: string,
    options: {
      statusCode?: number;
      code?: string;
      cause?: unknown;
      isOperational?: boolean;
    } = {}
  ) {
    super(message, { cause: options.cause });
    this.name = "AppError";
    this.statusCode = options.statusCode ?? 500;
    this.code = options.code ?? "INTERNAL_ERROR";
    this.isOperational = options.isOperational ?? true;
  }
}

export class ValidationError extends AppError {
  constructor(message: string, cause?: unknown) {
    super(message, {
      statusCode: 400,
      code: "VALIDATION_ERROR",
      cause,
      isOperational: true,
    });
    this.name = "ValidationError";
  }
}

export class AuthError extends AppError {
  constructor(message = "Unauthorized") {
    super(message, {
      statusCode: 401,
      code: "UNAUTHORIZED",
      isOperational: true,
    });
    this.name = "AuthError";
  }
}

export class NotFoundError extends AppError {
  constructor(resource: string) {
    super(`${resource} not found`, {
      statusCode: 404,
      code: "NOT_FOUND",
      isOperational: true,
    });
    this.name = "NotFoundError";
  }
}

export class RateLimitError extends AppError {
  readonly retryAfter?: number;

  constructor(retryAfter?: number) {
    super("Too many requests", {
      statusCode: 429,
      code: "RATE_LIMITED",
      isOperational: true,
    });
    this.name = "RateLimitError";
    this.retryAfter = retryAfter;
  }
}

export function getErrorMessage(error: unknown): string {
  if (error instanceof Error) return error.message;
  if (typeof error === "string") return error;
  return "An unexpected error occurred";
}

export function toActionResult<T>(
  fn: () => Promise<T>
): Promise<{ success: true; data: T } | { success: false; error: string }> {
  return fn()
    .then((data) => ({ success: true as const, data }))
    .catch((error: unknown) => ({
      success: false as const,
      error: getErrorMessage(error),
    }));
}

export function toApiErrorResponse(error: unknown): {
  status: number;
  body: { error: string; code: string };
} {
  if (error instanceof AppError) {
    return {
      status: error.statusCode,
      body: { error: error.message, code: error.code },
    };
  }

  console.error("[api] Unhandled error:", error);
  return {
    status: 500,
    body: { error: "Internal server error", code: "INTERNAL_ERROR" },
  };
}
