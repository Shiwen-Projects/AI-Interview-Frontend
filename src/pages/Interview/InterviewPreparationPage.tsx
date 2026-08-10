import { useLoaderData } from "react-router-dom";
import { InterviewPreparation } from "./InterviewPreparation";
import { interviewSessionLoader } from "./interviewSessionLoader";

export function InterviewPreparationPage() {
  const session = useLoaderData<typeof interviewSessionLoader>();

  return (
    <InterviewPreparation
      key={session.id}
      initialSession={session}
    />
  );
}