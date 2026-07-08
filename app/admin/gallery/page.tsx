import type { Metadata } from "next";
import { AdminGalleryManager } from "@/components/admin/gallery/AdminGalleryManager";
import { AdminShell } from "@/components/admin/AdminShell";
import { SectionShell } from "@/components/ui/SectionShell";
import { SoftCard } from "@/components/ui/SoftCard";
import { getGalleryImages } from "@/lib/admin/queries";

export const metadata: Metadata = {
  title: "Gallery | Admin | A Story Called Elizabeth",
};

export const dynamic = "force-dynamic";

export default async function AdminGalleryPage() {
  const images = await getGalleryImages();

  return (
    <AdminShell
      eyebrow="Memory gallery"
      title="Gallery"
      description="Shape approved photos into Elizabeth's emotional gallery: captions, featured memories, film-strip moments, timeline labels, and gentle display order."
    >
      <SectionShell className="pt-0">
        <div className="space-y-6">
          <SoftCard>
            <p className="text-sm font-bold uppercase tracking-[0.18em] text-deep-lilac/72">Gallery note</p>
            <p className="mt-3 max-w-3xl text-sm leading-7 text-espresso/58">
              Only approved image media linked to approved submissions appears in Elizabeth&apos;s archive. Use this room to
              make each photo feel connected to a moment, memory, or person before launch.
            </p>
          </SoftCard>
          <AdminGalleryManager images={images} />
        </div>
      </SectionShell>
    </AdminShell>
  );
}
