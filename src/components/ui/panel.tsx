import { clsx } from "clsx";
import type { HTMLAttributes } from "react";

export function Panel({ className, ...props }: HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={clsx(
        "rounded-md border border-border bg-surface p-5 shadow-card",
        className
      )}
      {...props}
    />
  );
}

