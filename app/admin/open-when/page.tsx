import type { Metadata } from "next";
import { AdminShell } from "@/components/admin/AdminShell";
import { OpenWhenEditor } from "@/components/admin/OpenWhenEditor";
import { SectionShell } from "@/components/ui/SectionShell";
import { getOpenWhenLetters } from "@/lib/admin/queries";

export const metadata: Metadata = {
  title: "Open When Letters | Admin | A Story Called Elizabeth",
};

export const dynamic = "force-dynamic";

export default async function AdminOpenWhenPage() {
  const letters = await getOpenWhenLetters();

  return (
    <AdminShell
      eyebrow="Private letter drawer"
      title="Open When Letters"
      description="Create and edit the gentle letters Elizabeth can return to after her birthday when she needs encouragement, peace, laughter, or a reminder of her worth."
    >
      <SectionShell className="pt-0">
        <OpenWhenEditor letters={letters} />
      </SectionShell>
    </AdminShell>
  );
}

