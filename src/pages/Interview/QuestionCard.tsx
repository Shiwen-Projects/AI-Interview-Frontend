import {
  ActionIcon,
  Button,
  Collapse,
  Divider,
  RingProgress,
  Text,
  Textarea,
  Tooltip,
  Loader,
} from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import { notifications } from "@mantine/notifications";
import { PenLine, Sparkles } from "lucide-react";
import { INTERVIEW_PREPARATION_TEXT } from "./lang";
import type {
  AnswerEvaluation,
  InterviewQuestion,
} from "../../api/interview/types";

import { isAbortError } from "../../utils";
import { evaluateQuestionAnswer, updateQuestionAnswer } from "../../api";
import { useRef, useState } from "react";
import { useGlobalUIContext } from "../../context";

interface QuestionCardProps {
  index: number;
  sessionId: string;
  interviewQuestion: InterviewQuestion;
}

export function QuestionCard(props: QuestionCardProps) {
  const { index, sessionId, interviewQuestion } = props;
  const { question, id, answer } = interviewQuestion;
  const {
    answer: initialAnswer = "",
    score = undefined,
    feedback = undefined,
  } = answer ?? {};

  const [expanded, { toggle }] = useDisclosure(false);
  const [isEvaluating, setIsEvaluating] = useState(false);
  const { setLoading } = useGlobalUIContext();

  // abort controller to cancel the request
  const abortControllerRef = useRef<AbortController | null>(null);

  const [answerText, setAnswerText] = useState(initialAnswer ?? "");
  const [evaluation, setEvaluation] = useState<AnswerEvaluation>({
    score,
    feedback,
  });
  const hasEvaluation =
    evaluation.feedback && evaluation.feedback.trim().length > 0;

  const handleUpdateAnswer = async () => {
    abortControllerRef.current?.abort();
    // create a new abort controller for the request
    const controller = new AbortController();
    // set the abort controller to the ref
    abortControllerRef.current = controller;

    try {
      setLoading(true);
      await updateQuestionAnswer(sessionId, id, answerText, controller.signal);
      notifications.show({
        color: "green",
        title: "Success",
        message: "Answer saved successfully. ",
      });
    } catch (error) {
      if (isAbortError(error)) {
        return;
      }
      notifications.show({
        color: "red",
        title: "Error",
        message:
          error instanceof Error ? error.message : "Failed to save answer.",
      });
    } finally {
      if (abortControllerRef.current === controller) {
        abortControllerRef.current = null;
      }
      setLoading(false);
    }
  };

  const handleEvaluateAnswer = async () => {
    abortControllerRef.current?.abort();
    const controller = new AbortController();
    abortControllerRef.current = controller;

    try {
      setIsEvaluating(true);
      const answerEvaluation = await evaluateQuestionAnswer(
        sessionId,
        id,
        answerText,
        controller.signal,
      );
      setEvaluation(answerEvaluation);
      notifications.show({
        color: "green",
        title: "Success",
        message: "Answer evaluated successfully. ",
      });
    } catch (error) {
      if (isAbortError(error)) {
        return;
      }
      notifications.show({
        color: "red",
        title: "Error",
        message:
          error instanceof Error ? error.message : "Failed to evaluate answer.",
      });
    } finally {
      if (abortControllerRef.current === controller) {
        abortControllerRef.current = null;
      }
      setIsEvaluating(false);
    }
  };

  const disableButtons = !answerText.trim() || isEvaluating;

  return (
    <div
      className="flex flex-col w-full gap-3 rounded-xl border px-4 py-3"
      style={{ background: "var(--bg)", borderColor: "var(--border)" }}
    >
      <div key={id} className="flex w-full items-center gap-3">
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
          label={INTERVIEW_PREPARATION_TEXT.ANSWER_QUESTION}
          fz={11}
          position="bottom"
        >
          <ActionIcon
            variant="subtle"
            color="gray"
            size="sm"
            aria-label={INTERVIEW_PREPARATION_TEXT.ANSWER_QUESTION}
            onClick={toggle}
          >
            <PenLine size={16} />
          </ActionIcon>
        </Tooltip>
      </div>

      <Collapse expanded={expanded}>
        <div className="flex flex-col w-full">
          <Divider my="xs" />
          <Text size="sm" c="dimmed" fw={600} mb={8}>
            {INTERVIEW_PREPARATION_TEXT.ANSWER_LABEL}
          </Text>
          <Textarea
            placeholder={INTERVIEW_PREPARATION_TEXT.ANSWER_PLACEHOLDER}
            minRows={4}
            autosize
            value={answerText}
            disabled={isEvaluating}
            onChange={(event) => setAnswerText(event.currentTarget.value)}
          />

          <div className="flex justify-end gap-2 mt-4">
            <Button
              disabled={disableButtons}
              size="xs"
              onClick={handleUpdateAnswer}
            >
              {INTERVIEW_PREPARATION_TEXT.SAVE}
            </Button>
            <Button
              disabled={disableButtons}
              size="xs"
              onClick={handleEvaluateAnswer}
            >
              {INTERVIEW_PREPARATION_TEXT.EVALUATE}
            </Button>
          </div>

          {isEvaluating ? (
            <div className="flex flex-row align-center gap-2 w-full justify-center my-6">
              <Loader color="blue" size="sm" />
              <Text size="sm" c="dimmed">
                {INTERVIEW_PREPARATION_TEXT.EVALUATING_ANSWER}
              </Text>
            </div>
          ) : (
            hasEvaluation && (
              <div
                className="flex flex-col gap-4 rounded-xl border p-4"
                style={{
                  background: "var(--bg-canvas)",
                  borderColor: "var(--border)",
                }}
              >
                <div className="flex items-center gap-2">
                  <Sparkles size={16} style={{ color: "var(--accent)" }} />
                  <Text size="sm" fw={600} c="var(--text-h)">
                    {INTERVIEW_PREPARATION_TEXT.EVALUATION_FEEDBACK}
                  </Text>
                </div>

                <div className="flex items-start gap-4">
                  <RingProgress
                    size={90}
                    thickness={10}
                    roundCaps
                    sections={[{ value: evaluation.score ?? 0, color: "blue" }]}
                    label={
                      <Text size="sm" fw={600} c="var(--text-h)">
                        {evaluation.score}/100
                      </Text>
                    }
                  />

                  <div className="min-w-0 flex-1">
                    <Text size="sm" c="var(--text)" style={{ lineHeight: 1.6 }}>
                      {evaluation.feedback}
                    </Text>
                  </div>
                </div>
              </div>
            )
          )}
        </div>
      </Collapse>
    </div>
  );
}
