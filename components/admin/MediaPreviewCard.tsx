/* eslint-disable @next/next/no-img-element -- Private signed Supabase URLs should stay outside the image optimizer. */
import { FileAudio, FileVideo, ImageIcon } from "lucide-react";
import { ConfirmDialog } from "@/components/admin/ConfirmDialog";
import { PendingSubmitButton } from "@/components/admin/PendingSubmitButton";
import { StatusBadge } from "@/components/admin/StatusBadge";
import { deleteMedia, setMediaStatus } from "@/lib/admin/actions";
import type { AdminMediaAsset } from "@/lib/admin/queries";

type MediaPreviewCardProps = {
  media: AdminMediaAsset;
};

function fileNameFromPath(path: string) {
  return path.split("/").pop() ?? path;
}

export function MediaPreviewCard({ media }: MediaPreviewCardProps) {
  return (
    <article className="rounded-[1.5rem] bg-warm-black/[0.035] p-1.5 ring-1 ring-espresso/7 shadow-[var(--shadow-beautiful-md)]">
      <div className="h-full rounded-[calc(1.5rem-0.375rem)] border border-porcelain/80 bg-porcelain/76 p-4">
        <div className="overflow-hidden rounded-[1.1rem] border border-lilac-border/45 bg-pale-lilac/28">
          {media.signedUrl && media.type === "image" ? (
            <img
              src={media.signedUrl}
              alt={media.caption ?? `Uploaded image from ${media.contributorName ?? "a contributor"}`}
              width={1200}
              height={900}
              decoding="async"
              loading="lazy"
              className="aspect-[4/3] w-full object-cover"
            />
          ) : media.signedUrl && media.type === "audio" ? (
            <div className="flex aspect-[4/3] flex-col items-center justify-center gap-5 p-5">
              <FileAudio aria-hidden="true" className="size-12 text-deep-lilac" strokeWidth={1.25} />
              <audio controls preload="metadata" src={media.signedUrl} className="w-full" />
            </div>
          ) : media.signedUrl && media.type === "video" ? (
            <video
              controls
              preload="metadata"
              playsInline
              src={media.signedUrl}
              className="aspect-[4/3] w-full bg-warm-black object-contain"
            />
          ) : (
            <div className="flex aspect-[4/3] flex-col items-center justify-center gap-3 p-5 text-center">
              {media.type === "video" ? (
                <FileVideo aria-hidden="true" className="size-12 text-deep-lilac" strokeWidth={1.25} />
              ) : (
                <ImageIcon aria-hidden="true" className="size-12 text-deep-lilac" strokeWidth={1.25} />
              )}
              <p className="text-sm leading-6 text-espresso/58">Preview could not be signed for this private file.</p>
            </div>
          )}
        </div>

        <div className="mt-4 flex flex-wrap items-center gap-2">
          <StatusBadge status={media.status} />
          <span className="rounded-full border border-lilac-border/55 bg-pale-lilac/36 px-3 py-1 text-xs font-bold uppercase tracking-[0.14em] text-espresso/56">
            {media.type}
          </span>
        </div>

        <h2 className="mt-4 break-words font-serif text-2xl font-semibold leading-tight text-espresso">
          {fileNameFromPath(media.storage_path)}
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

        <div className="mt-5 flex flex-wrap gap-2">
          <form action={setMediaStatus}>
            <input type="hidden" name="mediaId" value={media.id} />
            <PendingSubmitButton name="status" value="approved" tone="approve" pendingLabel="Approving...">
              Approve
            </PendingSubmitButton>
          </form>
          <form action={setMediaStatus}>
            <input type="hidden" name="mediaId" value={media.id} />
            <PendingSubmitButton name="status" value="rejected" tone="reject" pendingLabel="Rejecting...">
              Reject
            </PendingSubmitButton>
          </form>
          <form action={setMediaStatus}>
            <input type="hidden" name="mediaId" value={media.id} />
            <PendingSubmitButton name="status" value="pending" tone="quiet" pendingLabel="Restoring...">
              Pending
            </PendingSubmitButton>
          </form>
        </div>

        <form action={deleteMedia} className="mt-4 space-y-3 rounded-2xl border border-espresso/10 bg-ivory/48 p-3">
          <input type="hidden" name="mediaId" value={media.id} />
          <label className="flex items-start gap-3 text-sm leading-6 text-espresso/62">
            <input
              type="checkbox"
              name="deleteFile"
              defaultChecked
              className="mt-1 size-4 rounded border-lilac-border text-deep-lilac accent-deep-lilac"
            />
            Also delete the private storage file.
          </label>
          <ConfirmDialog message="Delete this media record? If checked, the storage file will also be removed.">
            Delete media
          </ConfirmDialog>
        </form>
      </div>
    </article>
  );
}
