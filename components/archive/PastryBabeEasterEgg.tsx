"use client";

import { CakeSlice } from "lucide-react";
import { useArchiveInteractions } from "@/components/archive/ArchiveInteractionsProvider";

export function PastryBabeEasterEgg() {
  const { unlockEasterEgg } = useArchiveInteractions();

  return (
    <div className="flex justify-center px-4 py-8">
      <button
        type="button"
        onClick={() => unlockEasterEgg("pastry-babe", "Certified pastry babe detected 😂")}
        className="flex size-12 items-center justify-center rounded-full border border-lilac-border/70 bg-porcelain/78 text-deep-lilac shadow-[var(--shadow-beautiful-sm)] transition-[transform,background] duration-500 ease-[var(--ease-weighted)] hover:-translate-y-0.5 hover:bg-pale-lilac focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-deep-lilac/45"
        aria-label="A tiny pastry surprise"
      >
        <CakeSlice aria-hidden="true" className="size-5" strokeWidth={1.35} />
      </button>
    </div>
  );
}

