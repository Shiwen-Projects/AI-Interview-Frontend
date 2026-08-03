import { useRef, useState } from "react";
import { useForm } from "@mantine/form";
import { notifications } from "@mantine/notifications";
import {
  ActionIcon,
  Anchor,
  Button,
  FileInput,
  Splitter,
  Text,
  Textarea,
  Tooltip,
  Loader,
} from "@mantine/core";
import type { UseSplitterReturnValue } from "@mantine/hooks";
import {
  ExternalLink,
  MessageCircleQuestion,
  PanelLeft,
  Sparkles,
  Upload,
} from "lucide-react";
import { INTERVIEW_PREPARATION } from "./lang";
import { QuestionCard } from "./QuestionCard";
import type { InterviewQuestion, InterviewSession } from "./types";
import {
  createInterviewSession,
  getCvFileUrl,
  getStreamingQuestions,
  type QuestionStreamHandler,
} from "../../api/interview";

type InterviewPreparationProps = {
  initialSession?: InterviewSession;
};

export function InterviewPreparation(props: InterviewPreparationProps) {
  const { initialSession } = props;
  const {
    id: sessionId,
    questions: initialQuestions = [],
    cv: initialCv,
    post = "",
    jobDescription = "",
  } = initialSession ?? {};
  const [isGenerating, setIsGenerating] = useState(false);
  const [questions, setQuestions] =
    useState<InterviewQuestion[]>(initialQuestions);
  const splitterRef = useRef<UseSplitterReturnValue | null>(null);
  const [isLeftCollapsed, setIsLeftCollapsed] = useState(false);

  const form = useForm({
    initialValues: {
      cv: null, // In create mode, defult empty file
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

      if (sessionId) {
        // set the url with sessionId to the browser history but not reload the page
        window.history.pushState({}, "", `/${sessionId}`);

        const handler: QuestionStreamHandler = {
          onQuestion: (question) => {
            setQuestions((prev) => [...prev, question]);
          },
          onDone: () => {
            setIsGenerating(false);
            notifications.show({
              color: "green",
              title: "Success",
              message: "All questions generated successfully. ",
            });
          },
          onError: (error) => {
            setIsGenerating(false);
            console.error(error);
            notifications.show({
              color: "red",
              title: "Error",
              message: error.message,
            });
          },
        };
        await getStreamingQuestions(sessionId, handler);
      }
    } catch (error) {
      setIsGenerating(false);
      console.error(error);
      notifications.show({
        color: "red",
        title: "Error",
        message:
          error instanceof Error
            ? error.message
            : "Unable to generate interview questions.",
      });
    }
  };

  // used to: disable the generate button, input fields and show the loading spinner and the questions
  const hasQuestionGenerationStarted = isGenerating || questions.length > 0;
  
  const showGenerateButton = questions.length === 0;
  const isCreateMode = !sessionId;

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
            <PanelLeft size={18} />
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
            className="flex h-full min-h-0 flex-col gap-4 overflow-y-auto p-6"
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

            {isCreateMode ? (
              <FileInput
                label={INTERVIEW_PREPARATION.CV}
                placeholder={INTERVIEW_PREPARATION.CV_PLACEHOLDER}
                accept=".pdf"
                key={form.key("cv")}
                rightSection={<Upload size={16} color="var(--text)" />}
                disabled={hasQuestionGenerationStarted}
                clearable={!hasQuestionGenerationStarted}
                withAsterisk
                {...form.getInputProps("cv")}
              />
            ) : initialCv ? (
              <div>
                <Text component="label" size="sm" fw={600} c="var(--text-h)">
                  {INTERVIEW_PREPARATION.CV}
                </Text>
                <Anchor
                  href={getCvFileUrl(initialCv.id)}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={`Open ${initialCv.name} in a new tab`}
                  title={initialCv.name}
                  underline="always"
                  style = {{
                    display: "flex",
                    flexDirection: "row",
                    alignItems: "center",
                    gap: "0.5rem",
                  }}
                >
                  <Text size="sm" truncate>
                    {initialCv.name}
                  </Text>
                  <ExternalLink
                    size={16}
                    className="shrink-0"
                    color="var(--text)"
                  />
                </Anchor>
              </div>
            ) : null}

            <Textarea
              label={INTERVIEW_PREPARATION.POSITION}
              placeholder={INTERVIEW_PREPARATION.POSITION_PLACEHOLDER}
              minRows={3}
              autosize
              key={form.key("position")}
              disabled={hasQuestionGenerationStarted}
              withAsterisk
              {...form.getInputProps("position")}
            />
            <Textarea
              label={INTERVIEW_PREPARATION.JOB_DESCRIPTION}
              placeholder={INTERVIEW_PREPARATION.JOB_DESCRIPTION_PLACEHOLDER}
              minRows={6}
              autosize
              className="flex-1"
              key={form.key("jobDescription")}
              withAsterisk
              disabled={hasQuestionGenerationStarted}
              {...form.getInputProps("jobDescription")}
            />

            {showGenerateButton && (
              <div className="mt-auto flex justify-end">
                <Button
                  type="submit"
                  loading={hasQuestionGenerationStarted}
                  leftSection={<Sparkles size={16} />}
                >
                  {INTERVIEW_PREPARATION.GENERATE}
                </Button>
              </div>
            )}
          </form>
        </Splitter.Pane>

        <Splitter.Pane defaultSize={64} min={60}>
          <div className="flex h-full flex-1 flex-col gap-4 overflow-y-auto p-6">
            <div>
              <Text fw={600} size="sm" c="var(--text-h)">
                {INTERVIEW_PREPARATION.RESULT_TITLE}
              </Text>
            </div>

            {hasQuestionGenerationStarted ? (
              <>
                {isGenerating && (
                  <div className="flex flex-row align-center gap-2 w-full justify-center">
                    <Loader color="blue" size="sm" />
                    <Text size="sm" c="dimmed">
                      {INTERVIEW_PREPARATION.GENERATING_QUESTIONS}
                    </Text>
                  </div>
                )}

                <div className="flex flex-col gap-4">
                  {questions.map((question) => (
                    <QuestionCard
                      key={question.id}
                      interviewQuestion={question}
                    />
                  ))}
                </div>
              </>
            ) : (
              <div className="flex flex-1 flex-col items-center justify-center gap-3 text-center">
                <div
                  className="flex h-12 w-12 items-center justify-center rounded-full"
                  style={{
                    background: "var(--accent-bg)",
                    color: "var(--accent)",
                  }}
                >
                  <MessageCircleQuestion size={22} />
                </div>
                <Text fw={500} size="sm" c="var(--text-h)">
                  {INTERVIEW_PREPARATION.EMPTY_TITLE}
                </Text>
                <Text size="sm" c="dimmed" maw={340}>
                  {INTERVIEW_PREPARATION.EMPTY_DESCRIPTION}
                </Text>
              </div>
            )}
          </div>
        </Splitter.Pane>
      </Splitter>
    </div>
  );
}
