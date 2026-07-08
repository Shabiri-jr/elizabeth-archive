import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

type PolaroidCardProps = {
  title: string;
  caption?: string;
  className?: string;
  children?: ReactNode;
  tone?: "gold" | "blush" | "lilac" | "blue" | "espresso";
};

const toneClasses: Record<NonNullable<PolaroidCardProps["tone"]>, string> = {
  gold: "from-champagne/26 to-porcelain",
  blush: "from-blush/30 to-porcelain",
  lilac: "from-lilac-primary/26 to-porcelain",
  blue: "from-royal-blue/7 to-porcelain",
  espresso: "from-espresso/12 to-porcelain",
};

export function PolaroidCard({
  title,
  caption,
  className,
  children,
  tone = "gold",
}: PolaroidCardProps) {
  return (
    <figure
      className={cn(
        "group rounded-[1.65rem] bg-porcelain p-3 shadow-[0px_0px_0px_1px_rgba(0,0,0,0.06),0px_1px_1px_-0.5px_rgba(0,0,0,0.06),0px_3px_3px_-1.5px_rgba(0,0,0,0.06),_0px_6px_6px_-3px_rgba(0,0,0,0.06),0px_12px_12px_-6px_rgba(0,0,0,0.06),0px_24px_24px_-12px_rgba(0,0,0,0.06)] transition-[transform] duration-700 ease-[var(--ease-weighted)] hover:-translate-y-1",
        className,
      )}
    >
      <div
        className={cn(
          "flex aspect-[4/5] items-center justify-center rounded-[1.2rem] border border-espresso/8 bg-gradient-to-br",
          toneClasses[tone],
        )}
      >
        {children ?? (
          <div className="mx-auto max-w-[12rem] px-4 text-center">
            <p className="font-serif text-2xl leading-none text-espresso">{title}</p>
            <div className="mx-auto mt-4 h-px w-12 bg-champagne/70" />
          </div>
        )}
      </div>
      {caption ? (
        <figcaption className="px-2 pb-1 pt-3 text-sm leading-6 text-espresso/68">{caption}</figcaption>
      ) : null}
    </figure>
  );
}
