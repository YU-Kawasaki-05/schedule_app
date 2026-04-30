import { describe, expect, it } from "vitest";
import { summarizeSlots } from "@/lib/events/summary";
import type {
  EventSlotRow,
  RespondentWithAvailabilities
} from "@/lib/events/types";

const slots: EventSlotRow[] = [
  {
    created_at: "2026-04-30T00:00:00.000Z",
    ends_at: "2026-05-10T12:00:00.000Z",
    event_id: "event-1",
    id: "slot-1",
    label: null,
    sort_order: 0,
    starts_at: "2026-05-10T10:00:00.000Z"
  },
  {
    created_at: "2026-04-30T00:00:00.000Z",
    ends_at: "2026-05-11T12:00:00.000Z",
    event_id: "event-1",
    id: "slot-2",
    label: null,
    sort_order: 1,
    starts_at: "2026-05-11T10:00:00.000Z"
  }
];

const respondents: RespondentWithAvailabilities[] = [
  {
    availabilities: [
      {
        created_at: "2026-04-30T00:00:00.000Z",
        id: "availability-1",
        respondent_id: "respondent-1",
        slot_id: "slot-1",
        status: "available",
        updated_at: "2026-04-30T00:00:00.000Z"
      },
      {
        created_at: "2026-04-30T00:00:00.000Z",
        id: "availability-2",
        respondent_id: "respondent-1",
        slot_id: "slot-2",
        status: "unavailable",
        updated_at: "2026-04-30T00:00:00.000Z"
      }
    ],
    created_at: "2026-04-30T00:00:00.000Z",
    deleted_at: null,
    display_name: "山田",
    edit_token_hash: "hash",
    event_id: "event-1",
    id: "respondent-1",
    updated_at: "2026-04-30T00:00:00.000Z"
  },
  {
    availabilities: [
      {
        created_at: "2026-04-30T00:00:00.000Z",
        id: "availability-3",
        respondent_id: "respondent-2",
        slot_id: "slot-1",
        status: "available",
        updated_at: "2026-04-30T00:00:00.000Z"
      }
    ],
    created_at: "2026-04-30T00:00:00.000Z",
    deleted_at: null,
    display_name: "佐藤",
    edit_token_hash: "hash",
    event_id: "event-1",
    id: "respondent-2",
    updated_at: "2026-04-30T00:00:00.000Z"
  }
];

describe("summarizeSlots", () => {
  it("counts available answers and sorts by available count", () => {
    const result = summarizeSlots(slots, respondents);

    expect(result).toMatchObject([
      { availableCount: 2, id: "slot-1" },
      { availableCount: 0, id: "slot-2" }
    ]);
  });
});

