import type { Metadata } from "next";
import { AdminShell } from "@/components/admin/AdminShell";
import { MediaGrid } from "@/components/admin/MediaGrid";
import { SectionShell } from "@/components/ui/SectionShell";
import { SoftCard } from "@/components/ui/SoftCard";
import { getMediaAssets } from "@/lib/admin/queries";
import type { MediaAssetType, SubmissionStatus } from "@/lib/types";

type MediaPageProps = {
  searchParams?: Promise<{
    status?: string;
    type?: string;
  }>;
};

export const metadata: Metadata = {
  title: "Media | Admin | A Story Called Elizabeth",
};

export const dynamic = "force-dynamic";

function parseStatus(value?: string): SubmissionStatus | "all" {
  return value === "pending" || value === "approved" || value === "rejected" ? value : "all";
}

function parseType(value?: string): MediaAssetType | "all" {
  return value === "image" || value === "audio" || value === "video" ? value : "all";
}

export default async function AdminMediaPage({ searchParams }: MediaPageProps) {
  const params = searchParams ? await searchParams : {};
  const filters = {
    status: parseStatus(params.status),
    type: parseType(params.type),
  };
  const mediaAssets = await getMediaAssets(filters);

  return (
    <AdminShell
      eyebrow="Keepsake review"
      title="Media"
      description="Preview uploaded photos, voice notes, and short videos from private contributor submissions before they can appear in the final archive."
    >
      <SectionShell className="pt-0">
        <div className="space-y-6">
          <SoftCard>
            <p className="text-sm font-bold uppercase tracking-[0.18em] text-deep-lilac/72">Media note</p>
            <p className="mt-3 max-w-3xl text-sm leading-7 text-espresso/58">
              Approve media separately from the written message. The final archive only shows approved files, and media
              attached to rejected submissions stays hidden.
            </p>
          </SoftCard>
          <MediaGrid mediaAssets={mediaAssets} filters={filters} />
        </div>
      </SectionShell>
    </AdminShell>
  );
}
