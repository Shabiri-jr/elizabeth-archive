import { History } from "lucide-react";
import { StatusBadge } from "@/components/admin/StatusBadge";
import type { Database } from "@/lib/types";

type ActivityLog = Database["public"]["Tables"]["admin_activity_logs"]["Row"];

type ActivityLogListProps = {
  logs: ActivityLog[];
};

function formatDate(value: string) {
  return new Intl.DateTimeFormat("en", {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(new Date(value));
}

function prettyAction(action: string) {
  return action.replaceAll("_", " ");
}

export function ActivityLogList({ logs }: ActivityLogListProps) {
  return (
    <div className="rounded-[1.75rem] bg-warm-black/[0.035] p-1.5 ring-1 ring-espresso/7 shadow-[var(--shadow-beautiful-md)]">
      <div className="rounded-[calc(1.75rem-0.375rem)] border border-porcelain/80 bg-porcelain/76 p-5 sm:p-6">
        <div className="flex items-center gap-3">
          <span className="flex size-10 items-center justify-center rounded-full bg-pale-lilac text-deep-lilac">
            <History aria-hidden="true" className="size-5" strokeWidth={1.35} />
          </span>
          <div>
            <h2 className="font-serif text-2xl font-semibold text-espresso">Recent activity</h2>
            <p className="text-sm leading-6 text-espresso/58">Important admin actions are recorded here.</p>
          </div>
        </div>

        {logs.length ? (
          <div className="mt-6 space-y-3">
            {logs.map((log) => (
              <article
                key={log.id}
                className="rounded-2xl border border-lilac-border/45 bg-pale-lilac/24 px-4 py-3"
              >
                <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                  <StatusBadge status="live" label={prettyAction(log.action)} />
                  <time className="text-xs font-semibold uppercase tracking-[0.14em] text-espresso/45">
                    {formatDate(log.created_at)}
                  </time>
                </div>
                <p className="mt-2 text-sm leading-6 text-espresso/58">
                  {log.target_table ?? "admin"} {log.target_id ? `- ${log.target_id.slice(0, 8)}` : ""}
                </p>
              </article>
            ))}
          </div>
        ) : (
          <div className="mt-6 rounded-2xl border border-dashed border-espresso/14 bg-ivory/42 p-5 text-sm leading-6 text-espresso/58">
            No activity has been recorded yet. Moderation actions will appear here as the archive takes shape.
          </div>
        )}
      </div>
    </div>
  );
}
