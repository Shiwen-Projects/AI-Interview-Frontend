import type { LoaderFunctionArgs } from "react-router-dom";
import { getInterviewSession } from "../../api/interview";

export async function interviewSessionLoader({
  params,
  request,
}: LoaderFunctionArgs) {
  if (!params.sessionId) {
    throw new Response("Interview session ID is required", { status: 400 });
  }

  return getInterviewSession(params.sessionId, request.signal);
}
