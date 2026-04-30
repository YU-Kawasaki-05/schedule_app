import { LockKeyhole } from "lucide-react";
import { Panel } from "@/components/ui/panel";
import { getSupabaseConfigStatus } from "@/lib/env";

export function SetupNotice() {
  const config = getSupabaseConfigStatus();

  if (config.ready) {
    return null;
  }

  return (
    <Panel>
      <div className="space-y-3">
        <div className="flex items-center gap-2 text-sm font-semibold text-warning">
          <LockKeyhole aria-hidden="true" size={18} />
          Supabase設定が必要です
        </div>
        <p className="text-sm text-text-muted">
          `.env.local` に次の環境変数を設定すると、この画面の操作が有効になります。
        </p>
        <ul className="list-inside list-disc text-sm text-text-muted">
          {config.missing.map((key) => (
            <li key={key}>{key}</li>
          ))}
        </ul>
      </div>
    </Panel>
  );
}

