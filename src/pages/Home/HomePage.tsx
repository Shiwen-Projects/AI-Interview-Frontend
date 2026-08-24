import { useRef, useState } from "react";
import {
  useLoaderData,
  useNavigate,
  type LoaderFunctionArgs,
} from "react-router-dom";
import { Button, Pagination, Text } from "@mantine/core";
import { notifications } from "@mantine/notifications";
import { Check, Home, Inbox, Plus, Trash, FolderKanban } from "lucide-react";
import { HOME_TEXT } from "./lang";
import { SessionCard } from "./SessionCard";
import type { PaginatedSessions } from "../../api/home/types";
import { bacthDeleteSessions, getPaginatedSessions } from "../../api/home/home";
import {
  HOME_PAGE_DEFAULT_LIMIT,
  HOME_PAGE_DEFAULT_PAGE,
  SessionCardMode,
} from "./constants";
import { useGlobalUIContext } from "../../context";
import { PageHeader } from "../../components";

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
  const {
    items: initialItems,
    page: currentPage,
    total: initialTotal,
    totalPages: initialTotalPages,
  } = pageData;

  const [items, setItems] = useState(initialItems);
  const [page, setPage] = useState(currentPage);
  const [total, setTotal] = useState(initialTotal);
  const [totalPages, setTotalPages] = useState(initialTotalPages);
  const [isManagedMode, setIsManagedMode] = useState(false);
  const [selectedSessionIds, setSelectedSessionIds] = useState<string[]>([]);
  const { setLoading } = useGlobalUIContext();

  const navigate = useNavigate();

  const scrollRef = useRef<HTMLDivElement | null>(null);

  const fetchPage = async (
    targetPage: number,
    signal?: AbortSignal,
  ): Promise<PaginatedSessions> => {
    const data = await getPaginatedSessions(
      { page: targetPage, limit: HOME_PAGE_DEFAULT_LIMIT },
      signal,
    );
    setItems(data.items);
    setPage(data.page);
    setTotal(data.total);
    setTotalPages(data.totalPages);
    return data;
  };

  const handlePageChange = async (nextPage: number): Promise<void> => {
    setLoading(true);
    const controller = new AbortController();
    const signal = controller.signal;
    try {
      await fetchPage(nextPage, signal);
      scrollRef.current?.scrollTo({ top: 0, behavior: "smooth" });
    } catch (error) {
      notifications.show({
        color: "red",
        title: "Error",
        message: (error as Error).message,
      });
    } finally {
      setLoading(false);
    }
  };

  const handleToggleSession = (sessionId: string): void => {
    setSelectedSessionIds((prev) => {
      if (prev.includes(sessionId)) {
        return prev.filter((id) => id !== sessionId);
      }
      return [...prev, sessionId];
    });
  };

  const handleDeleteSessions = async () => {
    if (selectedSessionIds.length === 0) {
      notifications.show({
        color: "yellow",
        title: "Warning",
        message: "No sessions selected",
      });
      return;
    }
    setLoading(true);
    try {
      await bacthDeleteSessions(selectedSessionIds);
      const data = await fetchPage(page);
      if (data.items.length === 0 && page > 1) {
        // Current page no longer exists; fall back to the latest last page (page 1 if none left)
        await fetchPage(Math.max(1, Math.min(page, data.totalPages)));
      }
      notifications.show({
        color: "green",
        title: "Success",
        message: "Sessions deleted successfully",
      });
      setSelectedSessionIds([]);
      setIsManagedMode(false);
    } catch (error) {
      notifications.show({
        color: "red",
        title: "Error",
        message: (error as Error).message,
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className="flex min-h-0 flex-1 flex-col"
      style={{ background: "var(--bg-canvas)" }}
    >
      <PageHeader
        title={HOME_TEXT.APP_TITLE}
        badge={{ icon: <Home size={12} />, label: HOME_TEXT.LOCATION }}
      />

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
            <Button
              leftSection={
                isManagedMode ? <Check size={16} /> : <FolderKanban size={16} />
              }
              onClick={() => {
                setIsManagedMode(!isManagedMode);
              }}
            >
              {isManagedMode ? HOME_TEXT.DONE : HOME_TEXT.MANAGE}
            </Button>
            {isManagedMode && (
              <Button
                leftSection={<Trash size={16} />}
                onClick={handleDeleteSessions}
                color="red"
              >
                {HOME_TEXT.DELETE}
              </Button>
            )}
          </div>
          <div>
            <Text size="sm" c="dimmed">
              {HOME_TEXT.SESSION_COUNT(total)}
            </Text>
          </div>

          {items.length > 0 ? (
            <div className="flex flex-col gap-3">
              {items.map((session, index) =>
                isManagedMode ? (
                  <SessionCard
                    key={`${page}-${session.id}`}
                    mode={SessionCardMode.MANAGE}
                    session={session}
                    index={index}
                    isSelected={selectedSessionIds.includes(session.id)}
                    onToggleSelected={handleToggleSession}
                  />
                ) : (
                  <SessionCard
                    key={`${page}-${session.id}`}
                    mode={SessionCardMode.NORMAL}
                    session={session}
                    index={index}
                  />
                ),
              )}
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
