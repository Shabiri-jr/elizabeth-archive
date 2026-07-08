type FinalLetterProps = {
  body?: string | null;
};

const fallbackLetter =
  "I built this so you can always come back and remember that your life is not small, your presence is not ordinary, and the people around you see more in you than you sometimes admit.";

export function FinalLetter({ body }: FinalLetterProps) {
  return (
    <div
      data-final-letter
      className="rounded-[2rem] bg-warm-black/[0.035] p-1.5 ring-1 ring-espresso/7 shadow-[var(--shadow-beautiful-lg)]"
    >
      <div className="rounded-[calc(2rem-0.375rem)] border border-porcelain/80 bg-porcelain/76 p-7 sm:p-10 lg:p-14">
        <p className="text-sm font-bold uppercase tracking-[0.22em] text-deep-lilac/72">Final Chapter</p>
        <p className="mt-7 whitespace-pre-wrap font-serif text-3xl leading-tight text-espresso sm:text-4xl lg:text-5xl">
          {body?.trim() || fallbackLetter}
        </p>
        <div className="mt-10 h-px w-full bg-gradient-to-r from-lilac-primary/70 via-champagne/50 to-transparent" />
        <p className="mt-8 max-w-2xl text-lg leading-9 text-espresso/66">
          This archive does not end today. It stays here for the days you need to remember how loved you are.
        </p>
      </div>
    </div>
  );
}
