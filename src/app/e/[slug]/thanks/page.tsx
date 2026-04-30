import { CheckCircle2 } from "lucide-react";
import { ThanksActions } from "@/components/public/thanks-actions";
import { Panel } from "@/components/ui/panel";

export default async function PublicThanksPage({
  params
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;

  return (
    <main className="mx-auto flex min-h-screen w-full max-w-2xl items-center px-4 py-6">
      <Panel className="w-full space-y-5">
        <div className="space-y-3">
          <div className="inline-flex h-12 w-12 items-center justify-center rounded-md bg-success text-white">
            <CheckCircle2 aria-hidden="true" size={26} />
          </div>
          <div>
            <h1 className="text-3xl font-bold text-text">回答しました</h1>
            <p className="mt-2 text-text-muted">
              この端末では、同じURLから後で回答を修正できます。
            </p>
          </div>
        </div>
        <ThanksActions slug={slug} />
      </Panel>
    </main>
  );
}

