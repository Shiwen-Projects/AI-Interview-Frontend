import { useRef, useState } from "react";
import {
  useLoaderData,
  useNavigate,
  type LoaderFunctionArgs,
} from "react-router-dom";
import { Button, Pagination, Text } from "@mantine/core";
import { Home, Inbox, Plus } from "lucide-react";
import { HOME_TEXT } from "./lang";
import { SessionCard } from "./SessionCard";
import type { PaginatedSessions } from "../../api/home/types";
import { getPaginatedSessions } from "../../api/home/home";
import { HOME_PAGE_DEFAULT_LIMIT, HOME_PAGE_DEFAULT_PAGE } from "./constants";

export async function homePageLoader({
  params,
  request,
}: LoaderFunctionArgs): Promise<PaginatedSessions> {
  const page = params.page ? parseInt(params.page, 10) : HOME_PAGE_DEFAULT_PAGE;
  const limit = params.limit
    ? parseInt(params.limit, 10)
    : HOME_PAGE_DEFAULT_LIMIT;
  return getPaginatedSessions({ page, limit }, request.signal);
}

export function HomePage() {
  const pageData = useLoaderData<typeof homePageLoader>();
  const { items, page: currentPage, total, totalPages } = pageData;

  const navigate = useNavigate();
  const [page, setPage] = useState(currentPage);
  const scrollRef = useRef<HTMLDivElement | null>(null);

  const handlePageChange = (nextPage: number) => {
    setPage(nextPage);
    scrollRef.current?.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <div
      className="flex min-h-0 flex-1 flex-col"
      style={{ background: "var(--bg-canvas)" }}
    >
      <header
        className="flex h-14 shrink-0 items-center justify-between border-b px-5"
        style={{ background: "var(--bg)", borderColor: "var(--border)" }}
      >
        <div className="flex items-center gap-3">
          <Text fw={600} size="sm" c="var(--text-h)">
            {HOME_TEXT.APP_TITLE}
          </Text>
          <span
            className="h-4 w-px"
            style={{ background: "var(--border-strong)" }}
          />
          <span
            className="flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-medium"
            style={{ background: "var(--accent-bg)", color: "var(--accent)" }}
          >
            <Home size={12} />
            {HOME_TEXT.LOCATION}
          </span>
        </div>
      </header>

      <div ref={scrollRef} className="min-h-0 flex-1 overflow-y-auto">
        <div className="mx-auto flex w-full max-w-4xl flex-col gap-5 px-6 py-6">
          <div>
            <Text fw={600} size="lg" c="var(--text-h)">
              {HOME_TEXT.PAGE_TITLE}
            </Text>
            <Text size="sm" c="dimmed" mt={2}>
              {HOME_TEXT.PAGE_SUBTITLE}
            </Text>
          </div>

          <div className="flex items-center gap-3">
            <Button
              leftSection={<Plus size={16} />}
              onClick={() => navigate("/session/")}
            >
              {HOME_TEXT.CREATE_SESSION}
            </Button>
            <Text size="sm" c="dimmed">
              {HOME_TEXT.SESSION_COUNT(total)}
            </Text>
          </div>

          {items.length > 0 ? (
            <div className="flex flex-col gap-3">
              {items.map((session, index) => (
                <SessionCard
                  key={`${page}-${session.id}`}
                  session={session}
                  index={index}
                />
              ))}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center gap-3 py-24 text-center">
              <div
                className="flex h-12 w-12 items-center justify-center rounded-full"
                style={{
                  background: "var(--accent-bg)",
                  color: "var(--accent)",
                }}
              >
                <Inbox size={22} />
              </div>
              <Text fw={500} size="sm" c="var(--text-h)">
                {HOME_TEXT.EMPTY_TITLE}
              </Text>
              <Text size="sm" c="dimmed" maw={340}>
                {HOME_TEXT.EMPTY_DESCRIPTION}
              </Text>
            </div>
          )}
        </div>
      </div>

      <footer
        className="shrink-0 border-t px-5 py-3"
        style={{ background: "var(--bg)", borderColor: "var(--border)" }}
      >
        <div className="flex justify-center">
          <Pagination
            total={totalPages}
            value={page}
            onChange={handlePageChange}
            size="sm"
            withEdges
          />
        </div>
      </footer>
    </div>
  );
}
