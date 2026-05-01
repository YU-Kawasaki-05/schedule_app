"use client";

import { useActionState, useMemo, useState } from "react";
import { ArrowDown, ArrowUp, Plus, Trash2 } from "lucide-react";
import type { ActionState } from "@/lib/actions/state";
import { initialActionState } from "@/lib/actions/state";
import { formatSlot, toDatetimeLocalValue } from "@/lib/events/format";
import type { EventSlotRow, EventWithSlots } from "@/lib/events/types";
import { Button } from "@/components/ui/button";
import { Field, Input, Select, Textarea } from "@/components/ui/input";
import { Panel } from "@/components/ui/panel";

type SlotDraft = {
  id?: string;
  startsAt: string;
  endsAt: string;
  label?: string;
};

function slotFromRow(slot: EventSlotRow): SlotDraft {
  return {
    endsAt: slot.ends_at,
    id: slot.id,
    label: slot.label ?? undefined,
    startsAt: slot.starts_at
  };
}

function defaultStartDate() {
  const date = new Date();
  date.setDate(date.getDate() + 1);
  return date.toISOString().slice(0, 10);
}

function toIso(date: string, time: string) {
  return new Date(`${date}T${time}`).toISOString();
}

export function EventForm({
  action,
  event,
  submitLabel
}: {
  action: (prevState: ActionState, formData: FormData) => Promise<ActionState>;
  event?: EventWithSlots;
  submitLabel: string;
}) {
  const [state, formAction, pending] = useActionState(
    action,
    initialActionState
  );
  const [slots, setSlots] = useState<SlotDraft[]>(
    event?.slots.map(slotFromRow) ?? []
  );
  const [title, setTitle] = useState(event?.title ?? "");
  const [description, setDescription] = useState(event?.description ?? "");
  const [responseDeadlineAt, setResponseDeadlineAt] = useState(
    toDatetimeLocalValue(event?.response_deadline_at)
  );
  const [visibility, setVisibility] = useState(
    event?.visibility ?? "private_result"
  );
  const [adminNote, setAdminNote] = useState(event?.admin_note ?? "");
  const [slotDate, setSlotDate] = useState(defaultStartDate());
  const [startTime, setStartTime] = useState("19:00");
  const [endTime, setEndTime] = useState("21:00");
  const [slotError, setSlotError] = useState<string | null>(null);

  const pendingSlot = useMemo(() => {
    if (!slotDate || !startTime || !endTime) {
      return null;
    }

    const startsAt = toIso(slotDate, startTime);
    const endsAt = toIso(slotDate, endTime);

    if (new Date(endsAt) <= new Date(startsAt)) {
      return null;
    }

    return { endsAt, startsAt } satisfies SlotDraft;
  }, [endTime, slotDate, startTime]);

  const slotsJson = useMemo(
    () => {
      const effectiveSlots: SlotDraft[] =
        slots.length > 0 ? slots : pendingSlot ? [pendingSlot] : [];

      return JSON.stringify(
        effectiveSlots.map((slot, index) => ({
          endsAt: slot.endsAt,
          id: slot.id,
          label: slot.label,
          sortOrder: index,
          startsAt: slot.startsAt
        }))
      );
    },
    [pendingSlot, slots]
  );

  function addSlot() {
    if (!pendingSlot) {
      setSlotError("終了時間は開始時間より後にしてください。");
      return;
    }

    setSlotError(null);
    setSlots((current) => [
      ...current,
      {
        endsAt: pendingSlot.endsAt,
        startsAt: pendingSlot.startsAt
      }
    ]);
  }

  function moveSlot(index: number, direction: -1 | 1) {
    setSlots((current) => {
      const next = [...current];
      const target = index + direction;

      if (target < 0 || target >= next.length) {
        return current;
      }

      [next[index], next[target]] = [next[target], next[index]];
      return next;
    });
  }

  return (
    <form action={formAction} className="space-y-6">
      {event ? <input name="eventId" type="hidden" value={event.id} /> : null}
      <input name="slotsJson" type="hidden" value={slotsJson} />

      <Panel className="space-y-5">
        <Field htmlFor="title" label="タイトル">
          <Input
            id="title"
            maxLength={80}
            name="title"
            onChange={(event) => setTitle(event.target.value)}
            required
            value={title}
          />
        </Field>
        <Field htmlFor="description" label="詳細">
          <Textarea
            id="description"
            maxLength={2000}
            name="description"
            onChange={(event) => setDescription(event.target.value)}
            value={description}
          />
        </Field>
        <div className="grid gap-4 sm:grid-cols-2">
          <Field htmlFor="responseDeadlineAt" label="締切日時">
            <Input
              id="responseDeadlineAt"
              name="responseDeadlineAt"
              onChange={(event) => setResponseDeadlineAt(event.target.value)}
              type="datetime-local"
              value={responseDeadlineAt}
            />
          </Field>
          <Field htmlFor="visibility" label="回答結果の公開">
            <Select
              id="visibility"
              name="visibility"
              onChange={(event) =>
                setVisibility(event.target.value as typeof visibility)
              }
              value={visibility}
            >
              <option value="private_result">非公開</option>
              <option value="public_result">公開</option>
            </Select>
          </Field>
        </div>
        <Field htmlFor="adminNote" label="管理者メモ">
          <Textarea
            id="adminNote"
            maxLength={2000}
            name="adminNote"
            onChange={(event) => setAdminNote(event.target.value)}
            value={adminNote}
          />
        </Field>
      </Panel>

      <Panel className="space-y-5">
        <div>
          <h2 className="text-xl font-semibold text-text">候補日時</h2>
          <p className="text-sm text-text-muted">
            日付と開始・終了時間を選んで候補に追加します。
          </p>
        </div>
        <div className="grid gap-4 sm:grid-cols-[1.3fr_1fr_1fr_auto] sm:items-end">
          <Field htmlFor="slotDate" label="日付">
            <Input
              id="slotDate"
              onChange={(event) => setSlotDate(event.target.value)}
              type="date"
              value={slotDate}
            />
          </Field>
          <Field htmlFor="startTime" label="開始">
            <Input
              id="startTime"
              onChange={(event) => setStartTime(event.target.value)}
              type="time"
              value={startTime}
            />
          </Field>
          <Field htmlFor="endTime" label="終了">
            <Input
              id="endTime"
              onChange={(event) => setEndTime(event.target.value)}
              type="time"
              value={endTime}
            />
          </Field>
          <Button onClick={addSlot} type="button" variant="secondary">
            <Plus aria-hidden="true" size={16} />
            追加
          </Button>
        </div>
        {slotError ? (
          <p className="text-sm font-medium text-danger">{slotError}</p>
        ) : null}

        <div className="space-y-3">
          {slots.length === 0 ? (
            <p className="rounded-sm border border-border bg-surface-muted px-3 py-4 text-sm text-text-muted">
              現在入力中の日時を候補として保存します。複数候補は追加してください。
            </p>
          ) : (
            slots.map((slot, index) => (
              <div
                className="flex flex-col gap-3 rounded-sm border border-border bg-surface px-3 py-3 sm:flex-row sm:items-center sm:justify-between"
                key={`${slot.id ?? "new"}-${slot.startsAt}-${index}`}
              >
                <div>
                  <p className="font-semibold text-text">
                    {formatSlot(slot.startsAt, slot.endsAt)}
                  </p>
                  <p className="text-sm text-text-muted">候補 {index + 1}</p>
                </div>
                <div className="flex flex-wrap gap-2">
                  <Button
                    aria-label="上へ移動"
                    disabled={index === 0}
                    onClick={() => moveSlot(index, -1)}
                    type="button"
                    variant="secondary"
                  >
                    <ArrowUp aria-hidden="true" size={16} />
                  </Button>
                  <Button
                    aria-label="下へ移動"
                    disabled={index === slots.length - 1}
                    onClick={() => moveSlot(index, 1)}
                    type="button"
                    variant="secondary"
                  >
                    <ArrowDown aria-hidden="true" size={16} />
                  </Button>
                  <Button
                    onClick={() =>
                      setSlots((current) =>
                        current.filter((_, slotIndex) => slotIndex !== index)
                      )
                    }
                    type="button"
                    variant="danger"
                  >
                    <Trash2 aria-hidden="true" size={16} />
                    削除
                  </Button>
                </div>
              </div>
            ))
          )}
        </div>
      </Panel>

      {state.error ? (
        <p className="rounded-sm border border-danger/20 bg-danger/10 px-3 py-2 text-sm font-medium text-danger">
          {state.error}
        </p>
      ) : null}

      <div className="flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
        <Button disabled={pending} type="submit">
          {pending ? "保存中" : submitLabel}
        </Button>
      </div>
    </form>
  );
}
