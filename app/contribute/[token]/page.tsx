import type { Metadata } from "next";
import { AlreadySubmitted } from "@/components/contribute/AlreadySubmitted";
import { ExpiredInvite } from "@/components/contribute/ExpiredInvite";
import { InvalidInvite } from "@/components/contribute/InvalidInvite";
import { ContributorForm } from "@/components/forms/ContributorForm";
import { SectionShell } from "@/components/ui/SectionShell";
import { SoftCard } from "@/components/ui/SoftCard";
import { validateContributorToken } from "@/lib/tokens";

export const metadata: Metadata = {
  title: "Leave a Birthday Wish | A Story Called Elizabeth",
};

export const dynamic = "force-dynamic";

type ContributePageProps = {
  params: Promise<{
    token: string;
  }>;
};

export default async function ContributePage({ params }: ContributePageProps) {
  const { token } = await params;
  const decodedToken = decodeURIComponent(token);
  const invite = await validateContributorToken(decodedToken);

  if (invite.status === "expired") {
    return <ExpiredInvite />;
  }

  if (invite.status === "used") {
    return <AlreadySubmitted />;
  }

  if (invite.status !== "valid" || !invite.contributor) {
    return <InvalidInvite detail={invite.message} />;
  }

  return (
    <SectionShell className="pt-14 sm:pt-20" narrow>
      <div className="grid gap-8 lg:grid-cols-[0.95fr_1.05fr] lg:items-end">
        <div className="motion-reveal">
          <p className="mb-4 inline-flex rounded-full border border-lilac-border/70 bg-pale-lilac/68 px-3 py-1 text-[0.68rem] font-bold uppercase tracking-[0.22em] text-deep-lilac">
            Private contribution
          </p>
          <h1 className="font-serif text-5xl font-semibold leading-none text-espresso sm:text-6xl">
            Leave a Birthday Wish
          </h1>
          <p className="mt-5 max-w-2xl text-lg leading-8 text-espresso/66">
            Your words will become part of Elizabeth&apos;s birthday story.
          </p>
          <p className="mt-5 w-fit rounded-full border border-lilac-border/70 bg-pale-lilac/60 px-4 py-2 text-sm font-bold text-deep-lilac">
            {invite.contributor.name
              ? `Invite ready for ${invite.contributor.name}`
              : "Your private invite is ready"}
          </p>
        </div>
        <div className="motion-reveal rounded-[1.75rem] border border-lilac-border/60 bg-pale-lilac/42 p-5 [animation-delay:120ms]">
          <p className="font-serif text-2xl font-semibold text-espresso">Write it like a small letter.</p>
          <p className="mt-3 text-sm leading-7 text-espresso/62">
            It can be one sentence, one memory, or one prayer. The point is not perfect wording. The point is that
            Elizabeth hears your voice in it.
          </p>
        </div>
      </div>

      <SoftCard className="mt-10" innerClassName="p-5 sm:p-8">
        <ContributorForm token={decodedToken} contributor={invite.contributor} />
      </SoftCard>
    </SectionShell>
  );
}
