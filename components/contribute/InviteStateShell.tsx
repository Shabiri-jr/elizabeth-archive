import type { ReactNode } from "react";
import { Button } from "@/components/ui/Button";
import { PageIntro } from "@/components/ui/PageIntro";
import { SectionShell } from "@/components/ui/SectionShell";
import { SoftCard } from "@/components/ui/SoftCard";

type InviteStateShellProps = {
  eyebrow: string;
  title: string;
  body: string;
  note?: string;
  buttonLabel?: string;
  buttonHref?: string;
  children?: ReactNode;
};

export function InviteStateShell({
  eyebrow,
  title,
  body,
  note,
  buttonLabel = "Return Home",
  buttonHref = "/",
  children,
}: InviteStateShellProps) {
  return (
    <SectionShell className="pt-16 sm:pt-24" narrow>
      <div className="grid gap-8 lg:grid-cols-[0.95fr_1.05fr] lg:items-center">
        <PageIntro eyebrow={eyebrow} title={title} description={body} />
        <SoftCard className="motion-reveal [animation-delay:140ms]" innerClassName="relative overflow-hidden p-6 sm:p-8">
          <div
            aria-hidden="true"
            className="absolute -right-14 -top-16 size-40 rounded-full bg-lilac-primary/18 blur-3xl"
          />
          <div className="relative space-y-6">
            {children ?? (
              <div>
                <p className="text-sm font-bold uppercase tracking-[0.2em] text-deep-lilac/75">
                  Private archive note
                </p>
                <h2 className="mt-3 font-serif text-3xl font-semibold text-espresso">{title}</h2>
                <p className="mt-3 text-sm leading-7 text-espresso/62">{body}</p>
              </div>
            )}
            {note ? (
              <p className="rounded-2xl border border-lilac-border/60 bg-pale-lilac/38 px-4 py-3 text-sm leading-6 text-espresso/64">
                {note}
              </p>
            ) : null}
            <Button href={buttonHref} size="lg" variant="secondary">
              {buttonLabel}
            </Button>
          </div>
        </SoftCard>
      </div>
    </SectionShell>
  );
}
