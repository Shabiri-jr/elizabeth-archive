import { FavouriteButton } from "@/components/archive/FavouriteButton";
import type { ArchiveSubmission } from "@/lib/archive/queries";

type FutureWishCardProps = {
  wish: ArchiveSubmission;
};

export function FutureWishCard({ wish }: FutureWishCardProps) {
  return (
    <article
      data-archive-card
      className="rounded-[1.5rem] bg-warm-black/[0.035] p-1.5 ring-1 ring-espresso/7 shadow-[var(--shadow-beautiful-md)]"
    >
      <div className="h-full rounded-[calc(1.5rem-0.375rem)] border border-lilac-border/55 bg-[linear-gradient(135deg,rgba(255,250,243,0.86),rgba(241,232,250,0.62))] p-6">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
          <div>
            <p className="font-serif text-2xl font-semibold text-espresso">{wish.name}</p>
            <p className="mt-1 text-sm font-semibold text-deep-lilac">{wish.relationship}</p>
          </div>
          <FavouriteButton itemType="future_wish" itemId={wish.id} label={`future wish from ${wish.name}`} />
        </div>
        <p className="mt-5 whitespace-pre-wrap text-base leading-8 text-espresso/70">{wish.futureWish}</p>
      </div>
    </article>
  );
}
