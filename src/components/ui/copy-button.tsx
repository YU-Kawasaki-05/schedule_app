"use client";

import { Copy } from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/button";

export function CopyButton({
  text,
  label = "コピー"
}: {
  text: string;
  label?: string;
}) {
  const [copied, setCopied] = useState(false);

  return (
    <Button
      aria-live="polite"
      onClick={async () => {
        await navigator.clipboard.writeText(text);
        setCopied(true);
        window.setTimeout(() => setCopied(false), 1600);
      }}
      type="button"
      variant="secondary"
    >
      <Copy aria-hidden="true" size={16} />
      {copied ? "コピーしました" : label}
    </Button>
  );
}

