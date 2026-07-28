import type { InterviewQuestion } from "../../pages/Interview/types";

export type QuestionStreamHandler = {
    onQuestion: (question: InterviewQuestion) => void;
    onDone: () => void;
    onError: (error: Error) => void;
};