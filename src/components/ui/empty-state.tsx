import { Panel } from "@/components/ui/panel";

export function EmptyState({
  title,
  description,
  action
}: {
  title: string;
  description: string;
  action?: React.ReactNode;
}) {
  return (
    <Panel className="text-center">
      <div className="mx-auto max-w-md space-y-3">
        <h2 className="text-xl font-semibold text-text">{title}</h2>
        <p className="text-sm text-text-muted">{description}</p>
        {action ? <div className="pt-2">{action}</div> : null}
      </div>
    </Panel>
  );
}

