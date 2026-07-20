import { useRef, useState } from "react";
import { useForm } from "@mantine/form";
import {
  ActionIcon,
  Button,
  FileInput,
  Splitter,
  Text,
  Textarea,
  Tooltip,
} from "@mantine/core";
import type { UseSplitterReturnValue } from "@mantine/hooks";
import { INTERVIEW_PREPARATION } from "./lang";
import { QuestionCard } from "./QuestionCard";
import {
  IconMessageQuestion,
  IconSidebar,
  IconSparkles,
  IconUpload,
} from "../../components/icons";
import type { InterviewQuestion, InterviewSession } from "./types";
import { createInterviewSession, getStreamingQuestions } from "../../api";
import type { QuestionStreamHandler } from "../../api/interview/types";

type InterviewPreparationProps = {
  initialSession?: InterviewSession;
};

export function InterviewPreparation(props: InterviewPreparationProps) {
  const { initialSession } = props;
  const {
    questions: initialQuestions = [],
    // cvId = "", // TODO: think of using id or just file object
    post = "",
    jobDescription = "",
  } = initialSession ?? {};
  const [isGenerating, setIsGenerating] = useState(false);
  const [errorText, setErrorText] = useState<string | null>(null);
  const [questions, setQuestions] = useState<InterviewQuestion[]>(initialQuestions);
  const splitterRef = useRef<UseSplitterReturnValue | null>(null);
  const [isLeftCollapsed, setIsLeftCollapsed] = useState(false);

  const form = useForm({
    initialValues: {
      cv: null, // TODO: think of using id or just file object
      position: post,
      jobDescription: jobDescription,
    },
    validate: {
      cv: (value) => (value ? null : INTERVIEW_PREPARATION.CV_VALIDATION),
      position: (value) =>
        value ? null : INTERVIEW_PREPARATION.POSITION_VALIDATION,
      jobDescription: (value) =>
        value ? null : INTERVIEW_PREPARATION.JOB_DESCRIPTION_VALIDATION,
    },
  });

  const createSessionAndGenerateQuestions = async (
    cv: File,
    post: string,
    jobDescription: string,
  ) => {
    try {
      setIsGenerating(true);
      const sessionId = await createInterviewSession(cv, post, jobDescription);

      if(sessionId) {
        // set the url with sessionId to the browser history but not reload the page
        window.history.pushState({}, "", `/${sessionId}`);

        const handler: QuestionStreamHandler = {
          onQuestion: (question) => {
            setQuestions((prev) => [...prev, question]);
          },
          onDone: () => {
            setIsGenerating(false);
          },
          onError: (error) => {
            setIsGenerating(false);
            setErrorText(error instanceof Error ? error.message : "Unknown error");
          },
        }
        await getStreamingQuestions(sessionId, handler);
      }
    } catch (error) {
      setIsGenerating(false);
      setErrorText(error instanceof Error ? error.message : "Unknown error");
    }
  };

  return (
    <div
      className="flex min-h-0 flex-1 flex-col"
      style={{ background: "var(--bg-canvas)" }}
    >
      <header
        className="flex h-14 shrink-0 items-center justify-between border-b px-5"
        style={{ background: "var(--bg)", borderColor: "var(--border)" }}
      >
        <Text fw={600} size="sm" c="var(--text-h)">
          {INTERVIEW_PREPARATION.AI_INTERVIEW_PREPARATION}
        </Text>
        <Tooltip
          label={
            isLeftCollapsed
              ? INTERVIEW_PREPARATION.SHOW_PANEL
              : INTERVIEW_PREPARATION.HIDE_PANEL
          }
        >
          <ActionIcon
            variant="default"
            size="lg"
            aria-label="Toggle input panel"
            onClick={() => splitterRef.current?.toggleCollapse(0)}
          >
            <IconSidebar width={18} height={18} />
          </ActionIcon>
        </Tooltip>
      </header>

      <Splitter
        className="min-h-0 flex-1"
        splitterRef={splitterRef}
        handleColor="gray.4"
        onCollapseChange={(index, collapsed) => {
          if (index === 0) setIsLeftCollapsed(collapsed);
        }}
      >
        <Splitter.Pane
          defaultSize={36}
          min={25}
          max={40}
          collapsible
          collapseThreshold={0}
        >
          <form
            onSubmit={form.onSubmit(async (values) => {
              await createSessionAndGenerateQuestions(
                values.cv as unknown as File,
                values.position,
                values.jobDescription,
              );
            })}
            className="flex h-full flex-col gap-4 p-6"
            style={{ background: "var(--bg)" }}
          >
            <div>
              <Text fw={600} size="sm" c="var(--text-h)">
                {INTERVIEW_PREPARATION.PANEL_TITLE}
              </Text>
              <Text size="xs" c="dimmed" mt={4}>
                {INTERVIEW_PREPARATION.PANEL_SUBTITLE}
              </Text>
            </div>

            <FileInput
              label={INTERVIEW_PREPARATION.CV}
              placeholder={INTERVIEW_PREPARATION.CV_PLACEHOLDER}
              accept=".pdf"
              key={form.key("cv")}
              rightSection={
                <IconUpload width={16} height={16} color="var(--text)" />
              }
              {...form.getInputProps("cv")}
            />
            <Textarea
              label={INTERVIEW_PREPARATION.POSITION}
              placeholder={INTERVIEW_PREPARATION.POSITION_PLACEHOLDER}
              minRows={3}
              autosize
              key={form.key("position")}
              {...form.getInputProps("position")}
            />
            <Textarea
              label={INTERVIEW_PREPARATION.JOB_DESCRIPTION}
              placeholder={INTERVIEW_PREPARATION.JOB_DESCRIPTION_PLACEHOLDER}
              minRows={6}
              autosize
              className="flex-1"
              key={form.key("jobDescription")}
              {...form.getInputProps("jobDescription")}
            />

            <div className="mt-auto flex justify-end">
              <Button
                type="submit"
                loading={isGenerating}
                leftSection={<IconSparkles width={16} height={16} />}
              >
                {INTERVIEW_PREPARATION.GENERATE}
              </Button>
            </div>
          </form>
        </Splitter.Pane>

        <Splitter.Pane defaultSize={64} min={60}>
          <div className="flex h-full flex-col gap-4 p-6">
            <div>
              <Text fw={600} size="sm" c="var(--text-h)">
                {INTERVIEW_PREPARATION.RESULT_TITLE}
              </Text>
            </div>

            {questions.length === 0 ? (
              <div className="flex flex-1 flex-col items-center justify-center gap-3 text-center">
                <div
                  className="flex h-12 w-12 items-center justify-center rounded-full"
                  style={{
                    background: "var(--accent-bg)",
                    color: "var(--accent)",
                  }}
                >
                  <IconMessageQuestion width={22} height={22} />
                </div>
                <Text fw={500} size="sm" c="var(--text-h)">
                  {INTERVIEW_PREPARATION.EMPTY_TITLE}
                </Text>
                <Text size="sm" c="dimmed" maw={340}>
                  {INTERVIEW_PREPARATION.EMPTY_DESCRIPTION}
                </Text>
              </div>
            ) : (
              <div className="flex flex-col gap-4">
                {questions.map((question) => (
                  <QuestionCard
                    key={question.id}
                    interviewQuestion={question}
                  />
                ))}
                {errorText && (
                  <div className="flex flex-col gap-2">
                    <Text size="sm" c="red">{errorText}</Text>
                  </div>
                )}
              </div>
            )}
          </div>
        </Splitter.Pane>
      </Splitter>
    </div>
  );
}
