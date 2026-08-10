export type PaginatedSessions = {
  items: {
    id: string;
    post: string;
    jobDescription: string;
  }[];
  page: number;
  limit: number;
  total: number;
  totalPages: number;
};

export type PaginationParams = {
  page?: number;
  limit?: number;
};
