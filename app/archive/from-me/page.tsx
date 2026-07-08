import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { PrivateFromMeRoom } from "@/components/archive/PrivateFromMeRoom";
import { PageIntro } from "@/components/ui/PageIntro";
import { SectionShell } from "@/components/ui/SectionShell";
import { getArchiveAccessState } from "@/lib/archive/access";
import { getArchiveData } from "@/lib/archive/queries";

export const metadata: Metadata = {
  title: "From Me | A Story Called Elizabeth",
};

export const dynamic = "force-dynamic";

export default async function ArchiveFromMePage() {
  const access = await getArchiveAccessState();

  if (!access.allowed) {
    redirect("/archive/locked");
  }

  const data = await getArchiveData();
  const privateFromMe = data.chapters.find((chapter) => chapter.slug === "private-from-me-room");

  return (
    <SectionShell className="pt-14 sm:pt-20">
      <PageIntro
        eyebrow="Private room"
        title="From Me"
        description="This room is a little more personal. It is separate from the public chapter flow and meant only for Elizabeth."
      />
      <div className="mt-12">
        <PrivateFromMeRoom
          title={privateFromMe?.title ?? "Private From Me Room"}
          subtitle={privateFromMe?.subtitle ?? "A little more personal"}
          body={privateFromMe?.body}
        />
      </div>
    </SectionShell>
  );
}

