"use client";

import { Printer } from "lucide-react";

export function PrintButton() {
  return (
    <button
      type="button"
      onClick={() => window.print()}
      className="inline-flex min-h-12 items-center gap-3 rounded-full bg-deep-lilac px-5 text-sm font-bold text-ivory shadow-[var(--shadow-beautiful-sm)] transition-[background,transform] duration-500 ease-[var(--ease-weighted)] hover:-translate-y-0.5 hover:bg-[#6c5392] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-deep-lilac/45"
    >
      <Printer aria-hidden="true" className="size-4" strokeWidth={1.4} />
      Print Keepsake
    </button>
  );
}

