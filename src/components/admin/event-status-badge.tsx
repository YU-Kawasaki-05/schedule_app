import { Badge } from "@/components/ui/badge";
import type { EventStatus } from "@/lib/supabase/types";

const labels: Record<EventStatus, string> = {
  archived: "アーカイブ",
  closed: "締切済み",
  open: "募集中"
};

const tones: Record<EventStatus, "neutral" | "success" | "warning"> = {
  archived: "neutral",
  closed: "warning",
  open: "success"
};

export function EventStatusBadge({ status }: { status: EventStatus }) {
  return <Badge tone={tones[status]}>{labels[status]}</Badge>;
}

