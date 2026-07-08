import type { Metadata } from "next";
import { Button } from "@/components/ui/Button";
import { PolaroidCard } from "@/components/ui/PolaroidCard";
import { SectionShell } from "@/components/ui/SectionShell";

export const metadata: Metadata = {
  title: "For Elizabeth | A Story Called Elizabeth",
  description: "A private birthday invitation for Elizabeth.",
};

export default function ForElizabethPage() {
  return (
    <SectionShell className="relative min-h-[calc(100svh-9rem)] pb-16 pt-16 sm:pt-24 lg:pt-28">
      <div
        aria-hidden="true"
        className="absolute left-1/2 top-16 -z-10 size-[28rem] -translate-x-1/2 rounded-full bg-lilac-primary/20 blur-3xl"
      />
      <div className="mx-auto grid max-w-6xl gap-10 lg:grid-cols-[1.02fr_0.98fr] lg:items-center">
        <div className="motion-reveal">
          <p className="mb-5 inline-flex rounded-full border border-lilac-border/70 bg-pale-lilac/72 px-3 py-1 text-[0.68rem] font-bold uppercase tracking-[0.22em] text-[#6c5392]">
            Private birthday invitation
          </p>
          <h1 className="max-w-4xl font-serif text-6xl font-semibold leading-[0.9] text-espresso sm:text-7xl lg:text-8xl">
            Elizabeth, this was made for you.
          </h1>
          <p className="mt-7 max-w-2xl text-lg leading-9 text-espresso/68">
            A private birthday archive, told by people who love you.
          </p>
          <div className="mt-9 flex flex-col gap-3 sm:flex-row sm:items-center">
            <Button href="/elizabeth/login" size="lg">
              Open My Story
            </Button>
            <p className="text-sm font-semibold leading-6 text-espresso/56">Use your private access code.</p>
          </div>
        </div>

        <div className="relative min-h-[28rem] motion-reveal [animation-delay:140ms]">
          <div
            aria-hidden="true"
            className="absolute inset-x-6 top-8 h-[24rem] rounded-[2.35rem] border border-champagne/25 bg-porcelain/42"
          />
          <PolaroidCard
            title="For Elizabeth"
            tone="lilac"
            caption="Open only when you are ready to receive your birthday story."
            className="absolute left-1/2 top-8 w-[78%] max-w-sm -translate-x-1/2 rotate-2"
          />
          <div className="absolute bottom-5 left-6 right-6 rounded-[1.5rem] border border-lilac-border/60 bg-porcelain/82 p-5 shadow-[var(--shadow-beautiful-sm)]">
            <p className="font-serif text-2xl font-semibold text-espresso">A quiet surprise is waiting.</p>
            <p className="mt-2 text-sm leading-7 text-espresso/62">
              No rush. Breathe first, then open the door.
            </p>
          </div>
        </div>
      </div>
    </SectionShell>
  );
}

