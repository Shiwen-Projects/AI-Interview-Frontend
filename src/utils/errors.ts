export const getResponseErrorMessage = async (
  response: Response,
  fallback: string,
): Promise<string> => {
  try {
    const data = await response.json();
    if (Array.isArray(data?.message)) {
      return data.message.join(", ");
    }
    if (typeof data?.message === "string" && data.message.trim()) {
      return data.message;
    }
  } catch (error) {
    console.error("Failed to get response error message:", error);
  }
  return fallback;
};

export const isAbortError = (error: unknown): boolean =>
  error instanceof DOMException
    ? error.name === "AbortError"
    : error instanceof Error && error.name === "AbortError";
