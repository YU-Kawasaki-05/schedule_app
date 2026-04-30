import { z } from "zod";

const optionalText = (max: number) =>
  z
    .string()
    .trim()
    .max(max)
    .optional()
    .transform((value) => (value ? value : undefined));

export const eventSlotSchema = z
  .object({
    id: z.string().uuid().optional(),
    startsAt: z.string().datetime(),
    endsAt: z.string().datetime(),
    label: optionalText(80),
    sortOrder: z.number().int().min(0)
  })
  .refine((slot) => new Date(slot.endsAt) > new Date(slot.startsAt), {
    message: "終了日時は開始日時より後にしてください。",
    path: ["endsAt"]
  });

export const eventFormSchema = z.object({
  adminNote: optionalText(2000),
  allowMaybe: z.boolean().default(false),
  description: optionalText(2000),
  responseDeadlineAt: z
    .string()
    .datetime()
    .optional()
    .transform((value) => (value ? value : undefined)),
  slots: z
    .array(eventSlotSchema)
    .min(1, "候補日時を1件以上追加してください。")
    .max(50, "候補日時は50件までです。"),
  title: z
    .string()
    .trim()
    .min(1, "タイトルを入力してください。")
    .max(80, "タイトルは80文字以内で入力してください。"),
  visibility: z.enum(["public_result", "private_result"]).default("private_result")
});

export const responseSchema = z.object({
  availabilities: z.array(
    z.object({
      slotId: z.string().uuid(),
      status: z.enum(["available", "maybe", "unavailable"])
    })
  ),
  displayName: z
    .string()
    .trim()
    .min(1, "名前を入力してください。")
    .max(30, "名前は30文字以内で入力してください。")
});

export type EventFormSchema = z.infer<typeof eventFormSchema>;
export type ResponseSchema = z.infer<typeof responseSchema>;

