"use client";

import { useTransition } from "react";
import { Heart } from "lucide-react";
import { useArchiveInteractions } from "@/components/archive/ArchiveInteractionsProvider";
import { cn } from "@/lib/utils";
import type { FavouriteItemType } from "@/lib/types";

type FavouriteButtonProps = {
  itemType: FavouriteItemType;
  itemId: string;
  label: string;
  className?: string;
};

export function FavouriteButton({ itemType, itemId, label, className }: FavouriteButtonProps) {
  const { isFavourite, toggleFavourite } = useArchiveInteractions();
  const [isPending, startTransition] = useTransition();
  const saved = isFavourite(itemType, itemId);

  return (
    <button
      type="button"
      disabled={isPending}
      onClick={() => {
        startTransition(() => {
          void toggleFavourite(itemType, itemId);
        });
      }}
      className={cn(
        "inline-flex min-h-10 items-center gap-2 rounded-full border px-3 py-2 text-xs font-bold uppercase tracking-[0.14em] transition-[background,transform,border-color,color] duration-500 ease-[var(--ease-weighted)] hover:-translate-y-0.5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-deep-lilac/45 disabled:cursor-wait disabled:opacity-70",
        saved
          ? "border-lilac-border bg-pale-lilac text-deep-lilac"
          : "border-espresso/10 bg-ivory/68 text-espresso/50 hover:border-lilac-border hover:text-deep-lilac",
        className,
      )}
      aria-pressed={saved}
      aria-label={saved ? `Remove ${label} from favourites` : `Save ${label} to favourites`}
    >
      <Heart
        aria-hidden="true"
        className={cn("size-4 transition-transform duration-500", saved ? "fill-lilac-primary text-deep-lilac" : "text-current")}
        strokeWidth={1.55}
      />
      {saved ? "Saved" : "Save"}
    </button>
  );
}

