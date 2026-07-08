import type { Metadata } from "next";
import { AdminShell } from "@/components/admin/AdminShell";
import { ArchiveSettingsForm } from "@/components/admin/ArchiveSettingsForm";
import { SectionShell } from "@/components/ui/SectionShell";
import { getArchiveSettings } from "@/lib/admin/queries";

export const metadata: Metadata = {
  title: "Settings | Admin | A Story Called Elizabeth",
};

export const dynamic = "force-dynamic";

export default async function AdminSettingsPage() {
  const settings = await getArchiveSettings();

  return (
    <AdminShell
      eyebrow="Reveal controls"
      title="Archive settings"
      description="Control contribution intake, archive live state, Elizabeth access readiness, and maintenance switches from one careful place."
    >
      <SectionShell className="pt-0">
        <ArchiveSettingsForm settings={settings} />
      </SectionShell>
    </AdminShell>
  );
}
