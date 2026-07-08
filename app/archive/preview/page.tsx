import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { ArchiveExperience } from "@/components/archive/ArchiveExperience";
import { getArchiveAccessState } from "@/lib/archive/access";
import { getFavouriteKeys } from "@/lib/archive/favourites";
import { getArchiveData } from "@/lib/archive/queries";

export const metadata: Metadata = {
  title: "Archive Preview | A Story Called Elizabeth",
};

export const dynamic = "force-dynamic";

export default async function ArchivePreviewPage() {
  const access = await getArchiveAccessState();

  if (!access.isAdminPreview) {
    redirect(access.allowed ? "/archive" : "/archive/locked");
  }

  const [data, favouriteKeys] = await Promise.all([getArchiveData(), getFavouriteKeys()]);

  return <ArchiveExperience data={data} access={access} favouriteKeys={favouriteKeys} />;
}
