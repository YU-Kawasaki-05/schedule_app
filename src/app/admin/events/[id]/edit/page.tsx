import { notFound } from "next/navigation";
import { AdminShell } from "@/components/admin/admin-shell";
import { EventForm } from "@/components/admin/event-form";
import { SetupNotice } from "@/components/ui/setup-notice";
import { updateEventAction } from "@/lib/actions/event-actions";
import { requireCurrentUser } from "@/lib/auth";
import { getSupabaseConfigStatus } from "@/lib/env";
import { getAdminEventDetail } from "@/lib/events/data";

export default async function EditEventPage({
  params
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const config = getSupabaseConfigStatus();

  if (!config.ready) {
    return (
      <AdminShell
        description="Supabaseを設定するとイベント編集を利用できます。"
        title="イベント編集"
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

  return (
    <AdminShell description={event.title} title="イベント編集">
      <EventForm action={updateEventAction} event={event} submitLabel="更新する" />
    </AdminShell>
  );
}

