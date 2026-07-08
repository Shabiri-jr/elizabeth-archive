"use client";

/* eslint-disable @next/next/no-img-element -- Archive images use short-lived signed Supabase URLs. */
import type { CSSProperties } from "react";
import { cn } from "@/lib/utils";
import type { EmotionalGalleryImage } from "@/lib/archive/gallery";

type FloatingPhotoMemoriesProps = {
  images: EmotionalGalleryImage[];
  onOpen: (imageId: string) => void;
};

const positions = [
  "lg:left-8 lg:top-8",
  "lg:right-8 lg:top-14",
  "lg:left-24 lg:bottom-8",
  "lg:right-20 lg:bottom-10",
];
const rotations = ["-3deg", "2deg", "3deg", "-2deg"];

export function FloatingPhotoMemories({ images, onOpen }: FloatingPhotoMemoriesProps) {
  if (!images.length) return null;

  const featuredText = images[0]?.detailText ?? "Some memories do not need perfect words. They just need to be kept.";

  return (
    <div className="relative overflow-hidden rounded-[2.2rem] border border-lilac-border/50 bg-[radial-gradient(circle_at_50%_42%,rgba(191,162,219,0.2),transparent_32%),rgba(255,250,243,0.72)] p-5 shadow-[var(--shadow-beautiful-lg)] sm:p-8 lg:min-h-[33rem]">
      <div className="relative z-10 mx-auto flex min-h-[24rem] max-w-2xl items-center justify-center text-center">
        <div className="rounded-[2rem] border border-porcelain/90 bg-porcelain/76 p-7 shadow-[var(--shadow-beautiful-md)] backdrop-blur-sm sm:p-10">
          <p className="text-xs font-bold uppercase tracking-[0.22em] text-deep-lilac/72">Featured memory</p>
          <blockquote className="mt-5 font-serif text-3xl font-semibold leading-tight text-espresso sm:text-4xl">
            {featuredText}
          </blockquote>
          <p className="mt-5 text-sm leading-7 text-espresso/58">
            Tap a floating photo to let its message step closer.
          </p>
        </div>
      </div>

      <div className="relative z-20 mt-5 grid gap-4 sm:grid-cols-2 lg:absolute lg:inset-0 lg:mt-0 lg:block">
        {images.slice(0, 4).map((image, index) => (
          <button
            key={image.id}
            type="button"
            onClick={() => onOpen(image.id)}
            className={cn(
              "gallery-float rounded-[1.35rem] border border-lilac-border/45 bg-porcelain p-2 text-left shadow-[var(--shadow-beautiful-md)] transition-[transform,box-shadow] duration-500 hover:shadow-[var(--shadow-beautiful-lg)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-deep-lilac/45 lg:absolute lg:w-44 xl:w-52",
              positions[index % positions.length],
            )}
            style={{ "--gallery-float-rotate": rotations[index % rotations.length] } as CSSProperties}
            aria-label={`Open featured gallery memory from ${image.contributorName}`}
          >
            <img
              src={image.url ?? ""}
              alt={image.altText}
              width={700}
              height={850}
              decoding="async"
              loading="lazy"
              className="aspect-[4/5] w-full rounded-[1rem] object-cover"
            />
            <span className="block px-1 pt-2 text-xs font-bold uppercase tracking-[0.14em] text-espresso/50">
              {image.momentLabel}
            </span>
          </button>
        ))}
      </div>
    </div>
  );
}
