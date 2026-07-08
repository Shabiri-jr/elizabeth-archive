import { Button } from "@/components/ui/Button";
import { getCountdownToDate, formatBirthdayDate } from "@/lib/archive/formatters";
import type { ArchiveAccessState } from "@/lib/archive/access";

type LockedArchiveProps = {
  access: ArchiveAccessState;
};

export function LockedArchive({ access }: LockedArchiveProps) {
  const countdown = getCountdownToDate(access.settings?.birthday_date);
  const birthdayDate = formatBirthdayDate(access.settings?.birthday_date);

  return (
    <section className="px-4 py-16 sm:px-6 sm:py-24 lg:px-8">
      <div className="mx-auto grid max-w-6xl gap-8 lg:grid-cols-[0.95fr_1.05fr] lg:items-center">
        <div className="motion-reveal">
          <p className="mb-4 inline-flex rounded-full border border-lilac-border/70 bg-pale-lilac/68 px-3 py-1 text-[0.68rem] font-bold uppercase tracking-[0.22em] text-deep-lilac">
            Private reveal
          </p>
          <h1 className="max-w-3xl font-serif text-5xl font-semibold leading-none text-espresso sm:text-6xl">
            {access.title}
          </h1>
          <p className="mt-6 max-w-xl text-lg leading-9 text-espresso/66">{access.message}</p>
        </div>

        <div className="rounded-[2rem] bg-warm-black/[0.035] p-1.5 ring-1 ring-espresso/7 shadow-[var(--shadow-beautiful-lg)]">
          <div className="relative overflow-hidden rounded-[calc(2rem-0.375rem)] border border-porcelain/80 bg-porcelain/76 p-6 sm:p-8">
            <div
              aria-hidden="true"
              className="absolute -right-14 -top-16 size-44 rounded-full bg-lilac-primary/20 blur-3xl"
            />
            <div className="relative">
              <div className="rotate-2 rounded-[1.65rem] bg-porcelain p-3 shadow-[var(--shadow-beautiful-md)]">
                <div className="flex aspect-[4/5] flex-col items-center justify-center rounded-[1.2rem] border border-lilac-border/55 bg-gradient-to-br from-pale-lilac via-porcelain to-champagne/18 px-8 text-center">
                  <p className="font-serif text-5xl font-semibold leading-none text-espresso">{birthdayDate}</p>
                  <p className="mt-4 text-sm uppercase tracking-[0.2em] text-espresso/44">{countdown.label}</p>
                </div>
                <p className="px-2 pb-1 pt-3 text-sm leading-6 text-espresso/68">
                  The archive is being kept private until the right moment.
                </p>
              </div>

              <div className="mt-7 flex flex-col gap-3 sm:flex-row sm:flex-wrap">
                <Button href="/elizabeth/login" size="lg">
                  Back to Login
                </Button>
                <Button href="/" variant="secondary" size="lg">
                  Return Home
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
