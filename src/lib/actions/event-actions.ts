"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { actionError, type ActionState } from "@/lib/actions/state";
import { requireCurrentUser } from "@/lib/auth";
import { eventFormSchema } from "@/lib/events/schemas";
import type { EventSlotInput } from "@/lib/events/types";
import { createPublicSlug } from "@/lib/events/tokens";
import { createSupabaseAdminClient } from "@/lib/supabase/admin";

function parseBoolean(value: FormDataEntryValue | null) {
  return value === "on" || value === "true";
}

function parseSlots(value: FormDataEntryValue | null): EventSlotInput[] {
  if (!value || typeof value !== "string") {
    return [];
  }

  try {
    const parsed = JSON.parse(value) as EventSlotInput[];
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

function parseEventForm(formData: FormData) {
  const responseDeadlineAt = String(formData.get("responseDeadlineAt") || "");

  return eventFormSchema.safeParse({
    adminNote: String(formData.get("adminNote") || ""),
    allowMaybe: parseBoolean(formData.get("allowMaybe")),
    description: String(formData.get("description") || ""),
    responseDeadlineAt: responseDeadlineAt
      ? new Date(responseDeadlineAt).toISOString()
      : undefined,
    slots: parseSlots(formData.get("slotsJson")),
    title: String(formData.get("title") || ""),
    visibility: formData.get("visibility") || "private_result"
  });
}

async function createUniquePublicSlug() {
  const supabase = createSupabaseAdminClient();

  if (!supabase) {
    return createPublicSlug();
  }

  for (let attempt = 0; attempt < 8; attempt += 1) {
    const slug = createPublicSlug();
    const { data } = await supabase
      .from("events")
      .select("id")
      .eq("public_slug", slug)
      .maybeSingle();

    if (!data) {
      return slug;
    }
  }

  return createPublicSlug(16);
}

export async function createEventAction(
  _prevState: ActionState,
  formData: FormData
): Promise<ActionState> {
  const user = await requireCurrentUser();
  const supabase = createSupabaseAdminClient();

  if (!supabase) {
    return actionError("Supabaseの環境変数を設定してください。");
  }

  const parsed = parseEventForm(formData);

  if (!parsed.success) {
    return actionError(parsed.error.issues[0]?.message ?? "入力内容を確認してください。");
  }

  const slug = await createUniquePublicSlug();
  const { data: event, error: eventError } = await supabase
    .from("events")
    .insert({
      admin_note: parsed.data.adminNote ?? null,
      allow_maybe: parsed.data.allowMaybe,
      description: parsed.data.description ?? null,
      owner_user_id: user.id,
      public_slug: slug,
      response_deadline_at: parsed.data.responseDeadlineAt ?? null,
      status: "open",
      timezone: "Asia/Tokyo",
      title: parsed.data.title,
      visibility: parsed.data.visibility
    })
    .select("*")
    .single();

  if (eventError || !event) {
    return actionError("イベントを作成できませんでした。");
  }

  const { error: slotsError } = await supabase.from("event_slots").insert(
    parsed.data.slots.map((slot, index) => ({
      ends_at: slot.endsAt,
      event_id: event.id,
      label: slot.label ?? null,
      sort_order: index,
      starts_at: slot.startsAt
    }))
  );

  if (slotsError) {
    await supabase.from("events").delete().eq("id", event.id);
    return actionError("候補日時を保存できませんでした。");
  }

  revalidatePath("/admin/events");
  redirect(`/admin/events/${event.id}`);
}

export async function updateEventAction(
  _prevState: ActionState,
  formData: FormData
): Promise<ActionState> {
  const user = await requireCurrentUser();
  const supabase = createSupabaseAdminClient();

  if (!supabase) {
    return actionError("Supabaseの環境変数を設定してください。");
  }

  const eventId = String(formData.get("eventId") || "");
  const parsed = parseEventForm(formData);

  if (!eventId) {
    return actionError("イベントIDが見つかりません。");
  }

  if (!parsed.success) {
    return actionError(parsed.error.issues[0]?.message ?? "入力内容を確認してください。");
  }

  const { data: event } = await supabase
    .from("events")
    .select("*")
    .eq("id", eventId)
    .eq("owner_user_id", user.id)
    .is("deleted_at", null)
    .maybeSingle();

  if (!event) {
    return actionError("イベントが見つかりません。");
  }

  const { error: updateError } = await supabase
    .from("events")
    .update({
      admin_note: parsed.data.adminNote ?? null,
      allow_maybe: parsed.data.allowMaybe,
      description: parsed.data.description ?? null,
      response_deadline_at: parsed.data.responseDeadlineAt ?? null,
      title: parsed.data.title,
      visibility: parsed.data.visibility
    })
    .eq("id", event.id)
    .eq("owner_user_id", user.id);

  if (updateError) {
    return actionError("イベントを更新できませんでした。");
  }

  const incomingExistingIds = parsed.data.slots
    .map((slot) => slot.id)
    .filter(Boolean) as string[];

  if (incomingExistingIds.length) {
    await supabase
      .from("event_slots")
      .delete()
      .eq("event_id", event.id)
      .not("id", "in", `(${incomingExistingIds.join(",")})`);
  } else {
    await supabase.from("event_slots").delete().eq("event_id", event.id);
  }

  for (const [index, slot] of parsed.data.slots.entries()) {
    if (slot.id) {
      const { error } = await supabase
        .from("event_slots")
        .update({
          ends_at: slot.endsAt,
          label: slot.label ?? null,
          sort_order: index,
          starts_at: slot.startsAt
        })
        .eq("id", slot.id)
        .eq("event_id", event.id);

      if (error) {
        return actionError("候補日時を更新できませんでした。");
      }
    } else {
      const { error } = await supabase.from("event_slots").insert({
        ends_at: slot.endsAt,
        event_id: event.id,
        label: slot.label ?? null,
        sort_order: index,
        starts_at: slot.startsAt
      });

      if (error) {
        return actionError("候補日時を追加できませんでした。");
      }
    }
  }

  revalidatePath("/admin/events");
  revalidatePath(`/admin/events/${event.id}`);
  redirect(`/admin/events/${event.id}`);
}

export async function closeEventAction(formData: FormData) {
  const user = await requireCurrentUser();
  const supabase = createSupabaseAdminClient();
  const eventId = String(formData.get("eventId") || "");

  if (!supabase || !eventId) {
    redirect("/admin/events");
  }

  await supabase
    .from("events")
    .update({ status: "closed" })
    .eq("id", eventId)
    .eq("owner_user_id", user.id);

  revalidatePath("/admin/events");
  revalidatePath(`/admin/events/${eventId}`);
}

export async function deleteEventAction(formData: FormData) {
  const user = await requireCurrentUser();
  const supabase = createSupabaseAdminClient();
  const eventId = String(formData.get("eventId") || "");

  if (!supabase || !eventId) {
    redirect("/admin/events");
  }

  await supabase
    .from("events")
    .update({ deleted_at: new Date().toISOString() })
    .eq("id", eventId)
    .eq("owner_user_id", user.id);

  revalidatePath("/admin/events");
  redirect("/admin/events");
}

