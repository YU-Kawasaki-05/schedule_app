import { notFound } from "next/navigation";
import { Check, ClipboardCopy, Lock, Pencil, Trash2, X } from "lucide-react";
import { AdminShell } from "@/components/admin/admin-shell";
import { EventStatusBadge } from "@/components/admin/event-status-badge";
import { Badge } from "@/components/ui/badge";
import { Button, ButtonLink } from "@/components/ui/button";
import { CopyButton } from "@/components/ui/copy-button";
import { Panel } from "@/components/ui/panel";
import { SetupNotice } from "@/components/ui/setup-notice";
import {
  closeEventAction,
  deleteEventAction
} from "@/lib/actions/event-actions";
import { requireCurrentUser } from "@/lib/auth";
import { getPublicAppUrl, getSupabaseConfigStatus } from "@/lib/env";
import { getAdminEventDetail } from "@/lib/events/data";
import { formatDateTime, formatSlot } from "@/lib/events/format";
import { summarizeSlots } from "@/lib/events/summary";

export default async function AdminEventDetailPage({
  params
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const config = getSupabaseConfigStatus();

  if (!config.ready) {
    return (
      <AdminShell
        description="Supabaseを設定するとイベント詳細を利用できます。"
        title="イベント詳細"
      >
        <SetupNotice />
      </AdminShell>
    );
  }

  const user = await requireCurrentUser();
  const event = await getAdminEventDetail(user.id, id);

  if (!event) {
    notFound();
  }

  const publicUrl = `${getPublicAppUrl()}/e/${event.public_slug}`;
  const rankedSlots = summarizeSlots(event.slots, event.respondents);
  const bestSlot = rankedSlots[0] ?? null;

  return (
    <AdminShell description={event.description ?? undefined} title={event.title}>
      <div className="space-y-6">
        <Panel className="space-y-4">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
            <div className="space-y-2">
              <div className="flex flex-wrap items-center gap-2">
                <EventStatusBadge status={event.status} />
                <Badge tone="neutral">回答 {event.respondents.length}人</Badge>
                <Badge tone="neutral">候補 {event.slots.length}件</Badge>
              </div>
              <p className="text-sm text-text-muted">
                締切: {formatDateTime(event.response_deadline_at)}
              </p>
              <p className="break-all rounded-sm border border-border bg-surface-muted px-3 py-2 font-mono text-sm text-text">
                {publicUrl}
              </p>
            </div>
            <div className="flex flex-wrap gap-2">
              <CopyButton label="招待URL" text={publicUrl} />
              <ButtonLink href={`/admin/events/${event.id}/edit`} variant="secondary">
                <Pencil aria-hidden="true" size={16} />
                編集
              </ButtonLink>
              {event.status === "open" ? (
                <form action={closeEventAction}>
                  <input name="eventId" type="hidden" value={event.id} />
                  <Button type="submit" variant="secondary">
                    <Lock aria-hidden="true" size={16} />
                    締切
                  </Button>
                </form>
              ) : null}
              <form action={deleteEventAction}>
                <input name="eventId" type="hidden" value={event.id} />
                <Button type="submit" variant="danger">
                  <Trash2 aria-hidden="true" size={16} />
                  削除
                </Button>
              </form>
            </div>
          </div>
        </Panel>

        <Panel className="space-y-4">
          <div className="flex items-center gap-2">
            <ClipboardCopy aria-hidden="true" className="text-primary" size={20} />
            <h2 className="text-xl font-semibold text-text">一番集まりやすい候補</h2>
          </div>
          {bestSlot ? (
            <div className="flex flex-col gap-3 rounded-sm border border-border bg-surface-muted px-4 py-4 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <p className="text-lg font-semibold text-text">
                  {formatSlot(bestSlot.starts_at, bestSlot.ends_at)}
                </p>
                <p className="text-sm text-text-muted">
                  {bestSlot.availableCount}人が参加可能
                </p>
              </div>
              <CopyButton
                label="候補をコピー"
                text={formatSlot(bestSlot.starts_at, bestSlot.ends_at)}
              />
            </div>
          ) : (
            <p className="text-sm text-text-muted">候補日時がありません。</p>
          )}
        </Panel>

        <Panel className="space-y-4">
          <h2 className="text-xl font-semibold text-text">候補日時別ランキング</h2>
          <div className="space-y-2">
            {rankedSlots.map((slot, index) => (
              <div
                className="flex items-center justify-between gap-3 rounded-sm border border-border px-3 py-3"
                key={slot.id}
              >
                <div>
                  <p className="font-semibold text-text">
                    {index + 1}位 {formatSlot(slot.starts_at, slot.ends_at)}
                  </p>
                </div>
                <Badge tone={slot.availableCount > 0 ? "success" : "neutral"}>
                  {slot.availableCount}人
                </Badge>
              </div>
            ))}
          </div>
        </Panel>

        <Panel className="space-y-4">
          <h2 className="text-xl font-semibold text-text">回答マトリクス</h2>
          {event.respondents.length === 0 ? (
            <p className="rounded-sm border border-border bg-surface-muted px-3 py-4 text-sm text-text-muted">
              まだ回答がありません。
            </p>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full min-w-[720px] border-collapse text-left">
                <thead className="border-b border-border bg-surface-muted text-sm text-text-muted">
                  <tr>
                    <th className="sticky left-0 bg-surface-muted px-4 py-3 font-semibold">
                      回答者
                    </th>
                    {event.slots.map((slot) => (
                      <th className="px-4 py-3 font-semibold" key={slot.id}>
                        {formatSlot(slot.starts_at, slot.ends_at)}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-border">
                  {event.respondents.map((respondent) => (
                    <tr key={respondent.id}>
                      <th className="sticky left-0 bg-surface px-4 py-3 font-semibold">
                        {respondent.display_name}
                      </th>
                      {event.slots.map((slot) => {
                        const answer = respondent.availabilities.find(
                          (availability) => availability.slot_id === slot.id
                        );
                        const available = answer?.status === "available";

                        return (
                          <td className="px-4 py-3" key={slot.id}>
                            <span
                              className={
                                available
                                  ? "inline-flex items-center gap-1 font-semibold text-success"
                                  : "inline-flex items-center gap-1 text-text-muted"
                              }
                            >
                              {available ? (
                                <Check aria-hidden="true" size={16} />
                              ) : (
                                <X aria-hidden="true" size={16} />
                              )}
                              {available ? "○" : "×"}
                            </span>
                          </td>
                        );
                      })}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </Panel>
      </div>
    </AdminShell>
  );
}

