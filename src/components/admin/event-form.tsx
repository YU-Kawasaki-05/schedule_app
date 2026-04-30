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
  const [slotDate, setSlotDate] = useState(defaultStartDate());
  const [startTime, setStartTime] = useState("19:00");
  const [endTime, setEndTime] = useState("21:00");

  const slotsJson = useMemo(
    () =>
      JSON.stringify(
        slots.map((slot, index) => ({
          endsAt: slot.endsAt,
          id: slot.id,
          label: slot.label,
          sortOrder: index,
          startsAt: slot.startsAt
        }))
      ),
    [slots]
  );

  function addSlot() {
    const startsAt = toIso(slotDate, startTime);
    const endsAt = toIso(slotDate, endTime);

    if (new Date(endsAt) <= new Date(startsAt)) {
      return;
    }

    setSlots((current) => [
      ...current,
      {
        endsAt,
        startsAt
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
            defaultValue={event?.title ?? ""}
            id="title"
            maxLength={80}
            name="title"
            required
          />
        </Field>
        <Field htmlFor="description" label="詳細">
          <Textarea
            defaultValue={event?.description ?? ""}
            id="description"
            maxLength={2000}
            name="description"
          />
        </Field>
        <div className="grid gap-4 sm:grid-cols-2">
          <Field htmlFor="responseDeadlineAt" label="締切日時">
            <Input
              defaultValue={toDatetimeLocalValue(event?.response_deadline_at)}
              id="responseDeadlineAt"
              name="responseDeadlineAt"
              type="datetime-local"
            />
          </Field>
          <Field htmlFor="visibility" label="回答結果の公開">
            <Select
              defaultValue={event?.visibility ?? "private_result"}
              id="visibility"
              name="visibility"
            >
              <option value="private_result">非公開</option>
              <option value="public_result">公開</option>
            </Select>
          </Field>
        </div>
        <Field htmlFor="adminNote" label="管理者メモ">
          <Textarea
            defaultValue={event?.admin_note ?? ""}
            id="adminNote"
            maxLength={2000}
            name="adminNote"
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

        <div className="space-y-3">
          {slots.length === 0 ? (
            <p className="rounded-sm border border-border bg-surface-muted px-3 py-4 text-sm text-text-muted">
              候補日時を1件以上追加してください。
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

