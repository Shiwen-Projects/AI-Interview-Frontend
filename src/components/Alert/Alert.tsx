import {
  Alert as MantineAlert,
  type AlertProps as MantineAlertProps,
} from "@mantine/core";
import { CircleCheck, CircleX, Info, TriangleAlert } from "lucide-react";

export type AlertProps = Omit<
  MantineAlertProps,
  "children" | "color" | "icon" | "title"
> & {
  description: string;
  type: "error" | "warning" | "info" | "success";
};

export const Alert = (props: AlertProps) => {
  const { type, description, ...alertProps } = props;
  const styleMap = {
    info: {
      title: "Info",
      color: "blue",
      icon: <Info size={18} />,
    },
    error: {
      title: "Error",
      color: "red",
      icon: <CircleX size={18} />,
    },
    warning: {
      title: "Warning",
      color: "yellow",
      icon: <TriangleAlert size={18} />,
    },
    success: {
      title: "Success",
      color: "green",
      icon: <CircleCheck size={18} />,
    },
  };

  const style = styleMap[type];

  return (
    <MantineAlert
      {...alertProps}
      title={style.title}
      color={style.color}
      icon={style.icon}
    >
      {description}
    </MantineAlert>
  );
};