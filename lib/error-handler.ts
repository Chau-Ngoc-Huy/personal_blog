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
  defaultMessage: string = "Có lỗi xảy ra. Vui lòng thử lại."
): ActionResponse {
  let message = defaultMessage;
  let code: string | undefined;

  if (error instanceof Error) {
    message = error.message;
    if (error.message.includes("Unique constraint failed")) {
      message = "Dữ liệu này đã tồn tại";
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
