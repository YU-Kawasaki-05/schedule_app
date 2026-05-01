import Link from "next/link";
import { CalendarDays, LockKeyhole } from "lucide-react";
import { ButtonLink } from "@/components/ui/button";
import { Panel } from "@/components/ui/panel";
import { getSupabaseConfigStatus } from "@/lib/env";

export default function HomePage() {
  const config = getSupabaseConfigStatus();

  return (
    <main className="mx-auto flex min-h-screen w-full max-w-5xl flex-col px-4 py-8 sm:px-6 lg:px-8">
      <div className="flex flex-1 items-center">
        <section className="w-full space-y-6">
          <div className="space-y-3">
            <div className="inline-flex items-center gap-2 rounded-pill border border-border bg-surface px-3 py-1 text-sm font-medium text-text-muted">
              <CalendarDays aria-hidden="true" size={16} />
              予定調整アプリ
            </div>
            <h1 className="max-w-3xl text-3xl font-bold leading-tight text-text sm:text-4xl">
              候補日を作り、URLを共有して、行ける日だけ回答してもらう。
            </h1>
            <p className="max-w-2xl text-base text-text-muted">
              管理者はイベントを作成し、回答者はログインなしで回答できます。
            </p>
          </div>

          {!config.ready ? (
            <Panel className="max-w-2xl">
              <div className="space-y-3">
                <div className="flex items-center gap-2 text-sm font-semibold text-warning">
                  <LockKeyhole aria-hidden="true" size={18} />
                  Supabase設定待ち
                </div>
                <p className="text-sm text-text-muted">
                  `.env.local` に Supabase の接続値を設定すると、管理画面と公開回答が有効になります。
                </p>
                <ul className="list-inside list-disc text-sm text-text-muted">
                  {config.missing.map((key) => (
                    <li key={key}>{key}</li>
                  ))}
                  {config.invalid.map((key) => (
                    <li key={key}>
                      {key === "NEXT_PUBLIC_SUPABASE_URL"
                        ? `${key} は https://...supabase.co 形式で入力してください。`
                        : key === "NEXT_PUBLIC_APP_URL"
                          ? `${key} は https://<your-domain> 形式で、/** は付けずに入力してください。`
                          : `${key} には Supabase の secret/service_role key を入力してください。`}
                    </li>
                  ))}
                </ul>
              </div>
            </Panel>
          ) : null}

          <div className="flex flex-col gap-3 sm:flex-row">
            <ButtonLink href="/admin/events">管理画面を開く</ButtonLink>
            <Link
              className="inline-flex min-h-11 items-center justify-center rounded-md border border-border bg-surface px-4 py-2 text-sm font-semibold text-text shadow-card transition hover:bg-surface-muted"
              href="/admin/login"
            >
              ログイン
            </Link>
          </div>
        </section>
      </div>
    </main>
  );
}
