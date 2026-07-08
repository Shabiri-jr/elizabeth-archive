import "server-only";

import { createServiceRoleClient } from "@/lib/supabase/server";
import type { Database } from "@/lib/types";

type MusicTrackRow = Database["public"]["Tables"]["music_tracks"]["Row"];

export type ArchiveMusicTrack = {
  id: string;
  title: string;
  description: string | null;
  url: string;
  defaultVolume: number;
  promptEnabled: boolean;
};

async function getMusicPromptEnabled(
  serviceClient: NonNullable<ReturnType<typeof createServiceRoleClient>>,
) {
  const { data, error } = await serviceClient
    .from("archive_settings")
    .select("music_prompt_enabled")
    .order("updated_at", { ascending: false })
    .limit(1)
    .maybeSingle();

  if (error) return true;
  return data?.music_prompt_enabled ?? true;
}

export async function getActiveMusicTrack(): Promise<ArchiveMusicTrack | null> {
  const serviceClient = createServiceRoleClient();

  if (!serviceClient) return null;

  const [{ data: track, error }, promptEnabled] = await Promise.all([
    serviceClient
      .from("music_tracks")
      .select("*")
      .eq("is_active", true)
      .order("updated_at", { ascending: false })
      .limit(1)
      .maybeSingle(),
    getMusicPromptEnabled(serviceClient),
  ]);

  if (error || !track) return null;

  const { data: signedUrl, error: signedError } = await serviceClient.storage
    .from(track.bucket)
    .createSignedUrl(track.storage_path, 60 * 60 * 4);

  if (signedError || !signedUrl?.signedUrl) return null;

  return {
    id: track.id,
    title: track.title,
    description: track.description,
    url: signedUrl.signedUrl,
    defaultVolume: Number(track.default_volume),
    promptEnabled,
  };
}

export function normalizeMusicTrackVolume(value: MusicTrackRow["default_volume"]) {
  const volume = Number(value);
  if (!Number.isFinite(volume)) return 0.25;
  return Math.min(1, Math.max(0, volume));
}
