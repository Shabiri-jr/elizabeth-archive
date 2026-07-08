import type { Metadata } from "next";
import { ElizabethAccessForm } from "@/app/elizabeth/login/ElizabethAccessForm";
import { SectionShell } from "@/components/ui/SectionShell";
import { SoftCard } from "@/components/ui/SoftCard";

export const metadata: Metadata = {
  title: "Elizabeth Login | A Story Called Elizabeth",
};

export default function ElizabethLoginPage() {
  return (
    <SectionShell className="pt-16 sm:pt-24" narrow>
      <div className="grid gap-8 lg:grid-cols-[0.95fr_1.05fr] lg:items-center">
        <div className="motion-reveal">
          <p className="mb-4 inline-flex rounded-full border border-lilac-border/70 bg-pale-lilac/68 px-3 py-1 text-[0.68rem] font-bold uppercase tracking-[0.22em] text-deep-lilac">
            Private access
          </p>
          <h1 className="font-serif text-5xl font-semibold leading-none text-espresso sm:text-6xl">
            Welcome, Elizabeth.
          </h1>
          <p className="mt-5 max-w-lg text-lg leading-8 text-espresso/66">
            This story belongs to you.
          </p>
        </div>

        <SoftCard className="motion-reveal [animation-delay:140ms]" innerClassName="relative overflow-hidden p-6 sm:p-8">
          <div
            aria-hidden="true"
            className="absolute -right-14 -top-16 size-40 rounded-full bg-lilac-primary/18 blur-3xl"
          />
          <div className="space-y-7">
            <div>
              <h2 className="font-serif text-3xl font-semibold text-espresso">Open the archive</h2>
              <p className="mt-3 text-sm leading-7 text-espresso/60">
                Enter the private access code when the archive is ready for you.
              </p>
            </div>
            <ElizabethAccessForm />
          </div>
        </SoftCard>
      </div>
    </SectionShell>
  );
}
