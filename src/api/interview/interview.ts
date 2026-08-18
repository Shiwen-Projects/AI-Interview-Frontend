
import { InterviewQuestionStreamEvent } from "../../pages/Interview/constants";
import { getResponseErrorMessage } from "../../utils/errors";
import type { AnswerEvaluation, InterviewSession, QuestionStreamHandler } from "./types";

const VITE_API_URL = import.meta.env.VITE_API_URL;

export const getCvFileUrl = (cvId: string): string =>
  `${VITE_API_URL}/api/storage/files/${encodeURIComponent(cvId)}`;

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
    cv: {
      id: data.cv?.id ?? "",
      name: data.cv?.name ?? "",
    },
    questions: data.questions.map((question: any) => ({
      id: question.id,
      question: question?.question,
      answer: {
        answer: question?.answer?.answer ?? '',
        score: question?.answer?.score ?? null,
        feedback: question?.answer?.feedback ?? '',
      },
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
    // Close explicitly, otherwise EventSource treats the server-closed
    // connection as a drop and auto-reconnects, starting a new stream.
    eventSource.close();
    handler.onDone();
  });

  eventSource.addEventListener(InterviewQuestionStreamEvent.Error, (event) => {
    eventSource.close();
    handler.onError(new Error(JSON.parse(event.data).message));
  });
};

export const updateQuestionAnswer = async (
  sessionId: string,
  questionId: string,
  answer: string,
  signal?: AbortSignal,
): Promise<void> => {
  const response = await fetch(
    `${VITE_API_URL}/api/sessions/${sessionId}/questions/${questionId}/answer`,
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ answer }),
      signal,
    },
  );

  if (!response.ok) {
    throw new Error(
      await getResponseErrorMessage(
        response,
        `Failed to update question answer (${response.status})`,
      ),
    );
  }
};

export const evaluateQuestionAnswer = async (
  sessionId: string,
  questionId: string,
  answer: string,
  signal?: AbortSignal,
): Promise<AnswerEvaluation> => {
  const response = await fetch(
    `${VITE_API_URL}/api/sessions/${sessionId}/questions/${questionId}/evaluate`,
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ answer }),
      signal,
    },
  );

  if (!response.ok) {
    throw new Error(
      await getResponseErrorMessage(
        response,
        `Failed to evaluate answer (${response.status})`,
      ),
    );
  }

  const data = await response.json();
  return {
    score: data.score ?? 0,
    feedback: data.feedback ?? "",
  };
};