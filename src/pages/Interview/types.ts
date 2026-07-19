export type InterviewQuestion = {
  id: string;
  question: string;

  // TODO: score, answer, feedback
};

export type GenerateQuestionsInput = {
  cvFile: File;
  targetPosition: string;
  jobDescription: string;
};

export type InterviewSession = {
  id: string;
  post: string;
  jobDescription: string;
  cvId: string;
  questions: InterviewQuestion[];
};
