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
  cv: FileType;
  questions: InterviewQuestion[];
};

export type FileType = {
  id: string;
  name: string;
}