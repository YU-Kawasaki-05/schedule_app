import Link from "next/link";
import { CalendarPlus, ExternalLink, Pencil } from "lucide-react";
import { AdminShell } from "@/components/admin/admin-shell";
import { EventStatusBadge } from "@/components/admin/event-status-badge";
import { ButtonLink } from "@/components/ui/button";
import { CopyButton } from "@/components/ui/copy-button";
import { EmptyState } from "@/components/ui/empty-state";
import { Panel } from "@/components/ui/panel";
import { SetupNotice } from "@/components/ui/setup-notice";
import { getPublicAppUrl, getSupabaseConfigStatus } from "@/lib/env";
import { formatDateTime } from "@/lib/events/format";
import { listAdminEvents } from "@/lib/events/data";
import { requireCurrentUser } from "@/lib/auth";

export default async function AdminEventsPage() {
  const config = getSupabaseConfigStatus();

  if (!config.ready) {
    return (
      <AdminShell
        description="Supabaseを設定するとイベント一覧を利用できます。"
        title="イベント一覧"
      >
        <SetupNotice />
      </AdminShell>
    );
  }

  const user = await requireCurrentUser();
  const events = await listAdminEvents(user.id);
  const appUrl = getPublicAppUrl();

  return (
    <AdminShell
      description="作成済みの予定調整イベントを確認します。"
      title="イベント一覧"
    >
      {events.length === 0 ? (
        <EmptyState
          action={
            <ButtonLink href="/admin/events/new">
              <CalendarPlus aria-hidden="true" size={16} />
              新しい予定を作成
            </ButtonLink>
          }
          description="最初の予定調整イベントを作成して、招待URLを共有しましょう。"
          title="まだイベントがありません"
        />
      ) : (
        <Panel className="overflow-hidden p-0">
          <div className="overflow-x-auto">
            <table className="w-full min-w-[840px] border-collapse text-left">
              <thead className="border-b border-border bg-surface-muted text-sm text-text-muted">
                <tr>
                  <th className="px-4 py-3 font-semibold">タイトル</th>
                  <th className="px-4 py-3 font-semibold">回答</th>
                  <th className="px-4 py-3 font-semibold">候補</th>
                  <th className="px-4 py-3 font-semibold">状態</th>
                  <th className="px-4 py-3 font-semibold">作成日</th>
                  <th className="px-4 py-3 font-semibold">操作</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {events.map((event) => {
                  const publicUrl = `${appUrl}/e/${event.public_slug}`;

                  return (
                    <tr key={event.id}>
                      <td className="px-4 py-4">
                        <Link
                          className="font-semibold text-text hover:text-primary"
                          href={`/admin/events/${event.id}`}
                        >
                          {event.title}
                        </Link>
                      </td>
                      <td className="px-4 py-4 text-sm text-text-muted">
                        {event.responseCount}人
                      </td>
                      <td className="px-4 py-4 text-sm text-text-muted">
                        {event.slotCount}件
                      </td>
                      <td className="px-4 py-4">
                        <EventStatusBadge status={event.status} />
                      </td>
                      <td className="px-4 py-4 text-sm text-text-muted">
                        {formatDateTime(event.created_at)}
                      </td>
                      <td className="px-4 py-4">
                        <div className="flex flex-wrap gap-2">
                          <ButtonLink
                            href={`/admin/events/${event.id}`}
                            variant="secondary"
                          >
                            <ExternalLink aria-hidden="true" size={16} />
                            詳細
                          </ButtonLink>
                          <ButtonLink
                            href={`/admin/events/${event.id}/edit`}
                            variant="secondary"
                          >
                            <Pencil aria-hidden="true" size={16} />
                            編集
                          </ButtonLink>
                          <CopyButton label="URL" text={publicUrl} />
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </Panel>
      )}
    </AdminShell>
  );
}
