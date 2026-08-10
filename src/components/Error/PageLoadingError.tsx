import { Alert } from "@mantine/core";
import { isRouteErrorResponse, useRouteError } from "react-router-dom";

type PageLoadingErrorProps = {
  title: string;
};

export function PageLoadingError(props: PageLoadingErrorProps) {
  const { title } = props;
  const error = useRouteError();
  const message = isRouteErrorResponse(error)
    ? error.data || error.statusText
    : error instanceof Error
      ? error.message
      : "An unexpected error occurred.";

  return (
    <div
      className="flex min-h-0 flex-1 items-center justify-center p-6"
      style={{ background: "var(--bg-canvas)" }}
    >
      <Alert color="red" title={title} maw={520}>
        {message}
      </Alert>
    </div>
  );
}
