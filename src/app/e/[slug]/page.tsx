import { CalendarX } from "lucide-react";
import { PublicResponseForm } from "@/components/public/public-response-form";
import { Badge } from "@/components/ui/badge";
import { Panel } from "@/components/ui/panel";
import { SetupNotice } from "@/components/ui/setup-notice";
import { getSupabaseConfigStatus } from "@/lib/env";
import { getPublicEvent } from "@/lib/events/data";
import { formatDateTime } from "@/lib/events/format";

function isClosed(event: { response_deadline_at: string | null; status: string }) {
  return (
    event.status !== "open" ||
    Boolean(
      event.response_deadline_at &&
        new Date(event.response_deadline_at).getTime() <= Date.now()
    )
  );
}

export default async function PublicAnswerPage({
  params
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
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

  const closed = isClosed(event);

  return (
    <main className="mx-auto min-h-screen w-full max-w-2xl px-4 py-6">
      <div className="space-y-5 pb-8">
        <Panel className="space-y-3">
          <div className="flex flex-wrap items-center gap-2">
            <Badge tone={closed ? "warning" : "success"}>
              {closed ? "締切済み" : "募集中"}
            </Badge>
            <Badge tone="neutral">締切 {formatDateTime(event.response_deadline_at)}</Badge>
          </div>
          <h1 className="text-3xl font-bold leading-tight text-text">
            {event.title}
          </h1>
          {event.description ? (
            <p className="whitespace-pre-wrap text-text-muted">{event.description}</p>
          ) : null}
        </Panel>

        {closed ? (
          <Panel className="space-y-3">
            <div className="flex items-center gap-2 text-warning">
              <CalendarX aria-hidden="true" size={20} />
              <h2 className="text-xl font-semibold">この予定調整は締め切られました</h2>
            </div>
            <p className="text-sm text-text-muted">
              締切後は新規回答と回答編集ができません。
            </p>
          </Panel>
        ) : (
          <PublicResponseForm event={event} />
        )}
      </div>
    </main>
  );
}

