"use client";

/* eslint-disable @next/next/no-img-element -- Archive images use short-lived signed Supabase URLs. */
import { useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";
import type { EmotionalGalleryImage } from "@/lib/archive/gallery";

type FilmStripGalleryProps = {
  images: EmotionalGalleryImage[];
  onOpen: (imageId: string) => void;
};

export function FilmStripGallery({ images, onOpen }: FilmStripGalleryProps) {
  const [activeIndex, setActiveIndex] = useState(0);
  const activeImage = images[activeIndex] ?? images[0];

  function showPrevious() {
    setActiveIndex((index) => (index - 1 + images.length) % images.length);
  }

  function showNext() {
    setActiveIndex((index) => (index + 1) % images.length);
  }

  if (!activeImage) return null;

  return (
    <div className="rounded-[2rem] bg-warm-black p-3 text-ivory shadow-[var(--shadow-beautiful-lg)] sm:p-5">
      <div
        className="flex gap-4 overflow-x-auto rounded-[1.4rem] border border-ivory/10 bg-warm-black px-3 py-4 [scrollbar-width:thin] snap-x snap-mandatory"
        aria-label="Film strip gallery"
      >
        {images.map((image, index) => (
          <button
            key={image.id}
            type="button"
            onClick={() => setActiveIndex(index)}
            onDoubleClick={() => onOpen(image.id)}
            className={cn(
              "relative min-w-48 snap-center rounded-xl border p-1 transition-[border-color,transform,opacity] duration-500 hover:-translate-y-0.5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-lilac-primary/70",
              index === activeIndex ? "border-lilac-primary bg-lilac-primary/10" : "border-ivory/14 bg-ivory/[0.04] opacity-72",
            )}
            aria-label={`Select film frame from ${image.contributorName}`}
            aria-pressed={index === activeIndex}
          >
            <span className="mb-2 grid grid-cols-6 gap-1" aria-hidden="true">
              {Array.from({ length: 6 }).map((_, holeIndex) => (
                <span key={holeIndex} className="h-1.5 rounded-full bg-ivory/18" />
              ))}
            </span>
            <img
              src={image.url ?? ""}
              alt={image.altText}
              width={800}
              height={600}
              decoding="async"
              loading="lazy"
              className="aspect-[4/3] w-full rounded-lg object-cover"
            />
            <span className="mt-2 grid grid-cols-6 gap-1" aria-hidden="true">
              {Array.from({ length: 6 }).map((_, holeIndex) => (
                <span key={holeIndex} className="h-1.5 rounded-full bg-ivory/18" />
              ))}
            </span>
          </button>
        ))}
      </div>

      <div className="grid gap-6 p-4 sm:p-6 lg:grid-cols-[0.95fr_1.05fr] lg:items-center">
        <button
          type="button"
          onClick={() => onOpen(activeImage.id)}
          className="overflow-hidden rounded-[1.35rem] border border-ivory/10 bg-ivory/[0.04] text-left focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-lilac-primary/70"
        >
          <img
            src={activeImage.url ?? ""}
            alt={activeImage.altText}
            width={1200}
            height={900}
            decoding="async"
            loading="lazy"
            className="aspect-[4/3] w-full object-cover"
          />
        </button>
        <div>
          <p className="text-xs font-bold uppercase tracking-[0.2em] text-lilac-primary">The active frame</p>
          <h3 className="mt-3 font-serif text-3xl font-semibold leading-tight text-ivory sm:text-4xl">
            {activeImage.displayCaption}
          </h3>
          <p className="mt-3 text-sm font-bold uppercase tracking-[0.16em] text-ivory/42">
            {activeImage.contributorName} / {activeImage.relationship}
          </p>
          <p className="mt-5 text-sm leading-7 text-ivory/68">{activeImage.detailText}</p>
          {images.length > 1 ? (
            <div className="mt-6 flex gap-2">
              <button
                type="button"
                onClick={showPrevious}
                className="inline-flex min-h-11 items-center gap-2 rounded-full border border-ivory/16 bg-ivory/8 px-4 text-sm font-bold text-ivory transition-[background,transform] duration-300 hover:-translate-y-0.5 hover:bg-ivory/14 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-lilac-primary/70"
              >
                <ChevronLeft aria-hidden="true" className="size-4" />
                Previous
              </button>
              <button
                type="button"
                onClick={showNext}
                className="inline-flex min-h-11 items-center gap-2 rounded-full border border-ivory/16 bg-ivory/8 px-4 text-sm font-bold text-ivory transition-[background,transform] duration-300 hover:-translate-y-0.5 hover:bg-ivory/14 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-lilac-primary/70"
              >
                Next
                <ChevronRight aria-hidden="true" className="size-4" />
              </button>
            </div>
          ) : null}
        </div>
      </div>
    </div>
  );
}
