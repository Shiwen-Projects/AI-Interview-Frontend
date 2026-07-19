import type { InterviewSession } from "../pages/Interview/types";

export const getInterviewSession = async (
  sessionId: string,
  signal?: AbortSignal, // for cancelling the request
): Promise<InterviewSession> => {
  const response = await fetch(
    `${import.meta.env.VITE_API_URL}/api/sessions/${sessionId}`,
    { signal },
  );

  if (!response.ok) {
    throw new Error(
      `Failed to load interview session (${response.status})`,
    );
  }

  const data = await response.json();
  return {
    id: data.id,
    post: data.post,
    jobDescription: data.jobDescription,
    cvId: data.cvId,
    questions: data.questions.map((question: any) => ({
      id: question.id,
      question: question.question,
    })),
  };
};
