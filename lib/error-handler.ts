export type ActionResponse<T = null> = {
  success: boolean;
  data?: T;
  error?: string;
  code?: string;
};

export function createSuccessResponse<T>(data?: T): ActionResponse<T> {
  return {
    success: true,
    data,
  };
}

export function createErrorResponse(
  error: unknown,
  defaultMessage: string = "Something went wrong. Please try again."
): ActionResponse {
  // Re-throw Next.js redirect errors to avoid logging them as real errors
  const maybeRedirectError = error as Error & { digest?: string };
  if (error instanceof Error && maybeRedirectError.digest?.startsWith("NEXT_REDIRECT")) {
    throw error;
  }

  let message = defaultMessage;
  let code: string | undefined;

  if (error instanceof Error) {
    message = error.message;
    if (error.message.includes("Unique constraint failed")) {
      message = "This record already exists";
      code = "DUPLICATE";
    }
  } else if (typeof error === "string") {
    message = error;
  }

  console.error("[Action Error]", error);

  return {
    success: false,
    error: message,
    code,
  };
}
