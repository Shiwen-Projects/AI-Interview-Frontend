import { Alert } from "@mantine/core";
import {
  isRouteErrorResponse,
  useLoaderData,
  useRouteError,
} from "react-router-dom";
import { InterviewPreparation } from "./InterviewPreparation";
import { interviewSessionLoader } from "./interviewSessionLoader";

export function InterviewPreparationPage() {
  const session = useLoaderData<typeof interviewSessionLoader>();

  return (
    <InterviewPreparation
      key={session.id}
      initialSession={session}
    />
  );
}

export function InterviewSessionError() {
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
      <Alert color="red" title="Unable to load interview session" maw={520}>
        {message}
      </Alert>
    </div>
  );
}
