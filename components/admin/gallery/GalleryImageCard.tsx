/* eslint-disable @next/next/no-img-element -- Admin previews use short-lived signed Supabase URLs. */
import { ImageIcon } from "lucide-react";
import { GalleryCaptionEditor } from "@/components/admin/gallery/GalleryCaptionEditor";
import { GalleryModeSelector } from "@/components/admin/gallery/GalleryModeSelector";
import { PendingSubmitButton } from "@/components/admin/PendingSubmitButton";
import { StatusBadge } from "@/components/admin/StatusBadge";
import { updateGalleryImage } from "@/lib/admin/gallery-actions";
import type { AdminMediaAsset } from "@/lib/admin/queries";

type GalleryImageCardProps = {
  media: AdminMediaAsset;
};

function fileNameFromPath(path: string) {
  return path.split("/").pop() ?? path;
}

export function GalleryImageCard({ media }: GalleryImageCardProps) {
  return (
    <article className="rounded-[1.75rem] bg-warm-black/[0.035] p-1.5 ring-1 ring-espresso/7 shadow-[var(--shadow-beautiful-md)]">
      <form
        action={updateGalleryImage}
        className="h-full rounded-[calc(1.75rem-0.375rem)] border border-porcelain/80 bg-porcelain/76 p-4"
      >
        <input type="hidden" name="mediaId" value={media.id} />

        <div className="overflow-hidden rounded-[1.2rem] border border-lilac-border/45 bg-pale-lilac/28">
          {media.signedUrl ? (
            <img
              src={media.signedUrl}
              alt={media.admin_caption ?? media.caption ?? `Gallery image from ${media.contributorName ?? "a contributor"}`}
              width={1200}
              height={900}
              decoding="async"
              loading="lazy"
              className="aspect-[4/3] w-full object-cover"
            />
          ) : (
            <div className="flex aspect-[4/3] flex-col items-center justify-center gap-3 p-5 text-center">
              <ImageIcon aria-hidden="true" className="size-12 text-deep-lilac" strokeWidth={1.25} />
              <p className="text-sm leading-6 text-espresso/58">Preview could not be signed for this private file.</p>
            </div>
          )}
        </div>

        <div className="mt-4 flex flex-wrap items-center gap-2">
          <StatusBadge status={media.status} />
          {media.featured ? <StatusBadge status="visible" label="Featured" /> : null}
          {media.gallery_mode ? (
            <span className="rounded-full border border-lilac-border/55 bg-pale-lilac/36 px-3 py-1 text-xs font-bold uppercase tracking-[0.14em] text-deep-lilac">
              {media.gallery_mode}
            </span>
          ) : null}
        </div>

        <h2 className="mt-4 break-words font-serif text-2xl font-semibold leading-tight text-espresso">
          {media.admin_caption ?? media.caption ?? fileNameFromPath(media.storage_path)}
        </h2>
        <p className="mt-2 text-sm leading-6 text-espresso/58">
          {media.contributorName ?? media.submissionName ?? "Unknown contributor"}
          {media.contributorRelationship ? ` / ${media.contributorRelationship}` : ""}
        </p>
        {media.submissionStatus ? (
          <p className="mt-2 text-xs font-bold uppercase tracking-[0.14em] text-espresso/42">
            Linked submission: {media.submissionStatus}
          </p>
        ) : null}

        <div className="mt-5 grid gap-4 rounded-[1.35rem] border border-lilac-border/45 bg-ivory/48 p-4">
          <GalleryCaptionEditor media={media} />

          <div className="grid gap-3 sm:grid-cols-3">
            <GalleryModeSelector defaultValue={media.gallery_mode} />
            <label className="space-y-2">
              <span className="text-sm font-bold text-espresso">Display order</span>
              <input
                type="number"
                min={0}
                max={9999}
                name="displayOrder"
                defaultValue={media.display_order ?? ""}
                placeholder="0"
                className="min-h-12 w-full rounded-2xl border border-lilac-border/45 bg-ivory/70 px-4 text-sm font-semibold text-espresso outline-none focus:border-deep-lilac/45 focus:ring-4 focus:ring-lilac-primary/16"
              />
            </label>
            <label className="space-y-2">
              <span className="text-sm font-bold text-espresso">Status</span>
              <select
                name="status"
                defaultValue={media.status}
                className="min-h-12 w-full rounded-2xl border border-lilac-border/45 bg-ivory/70 px-4 text-sm font-semibold text-espresso outline-none focus:border-deep-lilac/45 focus:ring-4 focus:ring-lilac-primary/16"
              >
                <option value="pending">Pending</option>
                <option value="approved">Approved</option>
                <option value="rejected">Rejected</option>
              </select>
            </label>
          </div>

          <label className="flex items-start gap-3 rounded-2xl border border-lilac-border/35 bg-porcelain/64 p-3 text-sm leading-6 text-espresso/62">
            <input
              type="checkbox"
              name="featured"
              defaultChecked={media.featured}
              className="mt-1 size-4 rounded border-lilac-border text-deep-lilac accent-deep-lilac"
            />
            Feature this photo in Floating Photo Memories.
          </label>
        </div>

        <div className="mt-4 flex justify-end">
          <PendingSubmitButton pendingLabel="Saving gallery image...">Save gallery settings</PendingSubmitButton>
        </div>
      </form>
    </article>
  );
}
