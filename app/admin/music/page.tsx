import type { Metadata } from "next";
import { AdminMusicManager } from "@/components/admin/music/AdminMusicManager";
import { AdminShell } from "@/components/admin/AdminShell";
import { SectionShell } from "@/components/ui/SectionShell";
import { SoftCard } from "@/components/ui/SoftCard";
import { getAdminMusicState } from "@/lib/admin/music-queries";

export const metadata: Metadata = {
  title: "Music | Admin | A Story Called Elizabeth",
};

export const dynamic = "force-dynamic";

export default async function AdminMusicPage() {
  const musicState = await getAdminMusicState();

  return (
    <AdminShell
      eyebrow="Sound atmosphere"
      title="Music"
      description="Upload and manage the optional background track for Elizabeth's archive. The archive never autoplays loud audio; Elizabeth chooses whether to listen."
    >
      <SectionShell className="pt-0">
        <div className="space-y-6">
          <SoftCard>
            <p className="text-sm font-bold uppercase tracking-[0.18em] text-deep-lilac/72">Music safety note</p>
            <p className="mt-3 max-w-3xl text-sm leading-7 text-espresso/58">
              Only upload music you own, created yourself, or have permission to use. Keep the default volume soft so the
              archive stays cinematic and gentle.
            </p>
          </SoftCard>
          <AdminMusicManager state={musicState} />
        </div>
      </SectionShell>
    </AdminShell>
  );
}
