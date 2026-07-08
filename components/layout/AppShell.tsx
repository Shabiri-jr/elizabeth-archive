import type { ReactNode } from "react";
import { Footer } from "@/components/layout/Footer";
import { Navbar } from "@/components/layout/Navbar";

type AppShellProps = {
  children: ReactNode;
};

export function AppShell({ children }: AppShellProps) {
  return (
    <div className="relative isolate min-h-dvh overflow-hidden text-espresso">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-0 top-0 -z-10 h-[34rem] bg-[linear-gradient(180deg,rgba(216,180,106,0.18),rgba(232,183,183,0.08)_38%,transparent)]"
      />
      <Navbar />
      <main>{children}</main>
      <Footer />
    </div>
  );
}
