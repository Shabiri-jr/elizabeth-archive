"use client";

import { useCallback, useEffect, useRef, useState } from "react";

const INTRO_STORAGE_KEY = "elizabeth-archive-reveal-intro-seen";
const trailerLines = [
  "Every person has a story.",
  "Some people make the room softer.",
  "Some people make ordinary moments feel warmer.",
  "Some people are remembered by how they make others feel.",
  "This one is for Elizabeth.",
  "A Story Called Elizabeth",
];

function canUseMotion() {
  return !window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}

function markIntroSeen() {
  try {
    localStorage.setItem(INTRO_STORAGE_KEY, "true");
  } catch {
    // Browsers can block storage in private contexts; the intro can simply replay.
  }
}

function hasSeenIntro() {
  try {
    return localStorage.getItem(INTRO_STORAGE_KEY) === "true";
  } catch {
    return false;
  }
}

type ArchiveRevealClientProps = {
  revealModeEnabled?: boolean;
};

export function ArchiveRevealClient({ revealModeEnabled = false }: ArchiveRevealClientProps) {
  const [introVisible, setIntroVisible] = useState(false);
  const [introStep, setIntroStep] = useState(0);
  const timersRef = useRef<number[]>([]);

  const clearIntroTimers = useCallback(() => {
    timersRef.current.forEach((timer) => window.clearTimeout(timer));
    timersRef.current = [];
  }, []);

  const startIntro = useCallback(() => {
    if (!canUseMotion()) return;

    clearIntroTimers();
    setIntroStep(0);
    setIntroVisible(true);
    timersRef.current = trailerLines.slice(1).map((_, index) =>
      window.setTimeout(() => setIntroStep(index + 1), 1100 + index * 1350),
    );
  }, [clearIntroTimers]);

  const skipIntro = useCallback(() => {
    clearIntroTimers();
    markIntroSeen();
    setIntroVisible(false);
  }, [clearIntroTimers]);

  useEffect(() => {
    if (!canUseMotion() || hasSeenIntro()) return;

    if (revealModeEnabled || !hasSeenIntro()) {
      timersRef.current.push(window.setTimeout(startIntro, 250));
    }
  }, [revealModeEnabled, startIntro]);

  useEffect(() => {
    function onReplayTrailer() {
      startIntro();
    }

    window.addEventListener("elizabeth:replay-trailer", onReplayTrailer);
    return () => {
      window.removeEventListener("elizabeth:replay-trailer", onReplayTrailer);
      clearIntroTimers();
    };
  }, [clearIntroTimers, startIntro]);

  useEffect(() => {
    const elements = Array.from(document.querySelectorAll<HTMLElement>(".archive-reveal"));
    const prefersReducedMotion = !canUseMotion();

    if (prefersReducedMotion) {
      elements.forEach((element) => element.classList.add("is-visible"));
      return;
    }

    document.documentElement.classList.add("js-archive-motion");
    let cleanup: (() => void) | undefined;
    let cancelled = false;

    async function setupMotion() {
      try {
        const [{ gsap }, { ScrollTrigger }] = await Promise.all([import("gsap"), import("gsap/ScrollTrigger")]);
        if (cancelled) return;

        gsap.registerPlugin(ScrollTrigger);

        const context = gsap.context(() => {
          const heroItems = gsap.utils.toArray<HTMLElement>("[data-archive-hero-item]");
          if (heroItems.length) {
            gsap.fromTo(
              heroItems,
              { autoAlpha: 0, y: 20 },
              {
                autoAlpha: 1,
                y: 0,
                duration: 1,
                ease: "power2.out",
                stagger: 0.1,
                delay: revealModeEnabled && !hasSeenIntro() ? 0.45 : 0.1,
              },
            );
          }

          const revealTargets = gsap.utils.toArray<HTMLElement>(
            ".archive-reveal, [data-archive-card], [data-gallery-polaroid], [data-final-letter]",
          );
          gsap.set(revealTargets, { autoAlpha: 0, y: 24 });
          revealTargets.forEach((target) => {
            gsap.to(target, {
              autoAlpha: 1,
              y: 0,
              duration: 0.9,
              ease: "power2.out",
              scrollTrigger: {
                trigger: target,
                start: "top 84%",
                once: true,
              },
            });
          });

          const words = gsap.utils.toArray<HTMLElement>("[data-archive-word]");
          if (words.length) {
            gsap.set(words, { autoAlpha: 0, y: 18 });
            gsap.to(words, {
              autoAlpha: 1,
              y: 0,
              duration: 0.75,
              ease: "power2.out",
              stagger: 0.07,
              scrollTrigger: {
                trigger: words[0].parentElement,
                start: "top 82%",
                once: true,
              },
            });
          }

          if (window.matchMedia("(min-width: 900px)").matches) {
            gsap.utils.toArray<HTMLElement>("[data-parallax-soft]").forEach((target) => {
              gsap.to(target, {
                y: -26,
                ease: "none",
                scrollTrigger: {
                  trigger: "#opening-prelude",
                  start: "top top",
                  end: "bottom top",
                  scrub: 0.8,
                },
              });
            });
          }
        });

        cleanup = () => context.revert();
      } catch {
        elements.forEach((element) => element.classList.add("is-visible"));
      }
    }

    void setupMotion();

    return () => {
      cancelled = true;
      cleanup?.();
      document.documentElement.classList.remove("js-archive-motion");
    };
  }, [revealModeEnabled]);

  if (!introVisible) return null;

  const isFinalStep = introStep === trailerLines.length - 1;

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-live="polite"
      className="fixed inset-0 z-[60] flex items-center justify-center bg-ivory px-6 text-center"
    >
      <div
        aria-hidden="true"
        className="absolute inset-0 bg-[radial-gradient(circle_at_50%_38%,rgba(191,162,219,0.22),transparent_32%),linear-gradient(115deg,rgba(255,250,243,0.96),rgba(248,241,232,0.98))]"
      />
      <div className="relative max-w-3xl">
        <p className="text-xs font-bold uppercase tracking-[0.24em] text-deep-lilac/70">Birthday trailer</p>
        <p className="mt-5 font-serif text-4xl font-semibold leading-tight text-espresso sm:text-6xl">
          {trailerLines[introStep]}
        </p>
        <div className="mt-10 flex flex-col items-center justify-center gap-3 sm:flex-row">
          {isFinalStep ? (
            <button
              type="button"
              onClick={skipIntro}
              className="rounded-full bg-deep-lilac px-6 py-3 text-sm font-bold text-ivory shadow-[var(--shadow-beautiful-sm)] transition-[background,transform] duration-500 ease-[var(--ease-weighted)] hover:-translate-y-0.5 hover:bg-[#6c5392] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-deep-lilac/45"
            >
              Enter My Archive
            </button>
          ) : null}
          <button
            type="button"
            onClick={skipIntro}
            className="rounded-full border border-lilac-border/70 bg-porcelain/86 px-5 py-3 text-sm font-bold text-espresso/68 shadow-[var(--shadow-beautiful-sm)] transition-[background,transform] duration-500 ease-[var(--ease-weighted)] hover:-translate-y-0.5 hover:bg-pale-lilac focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-deep-lilac/45"
          >
            Skip intro
          </button>
        </div>
      </div>
    </div>
  );
}
