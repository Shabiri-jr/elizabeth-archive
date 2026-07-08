"use client";

/* eslint-disable @next/next/no-img-element -- Archive images use short-lived signed Supabase URLs. */
import { FavouriteButton } from "@/components/archive/FavouriteButton";
import { cn } from "@/lib/utils";
import type { EmotionalGalleryImage } from "@/lib/archive/gallery";

type PolaroidWallProps = {
  images: EmotionalGalleryImage[];
  onOpen: (imageId: string) => void;
};

const rotations = ["md:-rotate-2", "md:rotate-1", "md:-rotate-1", "md:rotate-2", "md:rotate-0"];

export function PolaroidWall({ images, onOpen }: PolaroidWallProps) {
  return (
    <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
      {images.map((image, index) => (
        <article
          key={image.id}
          data-gallery-polaroid
          className={cn(
            "group relative rounded-[1.6rem] bg-porcelain p-3 text-left shadow-[var(--shadow-beautiful-md)] transition-[transform,box-shadow] duration-700 ease-[var(--ease-weighted)] hover:-translate-y-1 hover:rotate-0 hover:shadow-[var(--shadow-beautiful-lg)]",
            rotations[index % rotations.length],
          )}
        >
          <span
            aria-hidden="true"
            className="absolute -top-3 left-8 h-7 w-16 rotate-[-6deg] rounded-sm border border-lilac-border/55 bg-pale-lilac/78 shadow-[var(--shadow-beautiful-sm)]"
          />
          <button
            type="button"
            onClick={() => onOpen(image.id)}
            className="block w-full rounded-[1.15rem] text-left focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-deep-lilac/45"
            aria-label={`Open photo memory from ${image.contributorName}`}
          >
            <img
              src={image.url ?? ""}
              alt={image.altText}
              width={1200}
              height={1500}
              decoding="async"
              loading="lazy"
              className="aspect-[4/5] w-full rounded-[1.15rem] border border-espresso/8 object-cover"
            />
            <span className="block px-2 pb-1 pt-3 font-serif text-xl font-semibold leading-tight text-espresso">
              {image.displayCaption}
            </span>
            <span className="block px-2 pb-2 text-sm leading-6 text-espresso/58">
              {image.contributorName} / {image.relationship}
            </span>
          </button>
          <div className="px-2 pb-1 pt-1">
            <FavouriteButton itemType="media" itemId={image.id} label={`photo from ${image.contributorName}`} />
          </div>
        </article>
      ))}
    </div>
  );
}
