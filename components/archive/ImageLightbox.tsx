"use client";

/* eslint-disable @next/next/no-img-element -- Archive media uses short-lived signed Supabase URLs. */
import { useCallback, useEffect, useRef, useState, useSyncExternalStore } from "react";
import { createPortal } from "react-dom";
import { ChevronLeft, ChevronRight, X } from "lucide-react";
import { FavouriteButton } from "@/components/archive/FavouriteButton";
import type { ArchiveMedia } from "@/lib/archive/queries";

type ImageLightboxProps = {
  images: ArchiveMedia[];
};

const subscribeToPortalTarget = () => () => {};
const getPortalTarget = () => document.body;
const getServerPortalTarget = () => null;

export function ImageLightbox({ images }: ImageLightboxProps) {
  const [activeIndex, setActiveIndex] = useState<number | null>(null);
  const portalTarget = useSyncExternalStore(subscribeToPortalTarget, getPortalTarget, getServerPortalTarget);
  const closeButtonRef = useRef<HTMLButtonElement | null>(null);
  const dialogRef = useRef<HTMLDivElement | null>(null);
  const lastFocusedElement = useRef<HTMLElement | null>(null);
  const activeImage = activeIndex === null ? null : images[activeIndex] ?? null;
  const titleId = "archive-image-lightbox-title";

  const openImage = useCallback((index: number) => {
    lastFocusedElement.current = document.activeElement instanceof HTMLElement ? document.activeElement : null;
    setActiveIndex(index);
  }, []);

  const closeImage = useCallback(() => {
    setActiveIndex(null);
    window.setTimeout(() => lastFocusedElement.current?.focus(), 0);
  }, []);

  const showPrevious = useCallback(() => {
    setActiveIndex((currentIndex) => {
      if (currentIndex === null) return currentIndex;
      return (currentIndex - 1 + images.length) % images.length;
    });
  }, [images.length]);

  const showNext = useCallback(() => {
    setActiveIndex((currentIndex) => {
      if (currentIndex === null) return currentIndex;
      return (currentIndex + 1) % images.length;
    });
  }, [images.length]);

  useEffect(() => {
    if (activeIndex === null) return;

    closeButtonRef.current?.focus();
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    function onKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") {
        closeImage();
        return;
      }

      if (event.key === "ArrowLeft") {
        showPrevious();
        return;
      }

      if (event.key === "ArrowRight") {
        showNext();
        return;
      }

      if (event.key !== "Tab" || !dialogRef.current) return;

      const focusableElements = Array.from(
        dialogRef.current.querySelectorAll<HTMLElement>(
          'button:not([disabled]), [href], audio[controls], video[controls], [tabindex]:not([tabindex="-1"])',
        ),
      );

      if (!focusableElements.length) return;

      const firstElement = focusableElements[0];
      const lastElement = focusableElements[focusableElements.length - 1];

      if (event.shiftKey && document.activeElement === firstElement) {
        event.preventDefault();
        lastElement.focus();
      } else if (!event.shiftKey && document.activeElement === lastElement) {
        event.preventDefault();
        firstElement.focus();
      }
    }

    document.addEventListener("keydown", onKeyDown);
    return () => {
      document.removeEventListener("keydown", onKeyDown);
      document.body.style.overflow = previousOverflow;
    };
  }, [activeIndex, closeImage, showNext, showPrevious]);

  return (
    <>
      <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {images.map((image, index) => (
          <article
            key={image.id}
            data-gallery-polaroid
            className="group rotate-[-1deg] rounded-[1.65rem] bg-porcelain p-3 text-left shadow-[var(--shadow-beautiful-md)] transition-[transform] duration-700 ease-[var(--ease-weighted)] hover:-translate-y-1 hover:rotate-0"
          >
            <button
              type="button"
              onClick={() => openImage(index)}
              className="block w-full rounded-[1.2rem] text-left focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-deep-lilac/45"
              aria-label={`Open photo keepsake from ${image.contributorName}`}
            >
              <img
                src={image.url ?? ""}
                alt={image.caption ?? `Photo keepsake from ${image.contributorName}`}
                width={1200}
                height={1500}
                decoding="async"
                loading="lazy"
                className="aspect-[4/5] w-full rounded-[1.2rem] border border-espresso/8 object-cover"
              />
            </button>
            <span className="block px-2 pb-1 pt-3 text-sm leading-6 text-espresso/68">
              {image.caption ?? `${image.contributorName} / ${image.relationship}`}
            </span>
            <span className="block px-2 pb-1 pt-2">
              <FavouriteButton
                itemType="media"
                itemId={image.id}
                label={`photo from ${image.contributorName}`}
                className="pointer-events-auto"
              />
            </span>
          </article>
        ))}
      </div>

      {activeImage && portalTarget
        ? createPortal(
            <div
              ref={dialogRef}
              role="dialog"
              aria-modal="true"
              aria-labelledby={titleId}
              className="fixed inset-0 z-40 flex items-center justify-center bg-warm-black/72 p-4"
              onMouseDown={(event) => {
                if (event.target === event.currentTarget) closeImage();
              }}
            >
          <div className="relative w-full max-w-5xl rounded-[2rem] bg-porcelain p-3 shadow-[var(--shadow-beautiful-lg)]">
            <button
              ref={closeButtonRef}
              type="button"
              onClick={closeImage}
              className="absolute right-5 top-5 z-10 flex size-11 items-center justify-center rounded-full bg-ivory text-espresso shadow-[var(--shadow-beautiful-sm)]"
              aria-label="Close image preview"
            >
              <X aria-hidden="true" className="size-5" />
            </button>
            {images.length > 1 ? (
              <>
                <button
                  type="button"
                  onClick={showPrevious}
                  className="absolute left-5 top-1/2 z-10 hidden size-11 -translate-y-1/2 items-center justify-center rounded-full bg-ivory text-espresso shadow-[var(--shadow-beautiful-sm)] sm:flex"
                  aria-label="Show previous image"
                >
                  <ChevronLeft aria-hidden="true" className="size-5" />
                </button>
                <button
                  type="button"
                  onClick={showNext}
                  className="absolute right-5 top-1/2 z-10 hidden size-11 -translate-y-1/2 items-center justify-center rounded-full bg-ivory text-espresso shadow-[var(--shadow-beautiful-sm)] sm:flex"
                  aria-label="Show next image"
                >
                  <ChevronRight aria-hidden="true" className="size-5" />
                </button>
              </>
            ) : null}
            <img
              src={activeImage.url ?? ""}
              alt={activeImage.caption ?? `Photo keepsake from ${activeImage.contributorName}`}
              width={1600}
              height={1200}
              decoding="async"
              className="max-h-[78svh] w-full rounded-[1.45rem] object-contain"
            />
            <p id={titleId} className="px-3 pb-2 pt-4 text-sm leading-6 text-espresso/64">
              {activeImage.caption ?? `${activeImage.contributorName} / ${activeImage.relationship}`}
            </p>
            <div className="px-3 pb-3">
              <FavouriteButton itemType="media" itemId={activeImage.id} label={`photo from ${activeImage.contributorName}`} />
            </div>
            {images.length > 1 ? (
              <div className="flex gap-3 px-3 pb-2 sm:hidden">
                <button
                  type="button"
                  onClick={showPrevious}
                  className="min-h-11 flex-1 rounded-full border border-lilac-border/70 bg-ivory px-4 text-sm font-bold text-espresso"
                >
                  Previous
                </button>
                <button
                  type="button"
                  onClick={showNext}
                  className="min-h-11 flex-1 rounded-full border border-lilac-border/70 bg-ivory px-4 text-sm font-bold text-espresso"
                >
                  Next
                </button>
              </div>
            ) : null}
          </div>
            </div>,
            portalTarget,
          )
        : null}
    </>
  );
}
