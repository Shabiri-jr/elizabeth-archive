import type { LucideIcon } from "lucide-react";

type DashboardCardProps = {
  title: string;
  description: string;
  metric: string;
  table: string;
  schema: readonly string[];
  nextStep: string;
  icon: LucideIcon;
};

export function DashboardCard({
  title,
  description,
  metric,
  table,
  schema,
  nextStep,
  icon: Icon,
}: DashboardCardProps) {
  return (
    <article className="group rounded-[1.75rem] bg-warm-black/[0.035] p-1.5 ring-1 ring-espresso/7 shadow-[0px_0px_0px_1px_rgba(0,0,0,0.06),0px_1px_1px_-0.5px_rgba(0,0,0,0.06),0px_3px_3px_-1.5px_rgba(0,0,0,0.06),_0px_6px_6px_-3px_rgba(0,0,0,0.06),0px_12px_12px_-6px_rgba(0,0,0,0.06),0px_24px_24px_-12px_rgba(0,0,0,0.06)] transition-transform duration-700 ease-[var(--ease-weighted)] hover:-translate-y-1">
      <div className="h-full rounded-[calc(1.75rem-0.375rem)] border border-porcelain/80 bg-porcelain/74 p-6">
        <div className="flex items-start justify-between gap-4">
          <span className="flex size-11 items-center justify-center rounded-full bg-lilac-primary/18 text-deep-lilac">
            <Icon aria-hidden="true" className="size-5" strokeWidth={1.25} />
          </span>
          <span className="rounded-full bg-pale-lilac px-3 py-1 text-xs font-bold uppercase tracking-[0.16em] text-deep-lilac">
            {metric}
          </span>
        </div>
        <h2 className="mt-7 font-serif text-3xl font-semibold leading-none text-espresso">{title}</h2>
        <p className="mt-4 text-sm leading-7 text-espresso/62">{description}</p>
        <div className="mt-7 rounded-2xl border border-lilac-border/55 bg-pale-lilac/36 p-4">
          <p className="text-[0.68rem] font-bold uppercase tracking-[0.2em] text-deep-lilac/72">
            Supabase table
          </p>
          <p className="mt-2 font-mono text-sm text-espresso">{table}</p>
          <div className="mt-3 flex flex-wrap gap-2">
            {schema.map((field) => (
              <span
                key={field}
                className="rounded-full border border-lilac-border/65 bg-porcelain/72 px-2.5 py-1 text-xs font-semibold text-espresso/64"
              >
                {field}
              </span>
            ))}
          </div>
        </div>
        <div className="mt-7 h-px w-full bg-gradient-to-r from-lilac-primary/60 via-espresso/8 to-transparent" />
        <p className="mt-4 text-sm leading-6 text-espresso/56">{nextStep}</p>
      </div>
    </article>
  );
}
