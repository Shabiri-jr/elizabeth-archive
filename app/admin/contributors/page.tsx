import type { Metadata } from "next";
import { AdminShell } from "@/components/admin/AdminShell";
import { ContributorLinksTable } from "@/components/admin/ContributorLinksTable";
import { CreateContributorLinkDialog } from "@/components/admin/CreateContributorLinkDialog";
import { SectionShell } from "@/components/ui/SectionShell";
import { SoftCard } from "@/components/ui/SoftCard";
import { getContributors } from "@/lib/admin/queries";

export const metadata: Metadata = {
  title: "Contributors | Admin | A Story Called Elizabeth",
};

export const dynamic = "force-dynamic";

export default async function AdminContributorsPage() {
  const contributors = await getContributors();

  return (
    <AdminShell
      eyebrow="Private invitations"
      title="Contributor links"
      description="Create secure private links, copy them for Elizabeth's people, and watch how many submissions each invite has received."
    >
      <SectionShell className="pt-0">
        <div className="space-y-8">
          <SoftCard>
            <p className="text-sm font-bold uppercase tracking-[0.18em] text-deep-lilac/72">Contributor note</p>
            <p className="mt-3 max-w-3xl text-sm leading-7 text-espresso/58">
              Keep contributions open until you are done collecting wishes. Each private link can have its own expiry
              date and submission limit, so send only the link meant for that person.
            </p>
          </SoftCard>
          <CreateContributorLinkDialog />
          <ContributorLinksTable contributors={contributors} />
        </div>
      </SectionShell>
    </AdminShell>
  );
}
