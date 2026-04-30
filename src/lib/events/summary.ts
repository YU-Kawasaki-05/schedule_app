import type {
  EventDetail,
  EventSlotRow,
  RespondentWithAvailabilities,
  SlotSummary
} from "@/lib/events/types";

export function summarizeSlots(
  slots: EventSlotRow[],
  respondents: RespondentWithAvailabilities[]
): SlotSummary[] {
  return slots
    .map((slot) => {
      const availableCount = respondents.reduce((count, respondent) => {
        const answer = respondent.availabilities.find(
          (availability) => availability.slot_id === slot.id
        );
        return answer?.status === "available" ? count + 1 : count;
      }, 0);

      return {
        ...slot,
        availableCount
      };
    })
    .sort((a, b) => b.availableCount - a.availableCount || a.sort_order - b.sort_order);
}

export function getBestSlot(event: EventDetail) {
  const [bestSlot] = summarizeSlots(event.slots, event.respondents);
  return bestSlot ?? null;
}

