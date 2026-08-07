import {
  Button,
  Modal,
  RingProgress,
  Text,
  Textarea,
  Loader,
} from "@mantine/core";
import { notifications } from "@mantine/notifications";
import { useRef, useState } from "react";
import { Sparkles } from "lucide-react";
import { INTERVIEW_PREPARATION } from "./lang";
import type { InterviewQuestion } from "../../api/interview/types";
import { evaluateQuestionAnswer, updateQuestionAnswer } from "../../api";
import { isAbortError } from "../../utils";

type AnswerEvaluationModalProps = {
  opened: boolean;
  sessionId: string;
  interviewQuestion: InterviewQuestion;
  onClose: () => void;
};

export function AnswerEvaluationModal(props: AnswerEvaluationModalProps) {
  const { opened, sessionId, interviewQuestion, onClose } = props;

  const { id, question, answer } = interviewQuestion;
  const { answer: initialAnswer, score, feedback } = answer;

  const [isUpdatingAnswer, setIsUpdatingAnswer] = useState(false);
  const [isEvaluating, setIsEvaluating] = useState(false);

  // abort controller to cancel the request
  const abortControllerRef = useRef<AbortController | null>(null);

  const [answerText, setAnswerText] = useState(initialAnswer ?? "");
  const [evaluation, setEvaluation] = useState({ score, feedback });
  const hasEvaluation = evaluation.feedback.trim().length > 0;

  const handleUpdateAnswer = async () => {
    abortControllerRef.current?.abort();
    // create a new abort controller for the request
    const controller = new AbortController();
    // set the abort controller to the ref
    abortControllerRef.current = controller;

    try {
      setIsUpdatingAnswer(true);
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
      setIsUpdatingAnswer(false);
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

  const handleClose = () => {
    // abort the request if it is still in progress
    abortControllerRef.current?.abort();
    abortControllerRef.current = null;
    onClose();
  };

  const disableButtons = !answerText.trim() || isUpdatingAnswer || isEvaluating;

  return (
    <Modal
      opened={opened}
      onClose={handleClose}
      title={INTERVIEW_PREPARATION.ANSWER_MODAL_TITLE}
      size="lg"
      centered
    >
      <div className="flex flex-col gap-4">
        <Text size="sm" c="var(--text-h)" style={{ lineHeight: 1.5 }}>
          {question}
        </Text>

        <Textarea
          label={INTERVIEW_PREPARATION.ANSWER_LABEL}
          placeholder={INTERVIEW_PREPARATION.ANSWER_PLACEHOLDER}
          minRows={6}
          autosize
          value={answerText}
          disabled={isEvaluating}
          onChange={(event) => setAnswerText(event.currentTarget.value)}
        />

        <div className="flex justify-end gap-2">
          <Button
            disabled={disableButtons}
            size="sm"
            onClick={handleUpdateAnswer}
          >
            {INTERVIEW_PREPARATION.SAVE}
          </Button>
          <Button
            disabled={disableButtons}
            size="sm"
            onClick={handleEvaluateAnswer}
          >
            {INTERVIEW_PREPARATION.EVALUATE}
          </Button>
        </div>

        {isEvaluating ? (
          <div className="flex flex-row align-center gap-2 w-full justify-center my-6">
            <Loader color="blue" size="sm" />
            <Text size="sm" c="dimmed">
              {INTERVIEW_PREPARATION.EVALUATING_ANSWER}
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
                  {INTERVIEW_PREPARATION.EVALUATION_FEEDBACK}
                </Text>
              </div>

              <div className="flex items-start gap-4">
                <RingProgress
                  size={90}
                  thickness={10}
                  roundCaps
                  sections={[{ value: evaluation.score, color: "blue" }]}
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
    </Modal>
  );
}
