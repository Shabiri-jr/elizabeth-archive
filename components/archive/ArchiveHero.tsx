/* eslint-disable @next/next/no-img-element -- Archive media uses short-lived signed Supabase URLs. */
import { ArrowDown, Eye, LockKeyhole } from "lucide-react";
import { closeElizabethArchive } from "@/app/archive/actions";
import { ElizabethSignatureScene } from "@/components/archive/ElizabethSignatureScene";
import type { ArchiveMedia } from "@/lib/archive/queries";

type ArchiveHeroProps = {
  isAdminPreview: boolean;
  heroImage?: ArchiveMedia;
  signatureWords?: string[];
};

export function ArchiveHero({ isAdminPreview, heroImage, signatureWords = [] }: ArchiveHeroProps) {
  return (
    <section
      id="opening-prelude"
      data-archive-section
      className="relative overflow-hidden px-4 py-16 sm:px-6 sm:py-20 lg:px-8 lg:py-28"
    >
      <div className="mx-auto max-w-7xl">
        <div className="relative min-h-[78svh] overflow-hidden rounded-[2.5rem] bg-warm-black/[0.04] p-1.5 ring-1 ring-espresso/7 shadow-[var(--shadow-beautiful-lg)]">
          <div className="relative grid min-h-[calc(78svh-0.75rem)] overflow-hidden rounded-[calc(2.5rem-0.375rem)] border border-porcelain/75 bg-porcelain/76 lg:grid-cols-[1.05fr_0.95fr]">
            {heroImage?.url ? (
              <img
                src={heroImage.url}
                alt={heroImage.caption ?? "A keepsake from Elizabeth's birthday archive"}
                width={1600}
                height={1200}
                decoding="async"
                className="absolute inset-0 h-full w-full object-cover opacity-20"
                loading="eager"
              />
            ) : null}
            <div
              aria-hidden="true"
              className="absolute inset-0 bg-[linear-gradient(115deg,rgba(255,250,243,0.96),rgba(255,250,243,0.86)_42%,rgba(241,232,250,0.58)),radial-gradient(circle_at_82%_18%,rgba(191,162,219,0.28),transparent_32%),radial-gradient(circle_at_18%_88%,rgba(216,180,106,0.18),transparent_36%)]"
            />

            <div className="pointer-events-none absolute inset-0 z-20 flex items-center justify-center px-6 lg:pr-48">
              <p className="font-script text-[clamp(4rem,14vw,10rem)] leading-none text-deep-lilac drop-shadow-[0_18px_28px_rgba(123,95,163,0.18)]">
                Who Knows?
              </p>
            </div>

            <div className="relative flex flex-col justify-between gap-12 p-7 sm:p-10 lg:p-14">
              <div data-archive-hero-item className="flex flex-wrap items-center gap-3">
                <span className="inline-flex items-center gap-2 rounded-full border border-lilac-border/70 bg-pale-lilac/78 px-3 py-2 text-xs font-bold uppercase tracking-[0.18em] text-deep-lilac shadow-[var(--shadow-beautiful-sm)]">
                  <LockKeyhole aria-hidden="true" className="size-3.5" />
                  Private archive
                </span>
                {isAdminPreview ? (
                  <span className="inline-flex items-center gap-2 rounded-full border border-champagne/50 bg-champagne/18 px-3 py-2 text-xs font-bold uppercase tracking-[0.18em] text-espresso shadow-[var(--shadow-beautiful-sm)]">
                    <Eye aria-hidden="true" className="size-3.5" />
                    Admin preview
                  </span>
                ) : null}
              </div>

              <div data-archive-hero-item className="max-w-4xl">
                <p className="text-sm font-bold uppercase tracking-[0.24em] text-deep-lilac/72">
                  Welcome, Elizabeth.
                </p>
                <h1 className="mt-5 max-w-4xl font-serif text-6xl font-semibold leading-[0.88] text-espresso sm:text-7xl lg:text-8xl">
                  A Story Called Elizabeth
                </h1>
                <p className="mt-7 max-w-2xl text-lg leading-9 text-espresso/66">
                  A birthday archive told by the people who love you. Scroll slowly.
                </p>
              </div>

              <div data-archive-hero-item className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                <div className="flex flex-col gap-3 sm:flex-row sm:flex-wrap">
                  <a
                    href="#dear-elizabeth"
                    className="group inline-flex w-fit items-center gap-3 rounded-full bg-deep-lilac px-5 py-3 text-sm font-bold text-ivory shadow-[var(--shadow-beautiful-sm)] ring-1 ring-deep-lilac/20 transition-[background,transform] duration-500 ease-[var(--ease-weighted)] hover:-translate-y-0.5 hover:bg-[#6c5392] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-deep-lilac/45"
                  >
                    Begin the story
                    <span className="flex size-8 items-center justify-center rounded-full bg-current/10 transition-transform duration-500 ease-[var(--ease-weighted)] group-hover:translate-y-1">
                      <ArrowDown aria-hidden="true" className="size-4" />
                    </span>
                  </a>
                  <a
                    href="/archive/keepsake"
                    className="inline-flex min-h-12 w-fit items-center rounded-full border border-lilac-border/70 bg-porcelain/78 px-5 text-sm font-bold text-espresso/72 shadow-[var(--shadow-beautiful-sm)] transition-[background,transform] duration-500 ease-[var(--ease-weighted)] hover:-translate-y-0.5 hover:bg-pale-lilac focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-deep-lilac/45"
                  >
                    Open Keepsake View
                  </a>
                </div>
                <form action={closeElizabethArchive}>
                  <button
                    type="submit"
                    className="inline-flex min-h-11 items-center rounded-full border border-lilac-border/70 bg-porcelain/78 px-4 text-sm font-bold text-espresso/66 shadow-[var(--shadow-beautiful-sm)] transition-[background,transform] duration-500 ease-[var(--ease-weighted)] hover:-translate-y-0.5 hover:bg-pale-lilac"
                  >
                    Close archive
                  </button>
                </form>
              </div>
            </div>

            <ElizabethSignatureScene words={signatureWords} heroImage={heroImage} />
          </div>
        </div>
      </div>
    </section>
  );
}
