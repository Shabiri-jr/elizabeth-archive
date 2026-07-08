import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { ArchiveInteractionsProvider } from "@/components/archive/ArchiveInteractionsProvider";
import { FavouriteMoments } from "@/components/archive/FavouriteMoments";
import { PageIntro } from "@/components/ui/PageIntro";
import { SectionShell } from "@/components/ui/SectionShell";
import { getArchiveAccessState } from "@/lib/archive/access";
import { getFavouriteKeys } from "@/lib/archive/favourites";
import { getArchiveData } from "@/lib/archive/queries";

export const metadata: Metadata = {
  title: "Favourites | A Story Called Elizabeth",
};

export const dynamic = "force-dynamic";

export default async function ArchiveFavouritesPage() {
  const access = await getArchiveAccessState();

  if (!access.allowed) {
    redirect("/archive/locked");
  }

  const [data, favouriteKeys] = await Promise.all([getArchiveData(), getFavouriteKeys()]);

  return (
    <ArchiveInteractionsProvider initialFavouriteKeys={favouriteKeys}>
      <SectionShell className="pt-14 sm:pt-20">
        <PageIntro
          eyebrow="Elizabeth's Favourites"
          title="The moments you chose to keep close."
          description="Messages, memories, photos, wishes, voices, and letters saved from the archive gather here."
        />
        <div className="mt-12">
          <FavouriteMoments data={data} favouriteKeys={favouriteKeys} />
        </div>
      </SectionShell>
    </ArchiveInteractionsProvider>
  );
}

