import "server-only";

import { requireAdminProfile } from "@/lib/admin/permissions";
import { createServiceRoleClient } from "@/lib/supabase/server";
import type { Database } from "@/lib/types";

type MusicTrackRow = Database["public"]["Tables"]["music_tracks"]["Row"];
type SettingsRow = Database["public"]["Tables"]["archive_settings"]["Row"];

export type AdminMusicTrack = MusicTrackRow & {
  signedUrl: string | null;
};

export type AdminMusicState = {
  tracks: AdminMusicTrack[];
  promptEnabled: boolean;
  settingsId: string;
};

async function getSettingsRow(serviceClient: NonNullable<ReturnType<typeof createServiceRoleClient>>) {
  const { data, error } = await serviceClient
    .from("archive_settings")
    .select("id, music_prompt_enabled")
    .order("updated_at", { ascending: false })
    .limit(1)
    .maybeSingle();

  if (error || !data) {
    return {
      id: "11111111-1111-1111-1111-111111111111",
      music_prompt_enabled: true,
    } satisfies Pick<SettingsRow, "id" | "music_prompt_enabled">;
  }

  return data;
}

export async function getAdminMusicState(): Promise<AdminMusicState> {
  await requireAdminProfile();
  const serviceClient = createServiceRoleClient();

  if (!serviceClient) {
    return {
      tracks: [],
      promptEnabled: true,
      settingsId: "11111111-1111-1111-1111-111111111111",
    };
  }

  const [settings, { data: tracks, error }] = await Promise.all([
    getSettingsRow(serviceClient),
    serviceClient.from("music_tracks").select("*").order("created_at", { ascending: false }),
  ]);

  if (error || !tracks?.length) {
    return {
      tracks: [],
      promptEnabled: settings.music_prompt_enabled,
      settingsId: settings.id,
    };
  }

  const signedTracks = await Promise.all(
    tracks.map(async (track): Promise<AdminMusicTrack> => {
      const { data } = await serviceClient.storage.from(track.bucket).createSignedUrl(track.storage_path, 60 * 20);

      return {
        ...track,
        signedUrl: data?.signedUrl ?? null,
      };
    }),
  );

  return {
    tracks: signedTracks,
    promptEnabled: settings.music_prompt_enabled,
    settingsId: settings.id,
  };
}
