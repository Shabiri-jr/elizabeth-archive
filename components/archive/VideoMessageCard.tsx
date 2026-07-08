import { FavouriteButton } from "@/components/archive/FavouriteButton";
import type { ArchiveMedia } from "@/lib/archive/queries";

type VideoMessageCardProps = {
  video: ArchiveMedia;
};

export function VideoMessageCard({ video }: VideoMessageCardProps) {
  return (
    <article
      data-archive-card
      className="rounded-[1.5rem] bg-warm-black/[0.035] p-1.5 ring-1 ring-espresso/7 shadow-[var(--shadow-beautiful-md)]"
    >
      <div className="h-full rounded-[calc(1.5rem-0.375rem)] border border-porcelain/80 bg-porcelain/76 p-4">
        {video.url ? (
          <video
            controls
            preload="metadata"
            playsInline
            src={video.url}
            className="aspect-video w-full rounded-[1.1rem] bg-warm-black object-contain"
            aria-label={`Video message from ${video.contributorName}`}
          />
        ) : null}
        <div className="flex flex-col gap-3 p-2 pt-4 sm:flex-row sm:items-start sm:justify-between">
          <div>
            <p className="font-serif text-2xl font-semibold text-espresso">{video.contributorName}</p>
            <p className="mt-1 text-sm font-semibold text-deep-lilac">{video.relationship}</p>
          </div>
          <FavouriteButton itemType="media" itemId={video.id} label={`video from ${video.contributorName}`} />
        </div>
      </div>
    </article>
  );
}
