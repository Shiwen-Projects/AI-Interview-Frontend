import type { ReactNode } from "react";
import { Text } from "@mantine/core";

type PageHeaderProps = {
  title: string;
  badge?: { icon: ReactNode; label: string };
  actions?: ReactNode;
};

export function PageHeader(props: PageHeaderProps) {
  const { title, badge, actions } = props;

  return (
    <header
      className="flex h-14 shrink-0 items-center justify-between border-b px-5"
      style={{ background: "var(--bg)", borderColor: "var(--border)" }}
    >
      <div className="flex items-center gap-3">
        <Text fw={600} size="sm" c="var(--text-h)">
          {title}
        </Text>
        {badge && (
          <>
            <span
              className="h-4 w-px"
              style={{ background: "var(--border-strong)" }}
            />
            <span
              className="flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-medium"
              style={{ background: "var(--accent-bg)", color: "var(--accent)" }}
            >
              {badge.icon}
              {badge.label}
            </span>
          </>
        )}
      </div>
      {actions}
    </header>
  );
}
