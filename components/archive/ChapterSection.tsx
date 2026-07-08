import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

type ChapterSectionProps = {
  id: string;
  label: string;
  title: string;
  subtitle?: string | null;
  body?: string | null;
  children: ReactNode;
  className?: string;
};

export function ChapterSection({ id, label, title, subtitle, body, children, className }: ChapterSectionProps) {
  return (
    <section
      id={id}
      data-archive-section
      className={cn("archive-reveal scroll-mt-32 px-4 py-20 sm:px-6 lg:px-8 lg:py-28", className)}
    >
      <div className="mx-auto max-w-7xl">
        <div data-chapter-header className="mb-10 grid gap-6 lg:grid-cols-[0.9fr_1.1fr] lg:items-end">
          <div>
            <p
              data-chapter-label
              className="inline-flex rounded-full border border-lilac-border/70 bg-pale-lilac/70 px-3 py-1 text-[0.68rem] font-bold uppercase tracking-[0.22em] text-deep-lilac"
            >
              {label}
            </p>
            <h2 className="mt-5 max-w-3xl font-serif text-4xl font-semibold leading-none text-espresso sm:text-5xl lg:text-6xl">
              {title}
            </h2>
          </div>
          <div className="max-w-2xl lg:justify-self-end">
            {subtitle ? (
              <p className="text-sm font-bold uppercase tracking-[0.2em] text-espresso/42">{subtitle}</p>
            ) : null}
            {body ? <p className="mt-4 text-base leading-8 text-espresso/64">{body}</p> : null}
          </div>
        </div>
        {children}
      </div>
    </section>
  );
}
