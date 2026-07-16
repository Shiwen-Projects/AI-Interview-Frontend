export interface InterviewQuestion {
  id: string
  question: string; 

  // TODO: score, answer, feedback
}

export interface GenerateQuestionsInput {
  cvFile: File
  targetPosition: string
  jobDescription: string
}
