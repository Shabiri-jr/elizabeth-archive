"use client";

import { useCallback, useEffect, useRef, useState, useSyncExternalStore } from "react";
import { createPortal } from "react-dom";
import { BookOpen, X } from "lucide-react";
import { ArchiveEmptyState } from "@/components/archive/ArchiveEmptyState";
import { FavouriteButton } from "@/components/archive/FavouriteButton";
import type { OpenWhenLetter } from "@/lib/archive/queries";

type OpenWhenLettersProps = {
  letters: OpenWhenLetter[];
};

const subscribeToPortalTarget = () => () => {};
const getPortalTarget = () => document.body;
const getServerPortalTarget = () => null;

export function OpenWhenLetters({ letters }: OpenWhenLettersProps) {
  const [activeLetter, setActiveLetter] = useState<OpenWhenLetter | null>(null);
  const portalTarget = useSyncExternalStore(subscribeToPortalTarget, getPortalTarget, getServerPortalTarget);
  const closeButtonRef = useRef<HTMLButtonElement | null>(null);
  const lastFocusedElement = useRef<HTMLElement | null>(null);

  function openLetter(letter: OpenWhenLetter) {
    lastFocusedElement.current = document.activeElement instanceof HTMLElement ? document.activeElement : null;
    setActiveLetter(letter);
  }

  const closeLetter = useCallback(() => {
    setActiveLetter(null);
    window.setTimeout(() => lastFocusedElement.current?.focus(), 0);
  }, []);

  useEffect(() => {
    if (!activeLetter) return;

    closeButtonRef.current?.focus();
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    function onKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") closeLetter();
    }

    document.addEventListener("keydown", onKeyDown);
    return () => {
      document.removeEventListener("keydown", onKeyDown);
      document.body.style.overflow = previousOverflow;
    };
  }, [activeLetter, closeLetter]);

  if (!letters.length) {
    return (
      <ArchiveEmptyState
        title="The private letter drawer is still being prepared."
        body="Open When letters will appear here once they are written and made visible."
      />
    );
  }

  return (
    <>
      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        {letters.map((letter, index) => (
          <article
            key={letter.id}
            data-archive-card
            className="rounded-[1.75rem] bg-warm-black/[0.035] p-1.5 ring-1 ring-espresso/7 shadow-[var(--shadow-beautiful-md)]"
          >
            <div className="flex h-full flex-col rounded-[calc(1.75rem-0.375rem)] border border-lilac-border/55 bg-[linear-gradient(135deg,rgba(255,250,243,0.9),rgba(241,232,250,0.56))] p-5">
              <div className="flex items-start justify-between gap-3">
                <span className="flex size-11 shrink-0 items-center justify-center rounded-full bg-porcelain text-deep-lilac shadow-[var(--shadow-beautiful-sm)]">
                  <BookOpen aria-hidden="true" className="size-5" strokeWidth={1.35} />
                </span>
                <span className="text-xs font-bold uppercase tracking-[0.16em] text-deep-lilac/56">
                  {String(index + 1).padStart(2, "0")}
                </span>
              </div>
              <button
                type="button"
                onClick={() => openLetter(letter)}
                className="mt-6 block text-left focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-deep-lilac/45"
              >
                <h3 className="font-serif text-3xl font-semibold leading-tight text-espresso">{letter.title}</h3>
                {letter.subtitle ? <p className="mt-3 text-sm leading-6 text-espresso/62">{letter.subtitle}</p> : null}
              </button>
              <div className="mt-auto flex items-center justify-between gap-3 pt-6">
                <span className="rounded-full border border-champagne/35 bg-ivory/58 px-3 py-1 text-xs font-bold uppercase tracking-[0.16em] text-espresso/48">
                  {letter.mood ?? "letter"}
                </span>
                <FavouriteButton itemType="open_when_letter" itemId={letter.id} label={letter.title} />
              </div>
            </div>
          </article>
        ))}
      </div>

      {activeLetter && portalTarget
        ? createPortal(
            <div
              role="dialog"
              aria-modal="true"
              aria-labelledby="open-when-dialog-title"
              className="fixed inset-0 z-40 flex items-center justify-center bg-warm-black/68 p-4"
              onMouseDown={(event) => {
                if (event.target === event.currentTarget) closeLetter();
              }}
            >
          <article className="relative max-h-[88svh] w-full max-w-3xl overflow-y-auto rounded-[2rem] bg-warm-black/[0.035] p-1.5 shadow-[var(--shadow-beautiful-lg)] ring-1 ring-porcelain/18">
            <div className="rounded-[calc(2rem-0.375rem)] border border-lilac-border/70 bg-porcelain p-6 sm:p-9">
              <button
                ref={closeButtonRef}
                type="button"
                onClick={closeLetter}
                className="ml-auto flex size-11 items-center justify-center rounded-full bg-ivory text-espresso shadow-[var(--shadow-beautiful-sm)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-deep-lilac/45"
                aria-label="Close letter"
              >
                <X aria-hidden="true" className="size-5" />
              </button>
              <p className="mt-4 text-xs font-bold uppercase tracking-[0.2em] text-deep-lilac/70">Open When</p>
              <h2 id="open-when-dialog-title" className="mt-3 font-serif text-4xl font-semibold leading-tight text-espresso sm:text-5xl">
                {activeLetter.title}
              </h2>
              {activeLetter.subtitle ? <p className="mt-3 text-base leading-7 text-espresso/58">{activeLetter.subtitle}</p> : null}
              <p className="mt-8 whitespace-pre-wrap font-serif text-2xl leading-relaxed text-espresso sm:text-3xl">
                {activeLetter.body}
              </p>
              <div className="mt-8">
                <FavouriteButton itemType="open_when_letter" itemId={activeLetter.id} label={activeLetter.title} />
              </div>
            </div>
          </article>
            </div>,
            portalTarget,
          )
        : null}
    </>
  );
}
