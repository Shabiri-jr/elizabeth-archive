import { MusicTrackCard } from "@/components/admin/music/MusicTrackCard";
import { PendingSubmitButton } from "@/components/admin/PendingSubmitButton";
import { UploadMusicTrackForm } from "@/components/admin/music/UploadMusicTrackForm";
import { updateMusicPromptSetting } from "@/lib/admin/music-actions";
import type { AdminMusicState } from "@/lib/admin/music-queries";

type AdminMusicManagerProps = {
  state: AdminMusicState;
};

export function AdminMusicManager({ state }: AdminMusicManagerProps) {
  const activeTrack = state.tracks.find((track) => track.is_active);

  return (
    <div className="space-y-6">
      <div className="grid gap-4 md:grid-cols-3">
        <div className="rounded-[1.5rem] border border-lilac-border/45 bg-porcelain/72 p-5 shadow-[var(--shadow-beautiful-sm)]">
          <p className="text-xs font-bold uppercase tracking-[0.18em] text-deep-lilac/72">Tracks</p>
          <p className="mt-2 font-serif text-4xl font-semibold text-espresso">{state.tracks.length}</p>
        </div>
        <div className="rounded-[1.5rem] border border-lilac-border/45 bg-porcelain/72 p-5 shadow-[var(--shadow-beautiful-sm)]">
          <p className="text-xs font-bold uppercase tracking-[0.18em] text-deep-lilac/72">Active track</p>
          <p className="mt-2 truncate font-serif text-3xl font-semibold text-espresso">{activeTrack?.title ?? "None"}</p>
        </div>
        <form
          action={updateMusicPromptSetting}
          className="rounded-[1.5rem] border border-lilac-border/45 bg-porcelain/72 p-5 shadow-[var(--shadow-beautiful-sm)]"
        >
          <input type="hidden" name="settingsId" value={state.settingsId} />
          <p className="text-xs font-bold uppercase tracking-[0.18em] text-deep-lilac/72">Music prompt</p>
          <label className="mt-4 flex items-start gap-3 text-sm leading-6 text-espresso/62">
            <input
              type="checkbox"
              name="musicPromptEnabled"
              defaultChecked={state.promptEnabled}
              className="mt-1 size-4 rounded border-lilac-border text-deep-lilac accent-deep-lilac"
            />
            Ask Elizabeth before playing music.
          </label>
          <div className="mt-4">
            <PendingSubmitButton pendingLabel="Saving prompt..." tone="quiet">
              Save prompt setting
            </PendingSubmitButton>
          </div>
        </form>
      </div>

      <UploadMusicTrackForm />

      {state.tracks.length ? (
        <div className="grid gap-5 xl:grid-cols-2">
          {state.tracks.map((track) => (
            <MusicTrackCard key={track.id} track={track} />
          ))}
        </div>
      ) : (
        <div className="rounded-[1.75rem] border border-dashed border-espresso/16 bg-porcelain/58 p-8 text-center shadow-[var(--shadow-beautiful-sm)]">
          <p className="font-serif text-3xl font-semibold text-espresso">No background music has been uploaded yet.</p>
          <p className="mx-auto mt-3 max-w-xl text-sm leading-7 text-espresso/58">
            When a track is uploaded and made active, Elizabeth will be invited to play it inside the archive.
          </p>
        </div>
      )}
    </div>
  );
}
