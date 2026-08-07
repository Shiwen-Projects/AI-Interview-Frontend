export type GenerateQuestionsInput = {
  cvFile: File;
  targetPosition: string;
  jobDescription: string;
};

export type FileType = {
  id: string;
  name: string;
}