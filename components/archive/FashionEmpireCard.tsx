"use client";

import { Crown } from "lucide-react";
import { useArchiveInteractions } from "@/components/archive/ArchiveInteractionsProvider";

export function FashionEmpireCard() {
  const { unlockEasterEgg } = useArchiveInteractions();

  return (
    <article
      data-archive-card
      onClick={() => unlockEasterEgg("fashion-empire", "Future fashion empire loading...")}
      className="rounded-[2rem] bg-warm-black/[0.035] p-1.5 ring-1 ring-espresso/7 shadow-[var(--shadow-beautiful-lg)]"
    >
      <div className="relative overflow-hidden rounded-[calc(2rem-0.375rem)] border border-lilac-border/65 bg-[linear-gradient(135deg,rgba(241,232,250,0.82),rgba(255,250,243,0.92))] p-8 transition-[transform] duration-700 ease-[var(--ease-weighted)] hover:-translate-y-1 sm:p-10">
        <div
          aria-hidden="true"
          className="absolute bottom-0 right-0 h-32 w-32 rounded-tl-full border-l border-t border-lilac-border/60"
        />
        <span className="flex size-12 items-center justify-center rounded-full bg-porcelain text-deep-lilac shadow-[var(--shadow-beautiful-sm)]">
          <Crown aria-hidden="true" className="size-6" strokeWidth={1.35} />
        </span>
        <p className="mt-6 text-sm font-bold uppercase tracking-[0.22em] text-deep-lilac/72">Future empire</p>
        <h2 className="mt-4 max-w-4xl font-serif text-4xl font-semibold leading-tight text-espresso sm:text-5xl">
          Future Founder.{" "}
          <button
            type="button"
            onClick={(event) => {
              event.stopPropagation();
              unlockEasterEgg("soft-life-ceo", "Soft life, but make it intentional.");
            }}
            className="rounded-2xl text-deep-lilac underline decoration-lilac-border/70 decoration-2 underline-offset-4 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-deep-lilac/45"
          >
            Future Soft-Life CEO.
          </button>{" "}
          Future Woman of Influence.
        </h2>
        <p className="mt-5 max-w-2xl text-base leading-8 text-espresso/64">
          May this new year bring you closer to the life you have imagined - creative, peaceful, successful, and fully
          yours.
        </p>
        <button
          type="button"
          onClick={(event) => {
            event.stopPropagation();
            unlockEasterEgg("fashion-empire", "Future fashion empire loading...");
          }}
          className="mt-6 rounded-full border border-lilac-border/70 bg-porcelain/74 px-4 py-2 text-xs font-bold uppercase tracking-[0.16em] text-deep-lilac shadow-[var(--shadow-beautiful-sm)] transition-[background,transform] duration-500 ease-[var(--ease-weighted)] hover:-translate-y-0.5 hover:bg-pale-lilac focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-deep-lilac/45"
        >
          Unlock fashion note
        </button>
      </div>
    </article>
  );
}
