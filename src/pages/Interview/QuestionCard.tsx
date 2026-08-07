import { ActionIcon, Text, Tooltip } from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import { PenLine } from "lucide-react";
import { AnswerEvaluationModal } from "./AnswerEvaluationModal";
import { INTERVIEW_PREPARATION } from "./lang";
import type { InterviewQuestion } from "../../api/interview/types";

interface QuestionCardProps {
  index: number;
  sessionId: string;
  interviewQuestion: InterviewQuestion;
}

export function QuestionCard(props: QuestionCardProps) {
  const { index, sessionId, interviewQuestion } = props;
  const { question, id } = interviewQuestion;
  const [opened, { open, close }] = useDisclosure(false);

  return (
    <>
      <div
        key={id}
        className="flex w-full items-center gap-3 rounded-xl border px-4 py-3"
        style={{ background: "var(--bg)", borderColor: "var(--border)" }}
      >
        <div
          className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full text-xs"
          style={{ background: "var(--accent-bg)", color: "var(--accent)" }}
        >
          {index + 1}
        </div>
        <Text
          size="sm"
          c="var(--text-h)"
          className="min-w-0 flex-1"
          style={{ lineHeight: 1.5 }}
        >
          {question}
        </Text>
        <Tooltip
          label={INTERVIEW_PREPARATION.ANSWER_QUESTION}
          fz={11}
          position="bottom"
        >
          <ActionIcon
            variant="subtle"
            color="gray"
            size="sm"
            aria-label={INTERVIEW_PREPARATION.ANSWER_QUESTION}
            onClick={open}
          >
            <PenLine size={16} />
          </ActionIcon>
        </Tooltip>
      </div>

      <AnswerEvaluationModal
        opened={opened}
        sessionId={sessionId}
        interviewQuestion={interviewQuestion}
        onClose={close}
      />
    </>
  );
}
