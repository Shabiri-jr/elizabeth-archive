/* eslint-disable @next/next/no-img-element -- Archive media uses short-lived signed Supabase URLs. */
import { ArchiveEmptyState } from "@/components/archive/ArchiveEmptyState";
import { FavouriteButton } from "@/components/archive/FavouriteButton";
import type { ArchiveSubmission } from "@/lib/archive/queries";

type MemoryTimelineProps = {
  memories: ArchiveSubmission[];
};

export function MemoryTimeline({ memories }: MemoryTimelineProps) {
  if (!memories.length) {
    return (
      <ArchiveEmptyState
        title="Memories will appear here once they are approved."
        body="Shared moments, inside jokes, and soft recollections will become part of this story wall."
      />
    );
  }

  return (
    <div className="relative">
      <div
        aria-hidden="true"
        className="story-rail absolute left-4 top-3 hidden h-[calc(100%-1.5rem)] w-px md:block"
      />
      <div className="grid gap-6 md:pl-12">
        {memories.map((memory, index) => {
          const image = memory.images[0];

          return (
            <article
              key={memory.id}
              data-archive-card
              className="relative rounded-[1.75rem] bg-warm-black/[0.035] p-1.5 ring-1 ring-espresso/7 shadow-[var(--shadow-beautiful-md)]"
            >
              <span
                aria-hidden="true"
                className="absolute -left-[2.35rem] top-8 hidden size-3 rounded-full bg-deep-lilac shadow-[0_0_0_6px_rgba(241,232,250,0.9)] md:block"
              />
              <div className="grid gap-5 rounded-[calc(1.75rem-0.375rem)] border border-porcelain/80 bg-porcelain/76 p-5 lg:grid-cols-[0.82fr_1.18fr] lg:items-center">
                {image?.url ? (
                  <div className={index % 2 ? "lg:order-2" : ""}>
                    <div className="rotate-[-1deg] rounded-[1.35rem] bg-porcelain p-2 shadow-[var(--shadow-beautiful-md)]">
                      <img
                        src={image.url}
                        alt={image.caption ?? `Memory shared by ${memory.name}`}
                        width={1200}
                        height={900}
                        decoding="async"
                        loading="lazy"
                        className="aspect-[4/3] w-full rounded-[1rem] object-cover"
                      />
                    </div>
                  </div>
                ) : null}
                <div>
                  <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                    <p className="text-xs font-bold uppercase tracking-[0.18em] text-deep-lilac/72">
                      {memory.name} / {memory.relationship}
                    </p>
                    <FavouriteButton itemType="memory" itemId={memory.id} label={`memory from ${memory.name}`} />
                  </div>
                  <p className="mt-4 whitespace-pre-wrap text-base leading-8 text-espresso/70">{memory.memory}</p>
                </div>
              </div>
            </article>
          );
        })}
      </div>
    </div>
  );
}
