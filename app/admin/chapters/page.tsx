import type { Metadata } from "next";
import { AdminShell } from "@/components/admin/AdminShell";
import { ChapterEditor } from "@/components/admin/ChapterEditor";
import { SectionShell } from "@/components/ui/SectionShell";
import { getChapters } from "@/lib/admin/queries";

export const metadata: Metadata = {
  title: "Chapters | Admin | A Story Called Elizabeth",
};

export const dynamic = "force-dynamic";

export default async function AdminChaptersPage() {
  const chapters = await getChapters();

  return (
    <AdminShell
      eyebrow="Editable story spine"
      title="Chapters"
      description="Shape the chapter titles, subtitles, visibility, and body content used by Elizabeth's final archive."
    >
      <SectionShell className="pt-0">
        <ChapterEditor chapters={chapters} />
      </SectionShell>
    </AdminShell>
  );
}
