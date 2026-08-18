import { Checkbox, Text } from "@mantine/core";
import { Briefcase, ChevronRight } from "lucide-react";
import { useNavigate } from "react-router-dom";
import type { SessionCardData } from "../../api/home/types";
import { SessionCardMode } from "./constants";

type SessionCardBase = {
  session: SessionCardData;
  index: number;
};

type NormalSessionCardProps = SessionCardBase & {
  mode: typeof SessionCardMode.NORMAL;
};

type ManagedSessionCardProps = SessionCardBase & {
  mode: typeof SessionCardMode.MANAGE;
  isSelected: boolean;
  onToggleSelected: (sessionId: string) => void;
};

type SessionCardProps = NormalSessionCardProps | ManagedSessionCardProps;

export function SessionCard(props: SessionCardProps) {
  const { session, index, mode } = props;
  const navigate = useNavigate();

  const isManageMode = mode === SessionCardMode.MANAGE;

  const handleToggleCardSelected = (): void => {
    if (isManageMode) {
      const { onToggleSelected } = props as ManagedSessionCardProps;
      onToggleSelected(session.id);
    } else {
      navigate(`/session/${session.id}`);
    }
  };

  return (
    <button
      type="button"
      onClick={handleToggleCardSelected}
      className="group block w-full cursor-pointer rounded-xl border border-(--border) bg-(--bg) text-left transition-[transform,box-shadow,border-color] duration-[180ms] hover:-translate-y-0.5 hover:border-(--accent-border) hover:shadow-(--shadow) focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-(--accent) motion-reduce:transition-none motion-reduce:hover:translate-y-0"
    >
      <div
        className={`flex items-center gap-4 px-5 py-4 transition-[opacity,transform] duration-[320ms] ease-out motion-reduce:transition-none`}
        style={{ transitionDelay: `${index * 45}ms` }}
      >
        {isManageMode ? (
          <div className="flex shrink-0 items-center justify-center rounded-full"
          onClick={(e) => e.stopPropagation()}
          >
            <Checkbox
              checked={(props as ManagedSessionCardProps).isSelected}
              size="xs"
              onChange={handleToggleCardSelected}
              classNames={{ input: "cursor-pointer" }}
            />
          </div>
        ) : (
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-(--accent-bg) text-(--accent)">
            <Briefcase size={18} />
          </div>
        )}

        <div className="flex min-w-0 flex-1 flex-col gap-1">
          <Text fw={600} size="sm" c="var(--text-h)" truncate>
            {session.post}
          </Text>
          <Text
            size="xs"
            c="dimmed"
            className="line-clamp-2"
            style={{ lineHeight: 1.5 }}
          >
            {session.jobDescription}
          </Text>
        </div>

        {!isManageMode && (
          <ChevronRight
            size={18}
            className="shrink-0 text-(--border-strong) transition-[transform,color] duration-[180ms] group-hover:translate-x-0.5 group-hover:text-(--accent) motion-reduce:transition-none"
          />
        )}
      </div>
    </button>
  );
}
