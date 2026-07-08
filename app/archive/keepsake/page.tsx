import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { KeepsakeBook } from "@/components/archive/KeepsakeBook";
import { getArchiveAccessState } from "@/lib/archive/access";
import { getArchiveData } from "@/lib/archive/queries";

export const metadata: Metadata = {
  title: "Keepsake View | A Story Called Elizabeth",
};

export const dynamic = "force-dynamic";

export default async function KeepsakePage() {
  const access = await getArchiveAccessState();

  if (!access.allowed) {
    redirect("/archive/locked");
  }

  const data = await getArchiveData();

  return <KeepsakeBook data={data} isAdminPreview={access.isAdminPreview} />;
}

