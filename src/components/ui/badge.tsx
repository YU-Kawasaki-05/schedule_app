import { clsx } from "clsx";
import type { HTMLAttributes } from "react";

type BadgeTone = "neutral" | "success" | "warning" | "danger" | "info";

const toneClass: Record<BadgeTone, string> = {
  neutral: "border-border bg-surface-muted text-text-muted",
  success: "border-success/20 bg-success/10 text-success",
  warning: "border-warning/20 bg-warning/10 text-warning",
  danger: "border-danger/20 bg-danger/10 text-danger",
  info: "border-info/20 bg-info/10 text-info"
};

export function Badge({
  className,
  tone = "neutral",
  ...props
}: HTMLAttributes<HTMLSpanElement> & { tone?: BadgeTone }) {
  return (
    <span
      className={clsx(
        "inline-flex items-center rounded-pill border px-2.5 py-1 text-xs font-semibold",
        toneClass[tone],
        className
      )}
      {...props}
    />
  );
}

