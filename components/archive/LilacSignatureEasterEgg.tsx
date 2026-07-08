"use client";

import { Flower2 } from "lucide-react";
import { useArchiveInteractions } from "@/components/archive/ArchiveInteractionsProvider";

export function LilacSignatureEasterEgg() {
  const { unlockEasterEgg } = useArchiveInteractions();

  return (
    <button
      type="button"
      onClick={() => unlockEasterEgg("lilac-signature", "Elizabeth's signature colour unlocked.")}
      className="fixed bottom-6 right-5 z-30 hidden size-10 items-center justify-center rounded-full border border-lilac-border/70 bg-porcelain/82 text-deep-lilac shadow-[var(--shadow-beautiful-sm)] transition-[background,transform] duration-500 ease-[var(--ease-weighted)] hover:-translate-y-0.5 hover:bg-pale-lilac focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-deep-lilac/45 md:flex"
      aria-label="Unlock Elizabeth's lilac signature"
    >
      <Flower2 aria-hidden="true" className="size-4" strokeWidth={1.35} />
    </button>
  );
}

