import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

type SoftCardProps = {
  children: ReactNode;
  className?: string;
  innerClassName?: string;
};

export function SoftCard({ children, className, innerClassName }: SoftCardProps) {
  return (
    <div
      className={cn(
        "rounded-[2rem] bg-warm-black/[0.035] p-1.5 ring-1 ring-espresso/7 shadow-[0px_0px_0px_1px_rgba(0,0,0,0.06),0px_1px_1px_-0.5px_rgba(0,0,0,0.06),0px_3px_3px_-1.5px_rgba(0,0,0,0.06),_0px_6px_6px_-3px_rgba(0,0,0,0.06),0px_12px_12px_-6px_rgba(0,0,0,0.06),0px_24px_24px_-12px_rgba(0,0,0,0.06)]",
        className,
      )}
    >
      <div
        className={cn(
          "h-full rounded-[calc(2rem-0.375rem)] border border-porcelain/80 bg-porcelain/74 p-5 shadow-[inset_0_1px_1px_rgba(255,255,255,0.7)] sm:p-7",
          innerClassName,
        )}
      >
        {children}
      </div>
    </div>
  );
}
