/* eslint-disable @next/next/no-img-element -- Archive media uses short-lived signed Supabase URLs. */
import type { CSSProperties } from "react";
import type { ArchiveMedia } from "@/lib/archive/queries";

type ElizabethSignatureSceneProps = {
  words: string[];
  heroImage?: ArchiveMedia;
};

type WordPlacement = {
  className: string;
  rotate: string;
  duration: string;
};

const fallbackWords = ["Radiant", "Kind", "Graceful", "Brilliant", "Soft", "Loved", "Stylish", "Golden"];

const placements: WordPlacement[] = [
  { className: "left-[7%] top-[14%]", rotate: "-7deg", duration: "7.8s" },
  { className: "right-[8%] top-[13%]", rotate: "5deg", duration: "8.4s" },
  { className: "left-[12%] top-[38%]", rotate: "4deg", duration: "7.2s" },
  { className: "right-[10%] top-[39%]", rotate: "-5deg", duration: "8.8s" },
  { className: "left-[15%] bottom-[18%]", rotate: "-3deg", duration: "7.6s" },
  { className: "right-[13%] bottom-[17%]", rotate: "6deg", duration: "8.2s" },
  { className: "left-[39%] top-[8%] hidden sm:inline-flex", rotate: "2deg", duration: "9s" },
  { className: "left-[42%] bottom-[8%] hidden sm:inline-flex", rotate: "-4deg", duration: "8.6s" },
];

function cleanWord(value: string) {
  return value
    .trim()
    .replace(/\s+/g, " ")
    .replace(/[^\w\s'-]/g, "")
    .toLowerCase()
    .replace(/\b[a-z]/g, (letter) => letter.toUpperCase());
}

function signatureWords(words: string[]) {
  const seen = new Set<string>();
  const cleaned = words
    .map(cleanWord)
    .filter((word) => {
      if (!word || word.length > 30) return false;
      const key = word.toLowerCase();
      if (seen.has(key)) return false;
      seen.add(key);
      return true;
    })
    .slice(0, placements.length);

  return cleaned.length ? cleaned : fallbackWords;
}

function wordStyle(index: number, placement: WordPlacement): CSSProperties {
  return {
    "--signature-word-rotate": placement.rotate,
    "--signature-word-delay": `${index * 180}ms`,
    "--signature-word-duration": placement.duration,
  } as CSSProperties;
}

export function ElizabethSignatureScene({ words, heroImage }: ElizabethSignatureSceneProps) {
  const visibleWords = signatureWords(words);

  return (
    <div data-archive-hero-item className="relative flex items-center justify-center p-6 sm:p-8 lg:p-10">
      <div
        data-parallax-soft
        className="relative min-h-[24rem] w-full max-w-[36rem] overflow-hidden rounded-[2.25rem] bg-warm-black/[0.045] p-1.5 ring-1 ring-espresso/8 shadow-[var(--shadow-beautiful-lg)] sm:min-h-[30rem]"
      >
        <div className="relative min-h-[calc(24rem-0.75rem)] overflow-hidden rounded-[calc(2.25rem-0.375rem)] border border-porcelain/80 bg-[linear-gradient(135deg,rgba(255,250,243,0.88),rgba(241,232,250,0.68)_52%,rgba(216,180,106,0.16))] sm:min-h-[calc(30rem-0.75rem)]">
          <div
            aria-hidden="true"
            className="signature-projector-glow absolute inset-8 rounded-full bg-[radial-gradient(circle,rgba(191,162,219,0.32),rgba(232,183,183,0.12)_42%,transparent_68%)] blur-xl"
          />
          <div
            aria-hidden="true"
            className="absolute inset-x-6 top-6 h-10 rounded-full border-y border-espresso/8 bg-[repeating-linear-gradient(90deg,rgba(15,12,10,0.10)_0_6px,transparent_6px_18px)] opacity-30"
          />
          <div
            aria-hidden="true"
            className="absolute inset-x-6 bottom-6 h-10 rounded-full border-y border-espresso/8 bg-[repeating-linear-gradient(90deg,rgba(15,12,10,0.10)_0_6px,transparent_6px_18px)] opacity-24"
          />

          {heroImage?.url ? (
            <div className="absolute right-8 top-20 hidden w-28 rotate-6 rounded-[1rem] bg-porcelain p-2 shadow-[var(--shadow-beautiful-md)] sm:block">
              <img
                src={heroImage.url}
                alt={heroImage.caption ?? "A soft film still from Elizabeth's archive"}
                width={320}
                height={420}
                decoding="async"
                loading="eager"
                className="aspect-[4/5] rounded-[0.75rem] object-cover opacity-80"
              />
            </div>
          ) : null}

          <div aria-hidden="true" className="absolute inset-0">
            {visibleWords.map((word, index) => {
              const placement = placements[index % placements.length];

              return (
                <span
                  key={`${word}-${index}`}
                  className={`signature-word-float absolute z-10 rounded-full border border-lilac-border/70 bg-porcelain/76 px-3 py-1.5 font-serif text-base font-semibold text-deep-lilac shadow-[var(--shadow-beautiful-sm)] backdrop-blur-sm sm:px-4 sm:py-2 sm:text-xl ${placement.className}`}
                  style={wordStyle(index, placement)}
                >
                  {word}
                </span>
              );
            })}
          </div>

          <div className="relative z-20 flex min-h-[calc(24rem-0.75rem)] flex-col items-center justify-center px-6 text-center sm:min-h-[calc(30rem-0.75rem)] sm:px-10">
            <p className="rounded-full border border-champagne/36 bg-ivory/62 px-4 py-2 text-[0.65rem] font-bold uppercase tracking-[0.24em] text-espresso/48 shadow-[var(--shadow-beautiful-sm)]">
              Private showing
            </p>
            <h2 className="mt-7 font-script text-[clamp(5rem,9vw,9rem)] leading-none text-deep-lilac drop-shadow-[0_18px_28px_rgba(123,95,163,0.18)]">
              Elizabeth
            </h2>
            <p className="mt-5 max-w-xs text-sm leading-7 text-espresso/58 sm:max-w-sm">
              A little movie of the words people keep reaching for when they think of you.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
