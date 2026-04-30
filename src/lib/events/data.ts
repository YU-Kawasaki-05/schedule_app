import { cache } from "react";
import { createSupabaseAdminClient } from "@/lib/supabase/admin";
import type {
  AvailabilityRow,
  EventDetail,
  EventRow,
  EventSlotRow,
  EventSummary,
  EventWithSlots,
  RespondentRow,
  RespondentWithAvailabilities
} from "@/lib/events/types";

function sortSlots(slots: EventSlotRow[]) {
  return [...slots].sort(
    (a, b) =>
      a.sort_order - b.sort_order ||
      new Date(a.starts_at).getTime() - new Date(b.starts_at).getTime()
  );
}

export const listAdminEvents = cache(
  async (ownerUserId: string): Promise<EventSummary[]> => {
    const supabase = createSupabaseAdminClient();

    if (!supabase) {
      return [];
    }

    const { data: events, error } = await supabase
      .from("events")
      .select("*")
      .eq("owner_user_id", ownerUserId)
      .is("deleted_at", null)
      .order("created_at", { ascending: false });

    if (error || !events?.length) {
      return [];
    }

    const ids = events.map((event) => event.id);
    const [{ data: slots }, { data: respondents }] = await Promise.all([
      supabase.from("event_slots").select("id,event_id").in("event_id", ids),
      supabase
        .from("respondents")
        .select("id,event_id")
        .in("event_id", ids)
        .is("deleted_at", null)
    ]);

    return events.map((event) => ({
      ...event,
      responseCount:
        respondents?.filter((respondent) => respondent.event_id === event.id)
          .length ?? 0,
      slotCount:
        slots?.filter((slot) => slot.event_id === event.id).length ?? 0
    }));
  }
);

export const getAdminEventDetail = cache(
  async (ownerUserId: string, eventId: string): Promise<EventDetail | null> => {
    const supabase = createSupabaseAdminClient();

    if (!supabase) {
      return null;
    }

    const { data: event, error } = await supabase
      .from("events")
      .select("*")
      .eq("id", eventId)
      .eq("owner_user_id", ownerUserId)
      .is("deleted_at", null)
      .maybeSingle();

    if (error || !event) {
      return null;
    }

    const [{ data: slots }, { data: respondents }] = await Promise.all([
      supabase
        .from("event_slots")
        .select("*")
        .eq("event_id", event.id)
        .order("sort_order", { ascending: true }),
      supabase
        .from("respondents")
        .select("*")
        .eq("event_id", event.id)
        .is("deleted_at", null)
        .order("created_at", { ascending: true })
    ]);

    const respondentRows = respondents ?? [];
    const respondentIds = respondentRows.map((respondent) => respondent.id);
    const { data: availabilities } = respondentIds.length
      ? await supabase
          .from("availabilities")
          .select("*")
          .in("respondent_id", respondentIds)
      : { data: [] as AvailabilityRow[] };

    return {
      ...event,
      respondents: respondentRows.map((respondent) => ({
        ...respondent,
        availabilities:
          availabilities?.filter(
            (availability) => availability.respondent_id === respondent.id
          ) ?? []
      })),
      slots: sortSlots(slots ?? [])
    };
  }
);

export const getPublicEvent = cache(
  async (slug: string): Promise<EventWithSlots | null> => {
    const supabase = createSupabaseAdminClient();

    if (!supabase) {
      return null;
    }

    const { data: event, error } = await supabase
      .from("events")
      .select("*")
      .eq("public_slug", slug)
      .is("deleted_at", null)
      .maybeSingle();

    if (error || !event) {
      return null;
    }

    const { data: slots } = await supabase
      .from("event_slots")
      .select("*")
      .eq("event_id", event.id)
      .order("sort_order", { ascending: true });

    return {
      ...event,
      slots: sortSlots(slots ?? [])
    };
  }
);

export async function getEventForMutation(
  eventId: string,
  ownerUserId: string
): Promise<EventRow | null> {
  const supabase = createSupabaseAdminClient();

  if (!supabase) {
    return null;
  }

  const { data } = await supabase
    .from("events")
    .select("*")
    .eq("id", eventId)
    .eq("owner_user_id", ownerUserId)
    .is("deleted_at", null)
    .maybeSingle();

  return data ?? null;
}

export async function getRespondentWithAvailabilities(
  respondentId: string
): Promise<RespondentWithAvailabilities | null> {
  const supabase = createSupabaseAdminClient();

  if (!supabase) {
    return null;
  }

  const { data: respondent } = await supabase
    .from("respondents")
    .select("*")
    .eq("id", respondentId)
    .is("deleted_at", null)
    .maybeSingle();

  if (!respondent) {
    return null;
  }

  const { data: availabilities } = await supabase
    .from("availabilities")
    .select("*")
    .eq("respondent_id", respondent.id);

  return {
    ...respondent,
    availabilities: availabilities ?? []
  };
}

export type PublicEventRecord = EventRow & {
  slots: EventSlotRow[];
  respondents?: RespondentRow[];
};

