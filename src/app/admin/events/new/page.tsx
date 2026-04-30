import { AdminShell } from "@/components/admin/admin-shell";
import { EventForm } from "@/components/admin/event-form";
import { SetupNotice } from "@/components/ui/setup-notice";
import { createEventAction } from "@/lib/actions/event-actions";
import { getSupabaseConfigStatus } from "@/lib/env";
import { requireCurrentUser } from "@/lib/auth";

export default async function NewEventPage() {
  const config = getSupabaseConfigStatus();

  if (!config.ready) {
    return (
      <AdminShell
        description="Supabaseを設定するとイベント作成を利用できます。"
        title="新しい予定"
      >
        <SetupNotice />
      </AdminShell>
    );
  }

  await requireCurrentUser();

  return (
    <AdminShell
      description="タイトルと候補日時を入力して、招待URLを発行します。"
      title="新しい予定"
    >
      <EventForm action={createEventAction} submitLabel="作成する" />
    </AdminShell>
  );
}

