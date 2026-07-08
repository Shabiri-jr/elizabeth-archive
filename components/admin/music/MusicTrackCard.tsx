import { Music2 } from "lucide-react";
import { ConfirmDialog } from "@/components/admin/ConfirmDialog";
import { PendingSubmitButton } from "@/components/admin/PendingSubmitButton";
import { StatusBadge } from "@/components/admin/StatusBadge";
import { deleteMusicTrack, updateMusicTrack } from "@/lib/admin/music-actions";
import type { AdminMusicTrack } from "@/lib/admin/music-queries";

type MusicTrackCardProps = {
  track: AdminMusicTrack;
};

const inputClasses =
  "min-h-12 w-full rounded-2xl border border-lilac-border/45 bg-ivory/70 px-4 text-sm text-espresso outline-none focus:border-deep-lilac/45 focus:ring-4 focus:ring-lilac-primary/16";

export function MusicTrackCard({ track }: MusicTrackCardProps) {
  return (
    <article className="rounded-[1.75rem] bg-warm-black/[0.035] p-1.5 ring-1 ring-espresso/7 shadow-[var(--shadow-beautiful-md)]">
      <div className="rounded-[calc(1.75rem-0.375rem)] border border-porcelain/80 bg-porcelain/76 p-5">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div className="flex items-start gap-4">
            <div className="flex size-12 shrink-0 items-center justify-center rounded-full bg-pale-lilac text-deep-lilac">
              <Music2 aria-hidden="true" className="size-5" strokeWidth={1.5} />
            </div>
            <div>
              <div className="flex flex-wrap gap-2">
                <StatusBadge status={track.is_active ? "live" : "locked"} label={track.is_active ? "Active" : "Inactive"} />
              </div>
              <h2 className="mt-3 font-serif text-3xl font-semibold leading-tight text-espresso">{track.title}</h2>
              {track.description ? <p className="mt-2 text-sm leading-7 text-espresso/58">{track.description}</p> : null}
            </div>
          </div>
          <p className="rounded-full border border-lilac-border/50 bg-pale-lilac/42 px-3 py-1 text-xs font-bold uppercase tracking-[0.14em] text-deep-lilac">
            {Math.round(Number(track.default_volume) * 100)}% default
          </p>
        </div>

        {track.signedUrl ? (
          <audio controls preload="metadata" src={track.signedUrl} className="mt-5 w-full" />
        ) : (
          <p className="mt-5 rounded-2xl border border-dashed border-espresso/14 bg-ivory/50 p-4 text-sm leading-6 text-espresso/58">
            This private track could not be signed for preview right now.
          </p>
        )}

        <form action={updateMusicTrack} className="mt-5 grid gap-4 rounded-[1.35rem] border border-lilac-border/45 bg-ivory/48 p-4">
          <input type="hidden" name="trackId" value={track.id} />
          <label className="space-y-2">
            <span className="text-sm font-bold text-espresso">Track title</span>
            <input name="title" required maxLength={160} defaultValue={track.title} className={inputClasses} />
          </label>
          <label className="space-y-2">
            <span className="text-sm font-bold text-espresso">Artist/source note</span>
            <textarea
              name="description"
              rows={3}
              maxLength={500}
              defaultValue={track.description ?? ""}
              className="min-h-24 w-full resize-y rounded-2xl border border-lilac-border/45 bg-ivory/70 px-4 py-3 text-sm leading-6 text-espresso outline-none focus:border-deep-lilac/45 focus:ring-4 focus:ring-lilac-primary/16"
            />
          </label>
          <div className="grid gap-4 sm:grid-cols-[12rem_1fr]">
            <label className="space-y-2">
              <span className="text-sm font-bold text-espresso">Default volume</span>
              <input
                type="number"
                name="defaultVolume"
                min="0"
                max="1"
                step="0.01"
                defaultValue={Number(track.default_volume)}
                className={inputClasses}
              />
            </label>
            <label className="flex items-start gap-3 self-end rounded-2xl border border-lilac-border/40 bg-porcelain/64 p-3 text-sm leading-6 text-espresso/62">
              <input
                type="checkbox"
                name="isActive"
                defaultChecked={track.is_active}
                className="mt-1 size-4 rounded border-lilac-border text-deep-lilac accent-deep-lilac"
              />
              Make this the active background track.
            </label>
          </div>
          <div className="flex justify-end">
            <PendingSubmitButton pendingLabel="Saving track...">Save track</PendingSubmitButton>
          </div>
        </form>

        <form action={deleteMusicTrack} className="mt-4 space-y-3 rounded-2xl border border-espresso/10 bg-ivory/48 p-3">
          <input type="hidden" name="trackId" value={track.id} />
          <label className="flex items-start gap-3 text-sm leading-6 text-espresso/62">
            <input
              type="checkbox"
              name="deleteFile"
              defaultChecked
              className="mt-1 size-4 rounded border-lilac-border text-deep-lilac accent-deep-lilac"
            />
            Also delete the private storage file.
          </label>
          <ConfirmDialog message="Delete this music track? If checked, the private storage file will also be removed.">
            Delete track
          </ConfirmDialog>
        </form>
      </div>
    </article>
  );
}
