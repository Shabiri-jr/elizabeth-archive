import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { ArchiveInteractionsProvider } from "@/components/archive/ArchiveInteractionsProvider";
import { OpenWhenLetters } from "@/components/archive/OpenWhenLetters";
import { PageIntro } from "@/components/ui/PageIntro";
import { SectionShell } from "@/components/ui/SectionShell";
import { getArchiveAccessState } from "@/lib/archive/access";
import { getFavouriteKeys } from "@/lib/archive/favourites";
import { getArchiveData } from "@/lib/archive/queries";

export const metadata: Metadata = {
  title: "Open When Letters | A Story Called Elizabeth",
};

export const dynamic = "force-dynamic";

export default async function OpenWhenLettersPage() {
  const access = await getArchiveAccessState();

  if (!access.allowed) {
    redirect("/archive/locked");
  }

  const [data, favouriteKeys] = await Promise.all([getArchiveData(), getFavouriteKeys()]);

  return (
    <ArchiveInteractionsProvider initialFavouriteKeys={favouriteKeys}>
      <SectionShell className="pt-14 sm:pt-20">
        <PageIntro
          eyebrow="Open When"
          title="Letters for later days."
          description="Some words are not for one day only. Some are for the days Elizabeth needs encouragement, peace, laughter, or a reminder that she is loved."
        />
        <div className="mt-12">
          <OpenWhenLetters letters={data.openWhenLetters} />
        </div>
      </SectionShell>
    </ArchiveInteractionsProvider>
  );
}

