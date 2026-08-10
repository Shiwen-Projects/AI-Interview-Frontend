import type { PaginationParams } from "./types";

const VITE_API_URL = import.meta.env.VITE_API_URL;

export const getPaginatedSessions = async (
  params: PaginationParams,
  signal?: AbortSignal,
) => {
  const fetchUrl = new URL(`${VITE_API_URL}/api/sessions`);
  if (params.page) {
    fetchUrl.searchParams.set("page", String(params.page));
  }
  if (params.limit) {
    fetchUrl.searchParams.set("limit", String(params.limit));
  }

  const response = await fetch(fetchUrl.toString(), {
    method: "GET",
    signal,
  });

  if (!response.ok) {
    throw new Error(`Failed to load sessions (${response.status})`);
  }

  const data = await response.json();

  return {
    items: data.items,
    page: data.page,
    limit: data.limit,
    total: data.total,
    totalPages: data.totalPages,
  };
};
