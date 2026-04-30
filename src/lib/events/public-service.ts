import "server-only";

import { NextResponse } from "next/server";
import { responseSchema } from "@/lib/events/schemas";
import { createEditToken, hashEditToken } from "@/lib/events/tokens";
import type { EventRow } from "@/lib/events/types";
import type { AvailabilityStatus } from "@/lib/supabase/types";
import { createSupabaseAdminClient } from "@/lib/supabase/admin";
import { getPublicAppUrl } from "@/lib/env";

function jsonError(message: string, status = 400) {
  return NextResponse.json({ error: message }, { status });
}

function isEventOpen(event: EventRow) {
  if (event.status !== "open") {
    return false;
  }

  if (!event.response_deadline_at) {
    return true;
  }

  return new Date(event.response_deadline_at).getTime() > Date.now();
}

function normalizeAvailabilities(
  eventSlotIds: string[],
  requested: Array<{ slotId: string; status: AvailabilityStatus }>,
  allowMaybe: boolean
) {
  const requestedBySlot = new Map(
    requested.map((availability) => [availability.slotId, availability.status])
  );

  return eventSlotIds.map((slotId) => {
    const status = requestedBySlot.get(slotId) ?? "unavailable";

    return {
      slotId,
      status: status === "maybe" && !allowMaybe ? "unavailable" : status
    };
  });
}

async function getPublicEventRecord(slug: string) {
  const supabase = createSupabaseAdminClient();

  if (!supabase) {
    return { error: jsonError("Supabaseの環境変数を設定してください。", 503) };
  }

  const { data: event } = await supabase
    .from("events")
    .select("*")
    .eq("public_slug", slug)
    .is("deleted_at", null)
    .maybeSingle();

  if (!event) {
    return { error: jsonError("イベントが見つかりません。", 404) };
  }

  const { data: slots } = await supabase
    .from("event_slots")
    .select("*")
    .eq("event_id", event.id)
    .order("sort_order", { ascending: true });

  return {
    event,
    slots: slots ?? [],
    supabase
  };
}

export async function createPublicResponse(slug: string, request: Request) {
  const record = await getPublicEventRecord(slug);

  if ("error" in record) {
    return record.error;
  }

  if (!isEventOpen(record.event)) {
    return jsonError("この予定調整は締め切られています。", 403);
  }

  const body = await request.json().catch(() => null);
  const parsed = responseSchema.safeParse(body);

  if (!parsed.success) {
    return jsonError(parsed.error.issues[0]?.message ?? "入力内容を確認してください。");
  }

  const eventSlotIds = record.slots.map((slot) => slot.id);
  const requestedSlotIds = parsed.data.availabilities.map(
    (availability) => availability.slotId
  );
  const hasInvalidSlot = requestedSlotIds.some(
    (slotId) => !eventSlotIds.includes(slotId)
  );

  if (hasInvalidSlot) {
    return jsonError("候補日時が変更されています。現在の候補に合わせて回答してください。");
  }

  const token = createEditToken();
  const { data: respondent, error: respondentError } = await record.supabase
    .from("respondents")
    .insert({
      display_name: parsed.data.displayName,
      edit_token_hash: hashEditToken(token),
      event_id: record.event.id
    })
    .select("*")
    .single();

  if (respondentError || !respondent) {
    return jsonError("回答を保存できませんでした。", 500);
  }

  const normalized = normalizeAvailabilities(
    eventSlotIds,
    parsed.data.availabilities,
    record.event.allow_maybe
  );

  const { error: availabilityError } = await record.supabase
    .from("availabilities")
    .insert(
      normalized.map((availability) => ({
        respondent_id: respondent.id,
        slot_id: availability.slotId,
        status: availability.status
      }))
    );

  if (availabilityError) {
    await record.supabase.from("respondents").delete().eq("id", respondent.id);
    return jsonError("回答を保存できませんでした。", 500);
  }

  return NextResponse.json({
    editUrl: `${getPublicAppUrl()}/e/${slug}/edit?respondentId=${respondent.id}&token=${token}`,
    respondentId: respondent.id,
    token
  });
}

export async function updatePublicResponse(
  slug: string,
  respondentId: string,
  request: Request
) {
  const record = await getPublicEventRecord(slug);

  if ("error" in record) {
    return record.error;
  }

  if (!isEventOpen(record.event)) {
    return jsonError("この予定調整は締め切られています。", 403);
  }

  const body = await request.json().catch(() => null);
  const token = typeof body?.token === "string" ? body.token : "";
  const parsed = responseSchema.safeParse(body);

  if (!parsed.success) {
    return jsonError(parsed.error.issues[0]?.message ?? "入力内容を確認してください。");
  }

  const { data: respondent } = await record.supabase
    .from("respondents")
    .select("*")
    .eq("id", respondentId)
    .eq("event_id", record.event.id)
    .is("deleted_at", null)
    .maybeSingle();

  if (!respondent || respondent.edit_token_hash !== hashEditToken(token)) {
    return jsonError("この回答を編集する権限がありません。", 403);
  }

  const eventSlotIds = record.slots.map((slot) => slot.id);
  const requestedSlotIds = parsed.data.availabilities.map(
    (availability) => availability.slotId
  );
  const hasInvalidSlot = requestedSlotIds.some(
    (slotId) => !eventSlotIds.includes(slotId)
  );

  if (hasInvalidSlot) {
    return jsonError("候補日時が変更されています。現在の候補に合わせて回答してください。");
  }

  const normalized = normalizeAvailabilities(
    eventSlotIds,
    parsed.data.availabilities,
    record.event.allow_maybe
  );

  const { error: respondentError } = await record.supabase
    .from("respondents")
    .update({
      display_name: parsed.data.displayName
    })
    .eq("id", respondent.id);

  if (respondentError) {
    return jsonError("回答を更新できませんでした。", 500);
  }

  const { error: availabilityError } = await record.supabase
    .from("availabilities")
    .upsert(
      normalized.map((availability) => ({
        respondent_id: respondent.id,
        slot_id: availability.slotId,
        status: availability.status
      })),
      { onConflict: "respondent_id,slot_id" }
    );

  if (availabilityError) {
    return jsonError("回答を更新できませんでした。", 500);
  }

  return NextResponse.json({
    ok: true,
    respondentId: respondent.id
  });
}

export async function getMyPublicResponse(slug: string, request: Request) {
  const url = new URL(request.url);
  const respondentId = url.searchParams.get("respondentId") || "";
  const token = url.searchParams.get("token") || "";
  const record = await getPublicEventRecord(slug);

  if ("error" in record) {
    return record.error;
  }

  const { data: respondent } = await record.supabase
    .from("respondents")
    .select("*")
    .eq("id", respondentId)
    .eq("event_id", record.event.id)
    .is("deleted_at", null)
    .maybeSingle();

  if (!respondent || respondent.edit_token_hash !== hashEditToken(token)) {
    return jsonError("この回答を編集する権限がありません。", 403);
  }

  const { data: availabilities } = await record.supabase
    .from("availabilities")
    .select("*")
    .eq("respondent_id", respondent.id);

  return NextResponse.json({
    availabilities: availabilities ?? [],
    displayName: respondent.display_name,
    respondentId: respondent.id
  });
}
