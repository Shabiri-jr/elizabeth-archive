"use client";

import Link from "next/link";
import { Heart } from "lucide-react";
import { useArchiveInteractions } from "@/components/archive/ArchiveInteractionsProvider";

export function FavouritesTeaser() {
  const { favouriteKeys } = useArchiveInteractions();
  const count = favouriteKeys.size;

  return (
    <div
      data-archive-card
      className="rounded-[2rem] bg-warm-black/[0.035] p-1.5 ring-1 ring-espresso/7 shadow-[var(--shadow-beautiful-md)]"
    >
      <div className="rounded-[calc(2rem-0.375rem)] border border-lilac-border/60 bg-[linear-gradient(135deg,rgba(255,250,243,0.9),rgba(241,232,250,0.52))] p-7 sm:p-9">
        <span className="flex size-12 items-center justify-center rounded-full bg-porcelain text-deep-lilac shadow-[var(--shadow-beautiful-sm)]">
          <Heart aria-hidden="true" className="size-5 fill-lilac-primary" strokeWidth={1.35} />
        </span>
        <h2 className="mt-6 font-serif text-4xl font-semibold leading-tight text-espresso">Elizabeth&apos;s Favourites</h2>
        <p className="mt-4 max-w-2xl text-base leading-8 text-espresso/64">
          These are the moments you chose to keep close. Save messages, memories, photos, wishes, and letters as you move
          through the archive.
        </p>
        <Link
          href="/archive/favourites"
          className="mt-6 inline-flex min-h-11 items-center rounded-full bg-deep-lilac px-5 py-2 text-sm font-bold text-ivory shadow-[var(--shadow-beautiful-sm)] transition-[background,transform] duration-500 ease-[var(--ease-weighted)] hover:-translate-y-0.5 hover:bg-[#6c5392] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-deep-lilac/45"
        >
          Open Favourites {count ? `(${count})` : ""}
        </Link>
      </div>
    </div>
  );
}
