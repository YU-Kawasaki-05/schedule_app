import Link from "next/link";
import { clsx } from "clsx";
import type { AnchorHTMLAttributes, ButtonHTMLAttributes } from "react";

type ButtonVariant = "primary" | "secondary" | "ghost" | "danger";

const variantClass: Record<ButtonVariant, string> = {
  primary: "border-primary bg-primary text-white hover:bg-primary-strong",
  secondary: "border-border bg-surface text-text hover:bg-surface-muted",
  ghost: "border-transparent bg-transparent text-text hover:bg-surface-muted",
  danger: "border-danger bg-danger text-white hover:brightness-95"
};

const baseClass =
  "inline-flex min-h-11 items-center justify-center gap-2 rounded-md border px-4 py-2 text-sm font-semibold shadow-card transition disabled:cursor-not-allowed disabled:opacity-60";

export function Button({
  className,
  variant = "primary",
  type = "button",
  ...props
}: ButtonHTMLAttributes<HTMLButtonElement> & { variant?: ButtonVariant }) {
  return (
    <button
      className={clsx(baseClass, variantClass[variant], className)}
      type={type}
      {...props}
    />
  );
}

export function ButtonLink({
  className,
  variant = "primary",
  ...props
}: AnchorHTMLAttributes<HTMLAnchorElement> & {
  href: string;
  variant?: ButtonVariant;
}) {
  return (
    <Link
      className={clsx(baseClass, variantClass[variant], className)}
      {...props}
    />
  );
}

