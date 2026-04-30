import type {
  AvailabilityStatus,
  Database,
  EventStatus,
  EventVisibility
} from "@/lib/supabase/types";

export type EventRow = Database["public"]["Tables"]["events"]["Row"];
export type EventSlotRow = Database["public"]["Tables"]["event_slots"]["Row"];
export type RespondentRow = Database["public"]["Tables"]["respondents"]["Row"];
export type AvailabilityRow =
  Database["public"]["Tables"]["availabilities"]["Row"];

export type EventSlotInput = {
  id?: string;
  startsAt: string;
  endsAt: string;
  label?: string;
  sortOrder: number;
};

export type EventFormInput = {
  adminNote?: string;
  allowMaybe: boolean;
  description?: string;
  responseDeadlineAt?: string;
  slots: EventSlotInput[];
  status?: EventStatus;
  title: string;
  visibility: EventVisibility;
};

export type ResponseInput = {
  displayName: string;
  availabilities: Array<{
    slotId: string;
    status: AvailabilityStatus;
  }>;
};

export type EventWithSlots = EventRow & {
  slots: EventSlotRow[];
};

export type RespondentWithAvailabilities = RespondentRow & {
  availabilities: AvailabilityRow[];
};

export type EventDetail = EventWithSlots & {
  respondents: RespondentWithAvailabilities[];
};

export type EventSummary = EventRow & {
  responseCount: number;
  slotCount: number;
};

export type SlotSummary = EventSlotRow & {
  availableCount: number;
};

