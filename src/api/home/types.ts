export type SessionCardData = {
  id: string;
  post: string;
  jobDescription: string;
};

export type PaginatedSessions = {
  items: SessionCardData[];
  page: number;
  limit: number;
  total: number;
  totalPages: number;
};

export type PaginationParams = {
  page?: number;
  limit?: number;
};
