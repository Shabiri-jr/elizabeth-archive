"use client";

import { Play } from "lucide-react";
import { useArchiveInteractions } from "@/components/archive/ArchiveInteractionsProvider";

export function ReplayTrailerButton() {
  const { replayTrailer } = useArchiveInteractions();

  return (
    <button
      type="button"
      onClick={replayTrailer}
      className="inline-flex min-h-11 items-center gap-2 rounded-full border border-lilac-border/70 bg-porcelain/78 px-4 py-2 text-sm font-bold text-deep-lilac shadow-[var(--shadow-beautiful-sm)] transition-[background,transform] duration-500 ease-[var(--ease-weighted)] hover:-translate-y-0.5 hover:bg-pale-lilac focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-deep-lilac/45"
    >
      <Play aria-hidden="true" className="size-4" strokeWidth={1.35} />
      Replay opening
    </button>
  );
}

