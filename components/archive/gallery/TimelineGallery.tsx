"use client";

/* eslint-disable @next/next/no-img-element -- Archive images use short-lived signed Supabase URLs. */
import { cn } from "@/lib/utils";
import type { EmotionalGalleryImage } from "@/lib/archive/gallery";

type TimelineGalleryProps = {
  images: EmotionalGalleryImage[];
  onOpen: (imageId: string) => void;
};

export function TimelineGallery({ images, onOpen }: TimelineGalleryProps) {
  return (
    <div className="relative">
      <div aria-hidden="true" className="absolute left-5 top-0 hidden h-full w-px bg-lilac-border/70 md:left-1/2 md:block" />
      <div className="space-y-7">
        {images.map((image, index) => (
          <article
            key={image.id}
            data-gallery-polaroid
            className={cn(
              "relative grid gap-5 md:grid-cols-2 md:items-center",
              index % 2 === 0 ? "" : "md:[&>div:first-child]:order-2",
            )}
          >
            <div className={cn(index % 2 === 0 ? "md:pr-10" : "md:pl-10")}>
              <button
                type="button"
                onClick={() => onOpen(image.id)}
                className="block w-full overflow-hidden rounded-[1.45rem] border border-lilac-border/45 bg-porcelain p-2 shadow-[var(--shadow-beautiful-md)] transition-[transform] duration-500 hover:-translate-y-1 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-deep-lilac/45"
                aria-label={`Open timeline photo from ${image.contributorName}`}
              >
                <img
                  src={image.url ?? ""}
                  alt={image.altText}
                  width={1100}
                  height={850}
                  decoding="async"
                  loading="lazy"
                  className="aspect-[5/4] w-full rounded-[1.1rem] object-cover"
                />
              </button>
            </div>
            <div className={cn("relative rounded-[1.5rem] border border-lilac-border/45 bg-porcelain/78 p-5 shadow-[var(--shadow-beautiful-sm)]", index % 2 === 0 ? "md:ml-10" : "md:mr-10")}>
              <span
                aria-hidden="true"
                className="absolute top-6 hidden size-3 rounded-full bg-deep-lilac shadow-[0_0_0_8px_rgba(191,162,219,0.18)] md:block"
                style={index % 2 === 0 ? { left: "-2.9rem" } : { right: "-2.9rem" }}
              />
              <p className="text-xs font-bold uppercase tracking-[0.2em] text-deep-lilac/72">{image.momentLabel}</p>
              <h3 className="mt-3 font-serif text-2xl font-semibold leading-tight text-espresso">{image.displayCaption}</h3>
              <p className="mt-2 text-sm font-bold uppercase tracking-[0.16em] text-espresso/42">
                {image.contributorName} / {image.relationship}
              </p>
              <p className="mt-4 text-sm leading-7 text-espresso/62">{image.detailText}</p>
            </div>
          </article>
        ))}
      </div>
    </div>
  );
}
