import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { LockedArchive } from "@/components/archive/LockedArchive";
import { getArchiveAccessState } from "@/lib/archive/access";

export const metadata: Metadata = {
  title: "Archive Locked | A Story Called Elizabeth",
};

export const dynamic = "force-dynamic";

export default async function LockedArchivePage() {
  const access = await getArchiveAccessState();

  if (access.allowed) {
    redirect(access.isAdminPreview ? "/archive/preview" : "/archive");
  }

  return <LockedArchive access={access} />;
}
