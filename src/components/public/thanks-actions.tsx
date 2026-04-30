"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { CopyButton } from "@/components/ui/copy-button";
import { ButtonLink } from "@/components/ui/button";
import { getStoredResponseKey } from "@/components/public/public-response-form";

export function ThanksActions({ slug }: { slug: string }) {
  const [editUrl, setEditUrl] = useState<string | null>(null);

  useEffect(() => {
    try {
      const stored = window.localStorage.getItem(getStoredResponseKey(slug));

      if (!stored) {
        return;
      }

      const parsed = JSON.parse(stored) as {
        respondentId?: string;
        token?: string;
      };

      if (parsed.respondentId && parsed.token) {
        setEditUrl(
          `${window.location.origin}/e/${slug}/edit?respondentId=${parsed.respondentId}&token=${parsed.token}`
        );
      }
    } catch {
      setEditUrl(null);
    }
  }, [slug]);

  return (
    <div className="flex flex-col gap-3 sm:flex-row">
      <ButtonLink href={`/e/${slug}/edit`} variant="primary">
        回答を修正する
      </ButtonLink>
      <Link
        className="inline-flex min-h-11 items-center justify-center rounded-md border border-border bg-surface px-4 py-2 text-sm font-semibold text-text shadow-card transition hover:bg-surface-muted"
        href={`/e/${slug}`}
      >
        イベントページに戻る
      </Link>
      {editUrl ? <CopyButton label="編集用リンク" text={editUrl} /> : null}
    </div>
  );
}

