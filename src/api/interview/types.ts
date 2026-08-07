import type { FileType } from "../../pages/Interview/types";

export type QuestionStreamHandler = {
  onQuestion: (question: InterviewQuestion) => void;
  onDone: () => void;
  onError: (error: Error) => void;
};

export type Answer = {
  answer: string;
  score: number;
  feedback: string;
};

export type AnswerEvaluation = Omit<Answer, "answer">;

export type InterviewQuestion = {
  id: string;
  question: string;
  answer: Answer;
};

export type InterviewSession = {
  id: string;
  post: string;
  jobDescription: string;
  cv: FileType;
  questions: InterviewQuestion[];
};
