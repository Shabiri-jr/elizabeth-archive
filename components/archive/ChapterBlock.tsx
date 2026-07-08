import type { LucideIcon } from "lucide-react";
import { PolaroidCard } from "@/components/ui/PolaroidCard";
import { cn } from "@/lib/utils";

type ChapterAccent = "gold" | "blush" | "lilac" | "espresso";

type ChapterBlockProps = {
  label: string;
  title: string;
  kicker: string;
  body: string;
  quote: string;
  accent: ChapterAccent;
  icon: LucideIcon;
  index: number;
};

const accentClasses: Record<ChapterAccent, string> = {
  gold: "border-champagne/35 bg-[linear-gradient(135deg,rgba(255,250,243,0.82),rgba(216,180,106,0.14))]",
  blush: "border-blush/45 bg-[linear-gradient(135deg,rgba(255,250,243,0.82),rgba(232,183,183,0.18))]",
  lilac: "border-lilac-border/70 bg-[linear-gradient(135deg,rgba(255,250,243,0.86),rgba(191,162,219,0.16))]",
  espresso: "border-espresso/18 bg-[linear-gradient(135deg,rgba(255,250,243,0.82),rgba(36,26,23,0.09))]",
};

const dotClasses: Record<ChapterAccent, string> = {
  gold: "bg-champagne",
  blush: "bg-blush",
  lilac: "bg-deep-lilac",
  espresso: "bg-espresso",
};

export function ChapterBlock({
  label,
  title,
  kicker,
  body,
  quote,
  accent,
  icon: Icon,
  index,
}: ChapterBlockProps) {
  const reverse = index % 2 === 1;

  return (
    <article
      data-story-section
      className={cn(
        "relative overflow-hidden rounded-[2rem] border p-1.5 shadow-[0px_0px_0px_1px_rgba(0,0,0,0.06),0px_1px_1px_-0.5px_rgba(0,0,0,0.06),0px_3px_3px_-1.5px_rgba(0,0,0,0.06),_0px_6px_6px_-3px_rgba(0,0,0,0.06),0px_12px_12px_-6px_rgba(0,0,0,0.06),0px_24px_24px_-12px_rgba(0,0,0,0.06)]",
        accentClasses[accent],
      )}
    >
      <div className="rounded-[calc(2rem-0.375rem)] border border-porcelain/76 bg-ivory/62 p-5 sm:p-8 lg:p-10">
        <div className={cn("grid gap-8 lg:grid-cols-[1.08fr_0.92fr] lg:items-center", reverse && "lg:grid-cols-[0.92fr_1.08fr]")}>
          <div className={cn("motion-reveal", reverse && "lg:order-2")}>
            <div className="chapter-label-reveal mb-6 flex items-center gap-3">
              <span className={cn("size-2 rounded-full", dotClasses[accent])} aria-hidden="true" />
              <span className="text-xs font-bold uppercase tracking-[0.24em] text-espresso/54">
                {label}
              </span>
            </div>
            <p className="text-sm font-bold uppercase tracking-[0.22em] text-deep-lilac/80">{kicker}</p>
            <h2 className="mt-4 max-w-2xl font-serif text-4xl font-semibold leading-none text-espresso sm:text-5xl">
              {title}
            </h2>
            <p className="mt-6 max-w-xl text-base leading-8 text-espresso/66">{body}</p>
            <blockquote className="mt-8 border-l border-champagne/70 pl-5 font-serif text-2xl leading-tight text-espresso/86">
              {quote}
            </blockquote>
          </div>

          <div className={cn("relative", reverse && "lg:order-1")}>
            <div className="absolute left-1/2 top-1/2 h-48 w-48 -translate-x-1/2 -translate-y-1/2 rounded-full border border-champagne/20" aria-hidden="true" />
            <PolaroidCard
              title={title}
              tone={accent === "espresso" ? "espresso" : accent}
              caption="Curated placeholder for approved content."
              className={cn("relative mx-auto max-w-sm", reverse ? "lg:-rotate-2" : "lg:rotate-2")}
            >
              <div className="flex h-full w-full flex-col items-center justify-center gap-5 px-6 text-center">
                <span className="flex size-14 items-center justify-center rounded-full bg-porcelain/82 text-espresso shadow-[0px_2px_3px_-1px_rgba(0,0,0,0.1),0px_1px_0px_0px_rgba(25,28,33,0.02),0px_0px_0px_1px_rgba(25,28,33,0.08)]">
                  <Icon aria-hidden="true" className="size-6" strokeWidth={1.25} />
                </span>
                <div>
                  <p className="font-serif text-3xl leading-none text-espresso">{label}</p>
                  <p className="mt-3 text-sm uppercase tracking-[0.18em] text-espresso/48">
                    Story frame
                  </p>
                </div>
              </div>
            </PolaroidCard>
          </div>
        </div>
      </div>
    </article>
  );
}
