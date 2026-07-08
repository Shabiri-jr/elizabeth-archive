import { Music2 } from "lucide-react";
import { PendingSubmitButton } from "@/components/admin/PendingSubmitButton";
import { uploadMusicTrack } from "@/lib/admin/music-actions";

const inputClasses =
  "min-h-12 w-full rounded-2xl border border-lilac-border/45 bg-ivory/70 px-4 text-sm text-espresso outline-none focus:border-deep-lilac/45 focus:ring-4 focus:ring-lilac-primary/16";

export function UploadMusicTrackForm() {
  return (
    <form
      action={uploadMusicTrack}
      className="rounded-[1.75rem] bg-warm-black/[0.035] p-1.5 ring-1 ring-espresso/7 shadow-[var(--shadow-beautiful-md)]"
    >
      <div className="rounded-[calc(1.75rem-0.375rem)] border border-porcelain/80 bg-porcelain/76 p-5">
        <div className="flex items-start gap-4">
          <div className="flex size-12 shrink-0 items-center justify-center rounded-full bg-pale-lilac text-deep-lilac">
            <Music2 aria-hidden="true" className="size-5" strokeWidth={1.5} />
          </div>
          <div>
            <h2 className="font-serif text-3xl font-semibold leading-tight text-espresso">Upload background music</h2>
            <p className="mt-2 text-sm leading-7 text-espresso/58">
              Add one gentle track for Elizabeth&apos;s archive. Only upload music you own, created yourself, or have
              permission to use.
            </p>
          </div>
        </div>

        <div className="mt-6 grid gap-4">
          <label className="space-y-2">
            <span className="text-sm font-bold text-espresso">Track title</span>
            <input name="title" required maxLength={160} placeholder="Soft birthday theme" className={inputClasses} />
          </label>

          <label className="space-y-2">
            <span className="text-sm font-bold text-espresso">Artist/source note</span>
            <textarea
              name="description"
              rows={3}
              maxLength={500}
              placeholder="Original piano sketch, licensed track, or source note."
              className="min-h-28 w-full resize-y rounded-2xl border border-lilac-border/45 bg-ivory/70 px-4 py-3 text-sm leading-6 text-espresso outline-none focus:border-deep-lilac/45 focus:ring-4 focus:ring-lilac-primary/16"
            />
          </label>

          <div className="grid gap-4 sm:grid-cols-[1fr_12rem]">
            <label className="space-y-2">
              <span className="text-sm font-bold text-espresso">Audio file</span>
              <input
                type="file"
                name="file"
                required
                accept=".mp3,.m4a,.wav,.webm,audio/mpeg,audio/mp4,audio/wav,audio/webm"
                className={inputClasses}
              />
              <span className="block text-xs leading-5 text-espresso/48">Accepted: mp3, m4a, wav, webm. Max 25MB.</span>
            </label>
            <label className="space-y-2">
              <span className="text-sm font-bold text-espresso">Default volume</span>
              <input
                type="number"
                name="defaultVolume"
                min="0"
                max="1"
                step="0.01"
                defaultValue="0.25"
                className={inputClasses}
              />
              <span className="block text-xs leading-5 text-espresso/48">0.25 is calm and low.</span>
            </label>
          </div>

          <label className="flex items-start gap-3 rounded-2xl border border-lilac-border/40 bg-ivory/56 p-3 text-sm leading-6 text-espresso/62">
            <input
              type="checkbox"
              name="isActive"
              defaultChecked
              className="mt-1 size-4 rounded border-lilac-border text-deep-lilac accent-deep-lilac"
            />
            Make this the active archive track after upload.
          </label>
        </div>

        <div className="mt-5 flex justify-end">
          <PendingSubmitButton pendingLabel="Uploading music...">Upload track</PendingSubmitButton>
        </div>
      </div>
    </form>
  );
}
