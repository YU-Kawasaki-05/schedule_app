import Link from "next/link";
import { CalendarDays, LogOut, Plus } from "lucide-react";
import { logoutAction } from "@/lib/actions/auth-actions";
import { Button } from "@/components/ui/button";
import { ButtonLink } from "@/components/ui/button";

export function AdminShell({
  children,
  title,
  description
}: {
  children: React.ReactNode;
  title: string;
  description?: string;
}) {
  return (
    <div className="min-h-screen bg-bg">
      <header className="border-b border-border bg-surface">
        <div className="mx-auto flex max-w-6xl flex-col gap-4 px-4 py-4 sm:flex-row sm:items-center sm:justify-between sm:px-6 lg:px-8">
          <Link
            className="inline-flex items-center gap-2 text-base font-bold text-text"
            href="/admin/events"
          >
            <CalendarDays aria-hidden="true" size={20} />
            予定調整 管理
          </Link>
          <div className="flex flex-wrap gap-2">
            <ButtonLink href="/admin/events/new" variant="primary">
              <Plus aria-hidden="true" size={16} />
              新しい予定
            </ButtonLink>
            <form action={logoutAction}>
              <Button type="submit" variant="secondary">
                <LogOut aria-hidden="true" size={16} />
                ログアウト
              </Button>
            </form>
          </div>
        </div>
      </header>
      <main className="mx-auto w-full max-w-6xl px-4 py-6 sm:px-6 lg:px-8">
        <div className="mb-6 space-y-1">
          <h1 className="text-3xl font-bold leading-tight text-text">{title}</h1>
          {description ? (
            <p className="text-sm text-text-muted">{description}</p>
          ) : null}
        </div>
        {children}
      </main>
    </div>
  );
}

