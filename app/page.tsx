import { Button } from "@/components/ui/Button";
import { CountdownBadge } from "@/components/ui/CountdownBadge";
import { PolaroidCard } from "@/components/ui/PolaroidCard";
import { SectionShell } from "@/components/ui/SectionShell";
import { SoftCard } from "@/components/ui/SoftCard";
import { appTitle } from "@/lib/constants";

export default function Home() {
  return (
    <>
      <SectionShell className="pb-12 pt-14 sm:pt-20 lg:pt-24">
        <div className="grid gap-10 lg:grid-cols-[1.04fr_0.96fr] lg:items-center">
          <div className="motion-reveal">
            <CountdownBadge />
            <h1 className="mt-8 max-w-4xl font-serif text-6xl font-semibold leading-[0.9] tracking-normal text-espresso sm:text-7xl lg:text-8xl">
              {appTitle}
            </h1>
            <p className="mt-6 max-w-xl text-xl leading-8 text-espresso/70">
              A private birthday archive for Elizabeth.
            </p>
            <p className="mt-8 max-w-2xl text-base leading-8 text-espresso/68 sm:text-lg">
              Something beautiful is being prepared for Elizabeth. Come back on August 19.
            </p>
            <div className="mt-9 flex flex-col gap-3 sm:flex-row sm:flex-wrap">
              <Button href="/contribute/test-elizabeth-invite" size="lg">
                Leave a Birthday Wish
              </Button>
              <Button href="/elizabeth/login" variant="secondary" size="lg">
                Elizabeth Login
              </Button>
              <Button href="/admin" variant="ghost" size="lg">
                Admin
              </Button>
            </div>
          </div>

          <div className="relative min-h-[30rem] motion-reveal [animation-delay:160ms]">
            <div className="absolute inset-x-8 top-8 h-[26rem] rounded-[2.25rem] border border-champagne/22 bg-porcelain/40" aria-hidden="true" />
            <PolaroidCard
              title="Elizabeth"
              tone="lilac"
              caption="A private cinematic story is being composed."
              className="absolute left-0 top-10 w-[68%] max-w-sm -rotate-3"
            />
            <PolaroidCard
              title="August 19"
              tone="blush"
              caption="Wishes, memories, photos, voices."
              className="absolute bottom-2 right-0 w-[62%] max-w-xs rotate-3"
            />
          </div>
        </div>
      </SectionShell>

      <SectionShell className="pt-6">
        <SoftCard>
          <div className="grid gap-8 md:grid-cols-3">
            {[
              ["Private", "Built around a protected invite experience and a personal reveal."],
              ["Cinematic", "Structured as chapters, frames, letters, voices, and gallery moments."],
              ["Ready to grow", "The foundation is prepared for approvals, media, and archive logic later."],
            ].map(([title, copy]) => (
              <div key={title} className="border-b border-espresso/8 pb-6 last:border-0 last:pb-0 md:border-b-0 md:border-r md:pb-0 md:pr-8 md:last:border-r-0">
                <p className="font-serif text-3xl font-semibold text-espresso">{title}</p>
                <p className="mt-3 text-sm leading-7 text-espresso/60">{copy}</p>
              </div>
            ))}
          </div>
        </SoftCard>
      </SectionShell>
    </>
  );
}
