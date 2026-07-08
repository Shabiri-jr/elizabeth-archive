"use client";

/* eslint-disable @next/next/no-img-element -- Archive images use short-lived signed Supabase URLs. */
import { useCallback, useEffect, useRef, type MouseEvent } from "react";
import { ChevronLeft, ChevronRight, X } from "lucide-react";
import { FavouriteButton } from "@/components/archive/FavouriteButton";
import type { EmotionalGalleryImage } from "@/lib/archive/gallery";

type PhotoMemoryModalProps = {
  images: EmotionalGalleryImage[];
  activeIndex: number | null;
  onClose: () => void;
  onPrevious: () => void;
  onNext: () => void;
};

export function PhotoMemoryModal({ images, activeIndex, onClose, onPrevious, onNext }: PhotoMemoryModalProps) {
  const closeButtonRef = useRef<HTMLButtonElement | null>(null);
  const dialogRef = useRef<HTMLDivElement | null>(null);
  const lastFocusedElement = useRef<HTMLElement | null>(null);
  const activeImage = activeIndex === null ? null : images[activeIndex] ?? null;
  const titleId = activeImage ? `gallery-photo-title-${activeImage.id}` : "gallery-photo-title";

  useEffect(() => {
    if (activeIndex === null) {
      window.setTimeout(() => lastFocusedElement.current?.focus(), 0);
      return;
    }

    lastFocusedElement.current = document.activeElement instanceof HTMLElement ? document.activeElement : null;
    closeButtonRef.current?.focus();
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    function onKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") {
        onClose();
        return;
      }

      if (event.key === "ArrowLeft") {
        onPrevious();
        return;
      }

      if (event.key === "ArrowRight") {
        onNext();
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
  }, [activeIndex, onClose, onNext, onPrevious]);

  const closeOnBackdrop = useCallback(
    (event: MouseEvent<HTMLDivElement>) => {
      if (event.target === event.currentTarget) onClose();
    },
    [onClose],
  );

  if (!activeImage) return null;

  return (
    <div
      ref={dialogRef}
      role="dialog"
      aria-modal="true"
      aria-labelledby={titleId}
      className="fixed inset-0 z-50 flex items-center justify-center bg-warm-black/74 p-3 sm:p-5"
      onMouseDown={closeOnBackdrop}
    >
      <div className="relative grid max-h-[92svh] w-full max-w-6xl overflow-hidden rounded-[2rem] bg-porcelain shadow-[var(--shadow-beautiful-lg)] lg:grid-cols-[1.08fr_0.92fr]">
        <button
          ref={closeButtonRef}
          type="button"
          onClick={onClose}
          className="absolute right-4 top-4 z-10 flex size-11 items-center justify-center rounded-full bg-ivory text-espresso shadow-[var(--shadow-beautiful-sm)] transition-[background,transform] duration-300 hover:-translate-y-0.5 hover:bg-pale-lilac focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-deep-lilac/45"
          aria-label="Close photo memory"
        >
          <X aria-hidden="true" className="size-5" />
        </button>

        <div className="min-h-0 bg-warm-black/95 p-3">
          <img
            src={activeImage.url ?? ""}
            alt={activeImage.altText}
            width={1600}
            height={1200}
            decoding="async"
            className="max-h-[48svh] w-full rounded-[1.45rem] object-contain lg:max-h-[86svh]"
          />
        </div>

        <div className="min-h-0 overflow-y-auto p-6 sm:p-8 lg:p-10">
          <div className="flex flex-wrap gap-2 pr-12">
            <span className="rounded-full border border-lilac-border/70 bg-pale-lilac px-3 py-1 text-xs font-bold uppercase tracking-[0.16em] text-deep-lilac">
              {activeImage.momentLabel}
            </span>
            {activeImage.emotionTag ? (
              <span className="rounded-full border border-champagne/45 bg-champagne/14 px-3 py-1 text-xs font-bold uppercase tracking-[0.16em] text-espresso/58">
                {activeImage.emotionTag}
              </span>
            ) : null}
          </div>

          <h2 id={titleId} className="mt-5 font-serif text-3xl font-semibold leading-tight text-espresso sm:text-4xl">
            {activeImage.displayCaption}
          </h2>
          <p className="mt-3 text-sm font-bold uppercase tracking-[0.16em] text-espresso/44">
            {activeImage.contributorName} / {activeImage.relationship}
          </p>

          <div className="mt-7 space-y-5 text-base leading-8 text-espresso/68">
            <p>{activeImage.detailText}</p>
            {activeImage.birthdayMessage && activeImage.birthdayMessage !== activeImage.detailText ? (
              <blockquote className="rounded-[1.35rem] border border-lilac-border/55 bg-pale-lilac/35 p-5 font-serif text-2xl leading-snug text-espresso">
                {activeImage.birthdayMessage}
              </blockquote>
            ) : null}
            {activeImage.futureWish && activeImage.futureWish !== activeImage.detailText ? (
              <p className="rounded-[1.35rem] border border-champagne/36 bg-champagne/10 p-5">
                {activeImage.futureWish}
              </p>
            ) : null}
          </div>

          <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <FavouriteButton itemType="media" itemId={activeImage.id} label={`photo from ${activeImage.contributorName}`} />
            {images.length > 1 ? (
              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={onPrevious}
                  className="inline-flex min-h-11 items-center gap-2 rounded-full border border-lilac-border/70 bg-ivory px-4 text-sm font-bold text-espresso transition-[background,transform] duration-300 hover:-translate-y-0.5 hover:bg-pale-lilac focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-deep-lilac/45"
                >
                  <ChevronLeft aria-hidden="true" className="size-4" />
                  Previous
                </button>
                <button
                  type="button"
                  onClick={onNext}
                  className="inline-flex min-h-11 items-center gap-2 rounded-full border border-lilac-border/70 bg-ivory px-4 text-sm font-bold text-espresso transition-[background,transform] duration-300 hover:-translate-y-0.5 hover:bg-pale-lilac focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-deep-lilac/45"
                >
                  Next
                  <ChevronRight aria-hidden="true" className="size-4" />
                </button>
              </div>
            ) : null}
          </div>
        </div>
      </div>
    </div>
  );
}
