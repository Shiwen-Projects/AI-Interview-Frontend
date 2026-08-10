import type { LoaderFunctionArgs } from "react-router-dom";
import { getInterviewSession } from "../../api/interview/interview";
import type { InterviewSession } from "../../api/interview/types";

export async function interviewSessionLoader({
  params,
  request,
}: LoaderFunctionArgs): Promise<InterviewSession> {
  if (!params.sessionId) {
    throw new Response("Interview session ID is required", { status: 400 });
  }

  return getInterviewSession(params.sessionId, request.signal);
}
