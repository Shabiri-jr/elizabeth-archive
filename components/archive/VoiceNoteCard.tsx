import { Mic2 } from "lucide-react";
import { FavouriteButton } from "@/components/archive/FavouriteButton";
import type { ArchiveMedia } from "@/lib/archive/queries";

type VoiceNoteCardProps = {
  audio: ArchiveMedia;
};

export function VoiceNoteCard({ audio }: VoiceNoteCardProps) {
  return (
    <article
      data-archive-card
      className="rounded-[1.5rem] bg-warm-black/[0.035] p-1.5 ring-1 ring-espresso/7 shadow-[var(--shadow-beautiful-md)]"
    >
      <div className="h-full rounded-[calc(1.5rem-0.375rem)] border border-porcelain/80 bg-porcelain/76 p-5">
        <span className="flex size-11 items-center justify-center rounded-full bg-pale-lilac text-deep-lilac">
          <Mic2 aria-hidden="true" className="size-5" strokeWidth={1.35} />
        </span>
        <div className="mt-5 flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
          <div>
            <p className="font-serif text-2xl font-semibold text-espresso">{audio.contributorName}</p>
            <p className="mt-1 text-sm font-semibold text-deep-lilac">{audio.relationship}</p>
          </div>
          <FavouriteButton itemType="media" itemId={audio.id} label={`voice note from ${audio.contributorName}`} />
        </div>
        {audio.url ? (
          <audio
            controls
            preload="metadata"
            src={audio.url}
            className="mt-5 w-full"
            aria-label={`Voice note from ${audio.contributorName}`}
          />
        ) : null}
      </div>
    </article>
  );
}
