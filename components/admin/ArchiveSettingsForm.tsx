import { PendingSubmitButton } from "@/components/admin/PendingSubmitButton";
import { StatusBadge } from "@/components/admin/StatusBadge";
import { updateArchiveSettings } from "@/lib/admin/actions";
import type { Database } from "@/lib/types";

type SettingsRow = Database["public"]["Tables"]["archive_settings"]["Row"];

type ArchiveSettingsFormProps = {
  settings: SettingsRow | null;
};

function fallbackSettings(): SettingsRow {
  return {
    id: "11111111-1111-1111-1111-111111111111",
    birthday_date: "2026-08-19",
    archive_live: false,
    contributions_open: true,
    elizabeth_access_enabled: false,
    reveal_mode_enabled: false,
    music_prompt_enabled: true,
    maintenance_mode: false,
    updated_at: new Date().toISOString(),
  };
}

export function ArchiveSettingsForm({ settings }: ArchiveSettingsFormProps) {
  const currentSettings = settings ?? fallbackSettings();

  return (
    <form
      action={updateArchiveSettings}
      className="rounded-[1.75rem] bg-warm-black/[0.035] p-1.5 ring-1 ring-espresso/7 shadow-[var(--shadow-beautiful-md)]"
    >
      <input type="hidden" name="settingsId" value={currentSettings.id} />
      <div className="rounded-[calc(1.75rem-0.375rem)] border border-porcelain/80 bg-porcelain/76 p-5 sm:p-6">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
          <div>
            <p className="text-sm font-bold uppercase tracking-[0.18em] text-deep-lilac/72">
              Reveal controls
            </p>
            <h2 className="mt-2 font-serif text-3xl font-semibold text-espresso">Archive settings</h2>
            <p className="mt-3 max-w-2xl text-sm leading-7 text-espresso/58">
              These switches control intake, reveal readiness, and Elizabeth&apos;s access. Turning archive live may allow
              Elizabeth to view the final experience if access is enabled.
            </p>
          </div>
          <StatusBadge status={currentSettings.archive_live ? "live" : "locked"} label={currentSettings.archive_live ? "Live" : "Locked"} />
        </div>

        <label className="mt-6 block space-y-2">
          <span className="text-sm font-bold text-espresso">Birthday date</span>
          <input
            name="birthdayDate"
            type="date"
            defaultValue={currentSettings.birthday_date}
            required
            className="min-h-12 w-full rounded-2xl border border-lilac-border/45 bg-ivory/70 px-4 text-sm text-espresso outline-none focus:border-deep-lilac/45 focus:ring-4 focus:ring-lilac-primary/16 sm:max-w-xs"
          />
        </label>

        <div className="mt-6 grid gap-4 md:grid-cols-2">
          <label className="rounded-2xl border border-lilac-border/45 bg-pale-lilac/22 p-4">
            <span className="flex items-start gap-3">
              <input
                type="checkbox"
                name="contributionsOpen"
                defaultChecked={currentSettings.contributions_open}
                className="mt-1 size-4 rounded border-lilac-border accent-deep-lilac"
              />
              <span>
                <span className="block text-sm font-bold text-espresso">Contributions open</span>
                <span className="mt-2 block text-sm leading-6 text-espresso/58">
                  People with valid private links can still submit birthday wishes and media.
                </span>
              </span>
            </span>
          </label>

          <label className="rounded-2xl border border-champagne/45 bg-champagne/12 p-4">
            <span className="flex items-start gap-3">
              <input
                type="checkbox"
                name="archiveLive"
                defaultChecked={currentSettings.archive_live}
                className="mt-1 size-4 rounded border-lilac-border accent-deep-lilac"
              />
              <span>
                <span className="block text-sm font-bold text-espresso">Archive live</span>
                <span className="mt-2 block text-sm leading-6 text-espresso/58">
                  This is a reveal-level setting. Keep it off until the final archive is ready for viewing.
                </span>
              </span>
            </span>
          </label>

          <label className="rounded-2xl border border-lilac-border/45 bg-pale-lilac/22 p-4">
            <span className="flex items-start gap-3">
              <input
                type="checkbox"
                name="elizabethAccessEnabled"
                defaultChecked={currentSettings.elizabeth_access_enabled}
                className="mt-1 size-4 rounded border-lilac-border accent-deep-lilac"
              />
              <span>
                <span className="block text-sm font-bold text-espresso">Elizabeth access enabled</span>
                <span className="mt-2 block text-sm leading-6 text-espresso/58">
                  Enables Elizabeth&apos;s private access-code flow. Preview the archive before turning this on.
                </span>
              </span>
            </span>
          </label>

          <label className="rounded-2xl border border-lilac-border/45 bg-pale-lilac/22 p-4">
            <span className="flex items-start gap-3">
              <input
                type="checkbox"
                name="revealModeEnabled"
                defaultChecked={Boolean(currentSettings.reveal_mode_enabled)}
                className="mt-1 size-4 rounded border-lilac-border accent-deep-lilac"
              />
              <span>
                <span className="block text-sm font-bold text-espresso">Reveal mode enabled</span>
                <span className="mt-2 block text-sm leading-6 text-espresso/58">
                  Gives Elizabeth the full cinematic opening once, with a skip option and reduced-motion support.
                </span>
              </span>
            </span>
          </label>

          <label className="rounded-2xl border border-rose-200/70 bg-rose-50/55 p-4">
            <span className="flex items-start gap-3">
              <input
                type="checkbox"
                name="maintenanceMode"
                defaultChecked={currentSettings.maintenance_mode}
                className="mt-1 size-4 rounded border-lilac-border accent-deep-lilac"
              />
              <span>
                <span className="block text-sm font-bold text-espresso">Maintenance mode</span>
                <span className="mt-2 block text-sm leading-6 text-espresso/58">
                  Reserve this for future lockout behavior while major archive changes are happening.
                </span>
              </span>
            </span>
          </label>
        </div>

        <div className="mt-6 flex justify-end">
          <PendingSubmitButton pendingLabel="Saving settings...">Save archive settings</PendingSubmitButton>
        </div>
      </div>
    </form>
  );
}
