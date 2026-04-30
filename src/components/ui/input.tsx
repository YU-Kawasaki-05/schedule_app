import { clsx } from "clsx";
import type {
  InputHTMLAttributes,
  SelectHTMLAttributes,
  TextareaHTMLAttributes
} from "react";

const controlClass =
  "min-h-11 w-full rounded-sm border border-border bg-surface px-3 py-2 text-base text-text shadow-sm transition placeholder:text-text-muted focus:border-primary focus:ring-2 focus:ring-primary/20";

export function Input({
  className,
  ...props
}: InputHTMLAttributes<HTMLInputElement>) {
  return <input className={clsx(controlClass, className)} {...props} />;
}

export function Textarea({
  className,
  ...props
}: TextareaHTMLAttributes<HTMLTextAreaElement>) {
  return (
    <textarea
      className={clsx(controlClass, "min-h-28 resize-y", className)}
      {...props}
    />
  );
}

export function Select({
  className,
  ...props
}: SelectHTMLAttributes<HTMLSelectElement>) {
  return <select className={clsx(controlClass, className)} {...props} />;
}

export function Field({
  children,
  error,
  label,
  htmlFor,
  help
}: {
  children: React.ReactNode;
  error?: string | null;
  label: string;
  htmlFor: string;
  help?: string;
}) {
  return (
    <div className="space-y-2">
      <label className="block text-sm font-semibold text-text" htmlFor={htmlFor}>
        {label}
      </label>
      {children}
      {help ? <p className="text-sm text-text-muted">{help}</p> : null}
      {error ? <p className="text-sm font-medium text-danger">{error}</p> : null}
    </div>
  );
}

