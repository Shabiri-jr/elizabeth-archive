import type { LucideIcon } from "lucide-react";

type AdminStatCardProps = {
  title: string;
  value: string;
  description: string;
  icon: LucideIcon;
};

export function AdminStatCard({ title, value, description, icon: Icon }: AdminStatCardProps) {
  return (
    <article className="group rounded-[1.5rem] bg-warm-black/[0.035] p-1.5 ring-1 ring-espresso/7 shadow-[var(--shadow-beautiful-md)] transition-transform duration-500 ease-[var(--ease-weighted)] hover:-translate-y-1">
      <div className="h-full rounded-[calc(1.5rem-0.375rem)] border border-porcelain/80 bg-porcelain/76 p-5">
        <div className="flex items-start justify-between gap-4">
          <span className="flex size-10 items-center justify-center rounded-full bg-lilac-primary/18 text-deep-lilac">
            <Icon aria-hidden="true" className="size-5" strokeWidth={1.35} />
          </span>
          <span className="rounded-full bg-pale-lilac px-3 py-1 text-xs font-bold uppercase tracking-[0.14em] text-deep-lilac">
            Live
          </span>
        </div>
        <p className="mt-7 text-sm font-bold uppercase tracking-[0.18em] text-espresso/48">{title}</p>
        <p className="mt-2 font-serif text-4xl font-semibold leading-none text-espresso">{value}</p>
        <p className="mt-4 text-sm leading-6 text-espresso/58">{description}</p>
      </div>
    </article>
  );
}
