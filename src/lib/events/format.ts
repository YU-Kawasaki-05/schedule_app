const dateTimeFormatter = new Intl.DateTimeFormat("ja-JP", {
  dateStyle: "medium",
  timeStyle: "short",
  timeZone: "Asia/Tokyo"
});

const dateFormatter = new Intl.DateTimeFormat("ja-JP", {
  day: "numeric",
  month: "numeric",
  timeZone: "Asia/Tokyo",
  weekday: "short"
});

const timeFormatter = new Intl.DateTimeFormat("ja-JP", {
  hour: "2-digit",
  minute: "2-digit",
  timeZone: "Asia/Tokyo"
});

export function formatDateTime(value: string | null) {
  if (!value) {
    return "未設定";
  }

  return dateTimeFormatter.format(new Date(value));
}

export function formatSlot(startsAt: string, endsAt: string) {
  const start = new Date(startsAt);
  const end = new Date(endsAt);

  return `${dateFormatter.format(start)} ${timeFormatter.format(start)}-${timeFormatter.format(end)}`;
}

export function toDatetimeLocalValue(value: string | null | undefined) {
  if (!value) {
    return "";
  }

  const date = new Date(value);
  const offset = date.getTimezoneOffset();
  const local = new Date(date.getTime() - offset * 60_000);
  return local.toISOString().slice(0, 16);
}

export function datetimeLocalToIso(value: FormDataEntryValue | null) {
  if (!value || typeof value !== "string") {
    return undefined;
  }

  return value ? new Date(value).toISOString() : undefined;
}

