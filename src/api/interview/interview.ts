
import { InterviewQuestionStreamEvent } from "../../pages/Interview/constants";
import type {
  InterviewSession,
} from "../../pages/Interview/types";
import type { QuestionStreamHandler } from "./types";

const VITE_API_URL = import.meta.env.VITE_API_URL;

export const getInterviewSession = async (
  sessionId: string,
  signal?: AbortSignal, // for cancelling the request
): Promise<InterviewSession> => {
  const response = await fetch(`${VITE_API_URL}/api/sessions/${sessionId}`, {
    signal,
  });

  if (!response.ok) {
    throw new Error(`Failed to load interview session (${response.status})`);
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

export const createInterviewSession = async (
  cv: File,
  post: string,
  jobDescription: string,
): Promise<string> => {
  const formData = new FormData();
  formData.append("cv", cv);
  formData.append("post", post);
  formData.append("jobDescription", jobDescription);

  const response = await fetch(`${import.meta.env.VITE_API_URL}/api/sessions`, {
    method: "POST",
    body: formData,
  });

  if (!response.ok) {
    throw new Error(`Failed to create interview session (${response.status})`);
  }

  const data = await response.json();
  console.log(data);
  return data.sessionId;
};

export const getStreamingQuestions = async (
  sessionId: string,
  handler: QuestionStreamHandler,
): Promise<void> => {
  const eventSource = new EventSource(
    `${VITE_API_URL}/api/sessions/${sessionId}/questions/stream`,
  );

  eventSource.addEventListener(
    InterviewQuestionStreamEvent.Question,
    (event) => {
      handler.onQuestion(JSON.parse(event.data));
    },
  );

  eventSource.addEventListener(InterviewQuestionStreamEvent.Done, () => {
    handler.onDone();
  });

  eventSource.addEventListener(InterviewQuestionStreamEvent.Error, (event) => {
    handler.onError(new Error(JSON.parse(event.data).message));
  });
};
