import { PublicResponseForm } from "@/components/public/public-response-form";
import { Panel } from "@/components/ui/panel";
import { SetupNotice } from "@/components/ui/setup-notice";
import { getSupabaseConfigStatus } from "@/lib/env";
import { getPublicEvent } from "@/lib/events/data";

export default async function PublicEditPage({
  params,
  searchParams
}: {
  params: Promise<{ slug: string }>;
  searchParams: Promise<{ respondentId?: string; token?: string }>;
}) {
  const [{ slug }, query] = await Promise.all([params, searchParams]);
  const config = getSupabaseConfigStatus();

  if (!config.ready) {
    return (
      <main className="mx-auto min-h-screen w-full max-w-2xl px-4 py-6">
        <SetupNotice />
      </main>
    );
  }

  const event = await getPublicEvent(slug);

  if (!event) {
    return (
      <main className="mx-auto min-h-screen w-full max-w-2xl px-4 py-6">
        <Panel className="space-y-2">
          <h1 className="text-2xl font-bold text-text">イベントが見つかりません</h1>
          <p className="text-sm text-text-muted">
            URLが間違っているか、イベントが削除された可能性があります。
          </p>
        </Panel>
      </main>
    );
  }

  return (
    <main className="mx-auto min-h-screen w-full max-w-2xl px-4 py-6">
      <div className="space-y-5 pb-8">
        <Panel>
          <h1 className="text-3xl font-bold text-text">回答を修正</h1>
          <p className="text-sm text-text-muted">{event.title}</p>
        </Panel>
        <PublicResponseForm
          event={event}
          initialRespondentId={query.respondentId}
          initialToken={query.token}
          mode="edit"
        />
      </div>
    </main>
  );
}

