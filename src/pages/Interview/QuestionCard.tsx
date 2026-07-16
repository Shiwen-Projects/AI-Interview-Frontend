import { Text } from '@mantine/core'
import type { InterviewQuestion } from './types'
import { IconMessageQuestion } from '../../components/icons'

interface QuestionCardProps {
  interviewQuestion: InterviewQuestion
}

export function QuestionCard(props: QuestionCardProps) {
  const { interviewQuestion } = props;
  const { question, id } = interviewQuestion;

  return (
    <div
      key={id}
      className="flex w-full items-start gap-3 rounded-xl border p-4"
      style={{ background: 'var(--bg)', borderColor: 'var(--border)' }}
    >
      <div
        className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full"
        style={{ background: 'var(--accent-bg)', color: 'var(--accent)' }}
      >
        <IconMessageQuestion width={16} height={16} />
      </div>
      <Text size="sm" c="var(--text-h)" style={{ lineHeight: 1.5 }}>
        {question}
      </Text>
    </div>
  )
}
