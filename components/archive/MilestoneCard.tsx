"use client";

import { GraduationCap } from "lucide-react";
import { useArchiveInteractions } from "@/components/archive/ArchiveInteractionsProvider";

export function MilestoneCard() {
  const { unlockEasterEgg } = useArchiveInteractions();

  return (
    <article
      data-archive-card
      onClick={() => unlockEasterEgg("graduation-era", "External defense survived. Graduate era activated.")}
      className="rounded-[2rem] bg-warm-black/[0.035] p-1.5 ring-1 ring-espresso/7 shadow-[var(--shadow-beautiful-lg)]"
    >
      <div className="relative overflow-hidden rounded-[calc(2rem-0.375rem)] border border-porcelain/80 bg-[linear-gradient(135deg,rgba(255,250,243,0.92),rgba(216,180,106,0.16),rgba(241,232,250,0.58))] p-8 transition-[transform] duration-700 ease-[var(--ease-weighted)] hover:-translate-y-1 sm:p-10">
        <div
          aria-hidden="true"
          className="absolute -right-16 -top-16 size-44 rounded-full bg-lilac-primary/20 blur-3xl"
        />
        <div className="relative max-w-3xl">
          <span className="flex size-12 items-center justify-center rounded-full bg-porcelain text-deep-lilac shadow-[var(--shadow-beautiful-sm)]">
            <GraduationCap aria-hidden="true" className="size-6" strokeWidth={1.35} />
          </span>
          <p className="mt-6 text-sm font-bold uppercase tracking-[0.22em] text-deep-lilac/72">Milestone</p>
          <h2 className="mt-4 font-serif text-4xl font-semibold leading-tight text-espresso sm:text-5xl">
            2026 - She defended, graduated, and stepped into a new chapter.
          </h2>
          <p className="mt-5 max-w-2xl text-base leading-8 text-espresso/64">
            A proud marker in the story: proof that grace can be soft and still be powerful.
          </p>
          <button
            type="button"
            onClick={(event) => {
              event.stopPropagation();
              unlockEasterEgg("graduation-era", "External defense survived. Graduate era activated.");
            }}
            className="mt-6 rounded-full border border-lilac-border/70 bg-porcelain/74 px-4 py-2 text-xs font-bold uppercase tracking-[0.16em] text-deep-lilac shadow-[var(--shadow-beautiful-sm)] transition-[background,transform] duration-500 ease-[var(--ease-weighted)] hover:-translate-y-0.5 hover:bg-pale-lilac focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-deep-lilac/45"
          >
            Unlock graduation note
          </button>
        </div>
      </div>
    </article>
  );
}
