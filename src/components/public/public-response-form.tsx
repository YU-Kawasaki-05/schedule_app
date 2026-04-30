"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { Check, RefreshCw, Send, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Field, Input } from "@/components/ui/input";
import { Panel } from "@/components/ui/panel";
import { formatSlot } from "@/lib/events/format";
import type { EventWithSlots } from "@/lib/events/types";
import type { AvailabilityStatus } from "@/lib/supabase/types";

type StoredResponse = {
  respondentId: string;
  token: string;
};

function storageKey(slug: string) {
  return `schedule-app:response:${slug}`;
}

function readStoredResponse(slug: string): StoredResponse | null {
  try {
    const value = window.localStorage.getItem(storageKey(slug));
    return value ? (JSON.parse(value) as StoredResponse) : null;
  } catch {
    return null;
  }
}

function writeStoredResponse(slug: string, value: StoredResponse) {
  window.localStorage.setItem(storageKey(slug), JSON.stringify(value));
}

export function PublicResponseForm({
  event,
  initialRespondentId,
  initialToken,
  mode = "answer"
}: {
  event: EventWithSlots;
  initialRespondentId?: string;
  initialToken?: string;
  mode?: "answer" | "edit";
}) {
  const router = useRouter();
  const [displayName, setDisplayName] = useState("");
  const [statuses, setStatuses] = useState<Record<string, AvailabilityStatus>>(
    () =>
      Object.fromEntries(
        event.slots.map((slot) => [slot.id, "unavailable" as AvailabilityStatus])
      )
  );
  const [stored, setStored] = useState<StoredResponse | null>(
    initialRespondentId && initialToken
      ? { respondentId: initialRespondentId, token: initialToken }
      : null
  );
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const selectedCount = useMemo(
    () =>
      Object.values(statuses).filter((status) => status === "available").length,
    [statuses]
  );

  useEffect(() => {
    const response = stored ?? readStoredResponse(event.public_slug);

    if (!response) {
      return;
    }

    setStored(response);

    fetch(
      `/api/public/events/${event.public_slug}/my-response?respondentId=${response.respondentId}&token=${response.token}`
    )
      .then(async (res) => {
        if (!res.ok) {
          throw new Error("保存済みの回答を読み込めませんでした。");
        }
        return res.json() as Promise<{
          availabilities: Array<{ slot_id: string; status: AvailabilityStatus }>;
          displayName: string;
        }>;
      })
      .then((data) => {
        setDisplayName(data.displayName);
        setStatuses((current) => ({
          ...current,
          ...Object.fromEntries(
            data.availabilities.map((availability) => [
              availability.slot_id,
              availability.status
            ])
          )
        }));
        setMessage("前回の回答を表示しています。変更したら回答を更新してください。");
      })
      .catch(() => {
        if (mode === "edit") {
          setError("この回答を編集する権限がありません。");
        }
      });
  }, [event.public_slug, mode, stored]);

  function toggleSlot(slotId: string) {
    setStatuses((current) => ({
      ...current,
      [slotId]: current[slotId] === "available" ? "unavailable" : "available"
    }));
  }

  async function submitResponse() {
    setError(null);
    setMessage(null);

    if (!displayName.trim()) {
      setError("名前を入力してください。");
      return;
    }

    setSubmitting(true);

    const payload = {
      availabilities: event.slots.map((slot) => ({
        slotId: slot.id,
        status: statuses[slot.id] ?? "unavailable"
      })),
      displayName: displayName.trim(),
      token: stored?.token
    };

    const url = stored
      ? `/api/public/events/${event.public_slug}/responses/${stored.respondentId}`
      : `/api/public/events/${event.public_slug}/responses`;
    const method = stored ? "PATCH" : "POST";

    try {
      const res = await fetch(url, {
        body: JSON.stringify(payload),
        headers: {
          "Content-Type": "application/json"
        },
        method
      });
      const data = (await res.json()) as {
        error?: string;
        respondentId?: string;
        token?: string;
      };

      if (!res.ok || data.error) {
        setError(data.error ?? "送信に失敗しました。");
        return;
      }

      const nextStored = {
        respondentId: data.respondentId ?? stored?.respondentId ?? "",
        token: data.token ?? stored?.token ?? ""
      };

      writeStoredResponse(event.public_slug, nextStored);
      setStored(nextStored);
      router.push(`/e/${event.public_slug}/thanks`);
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="space-y-5">
      {message ? (
        <p className="rounded-sm border border-info/20 bg-info/10 px-3 py-2 text-sm font-medium text-info">
          {message}
        </p>
      ) : null}
      <Panel className="space-y-5">
        <Field htmlFor="displayName" label="あなたの名前">
          <Input
            id="displayName"
            maxLength={30}
            onChange={(event) => setDisplayName(event.target.value)}
            placeholder="山田太郎"
            value={displayName}
          />
        </Field>
      </Panel>

      <div className="space-y-3">
        <div className="flex items-center justify-between gap-3">
          <h2 className="text-xl font-semibold text-text">候補日時</h2>
          <p className="text-sm font-medium text-text-muted">
            {event.slots.length}件中 {selectedCount}件選択中
          </p>
        </div>
        {event.slots.map((slot) => {
          const available = statuses[slot.id] === "available";

          return (
            <button
              className={
                available
                  ? "flex w-full items-center gap-4 rounded-md border border-success bg-success/10 px-4 py-4 text-left shadow-card transition"
                  : "flex w-full items-center gap-4 rounded-md border border-border bg-surface px-4 py-4 text-left shadow-card transition hover:bg-surface-muted"
              }
              key={slot.id}
              onClick={() => toggleSlot(slot.id)}
              type="button"
            >
              <span
                className={
                  available
                    ? "inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-pill bg-success text-white"
                    : "inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-pill bg-surface-muted text-text-muted"
                }
              >
                {available ? (
                  <Check aria-hidden="true" size={20} />
                ) : (
                  <X aria-hidden="true" size={20} />
                )}
              </span>
              <span>
                <span className="block font-semibold text-text">
                  {formatSlot(slot.starts_at, slot.ends_at)}
                </span>
                <span className="block text-sm text-text-muted">
                  {available ? "○ 行ける" : "× 行けない"}
                </span>
              </span>
            </button>
          );
        })}
      </div>

      {error ? (
        <p className="rounded-sm border border-danger/20 bg-danger/10 px-3 py-2 text-sm font-medium text-danger">
          {error}
        </p>
      ) : null}

      <div className="sticky bottom-0 -mx-4 border-t border-border bg-bg/95 px-4 py-3 backdrop-blur sm:static sm:mx-0 sm:border-0 sm:bg-transparent sm:px-0 sm:py-0 sm:backdrop-blur-0">
        <Button
          className="w-full"
          disabled={submitting}
          onClick={submitResponse}
          type="button"
        >
          {stored ? (
            <RefreshCw aria-hidden="true" size={16} />
          ) : (
            <Send aria-hidden="true" size={16} />
          )}
          {submitting
            ? "送信中"
            : stored
              ? `${selectedCount}件選択して回答を更新する`
              : `${selectedCount}件選択して回答する`}
        </Button>
      </div>
    </div>
  );
}

export function getStoredResponseKey(slug: string) {
  return storageKey(slug);
}

