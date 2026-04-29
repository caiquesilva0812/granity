export const extractErrorMessage = (
  error: unknown,
  fallback = "An unexpected error occurred. Please try again.",
): string => {
  const data = (error as any)?.response?.data ?? (error as any)?.data ?? error;

  if (!data || (typeof data !== "object" && typeof data !== "string"))
    return fallback;

  if (data.message && typeof data.message === "string") return data.message;

  if (data.errors && typeof data.errors === "object") {
    const firstError = Object.values(data.errors)[0];
    return Array.isArray(firstError) ? firstError[0] : String(firstError);
  }

  if (data.response) {
    if (typeof data.response === "string") return data.response;
    if (Array.isArray(data.response)) return data.response.join(" ");
    if (typeof data.response === "object")
      return Object.values(data.response).flat().join(" ");
  }

  if (data.error && typeof data.error === "string") return data.error;
  if (typeof data === "string") return data;

  return fallback;
};

export const extractValidationErrors = (error: unknown) =>
  (error as any)?.response?.data?.errors ?? null;
