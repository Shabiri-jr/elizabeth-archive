import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

type SectionShellProps = {
  children: ReactNode;
  className?: string;
  id?: string;
  narrow?: boolean;
};

export function SectionShell({ children, className, id, narrow = false }: SectionShellProps) {
  return (
    <section id={id} className={cn("relative px-4 py-16 sm:px-6 sm:py-20 lg:px-8 lg:py-28", className)}>
      <div className={cn("mx-auto w-full", narrow ? "max-w-4xl" : "max-w-7xl")}>{children}</div>
    </section>
  );
}
