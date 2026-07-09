"use server";

import { revalidatePath } from "next/cache";
import { z } from "zod";
import { logAdminActivity } from "@/lib/admin/logs";
import { requireAdminActionContext } from "@/lib/admin/permissions";
import type { Database, Json } from "@/lib/types";

type MusicTrackRow = Database["public"]["Tables"]["music_tracks"]["Row"];

const uuidSchema = z.string().uuid();
const titleSchema = z.string().trim().min(1).max(160);
const descriptionSchema = z.preprocess(
  (value) => {
    const text = String(value ?? "").trim();
    return text.length ? text : null;
  },
  z.string().max(500).nullable(),
);
const volumeSchema = z.coerce.number().min(0).max(1);

function formText(formData: FormData, key: string) {
  return String(formData.get(key) ?? "").trim();
}

function formBoolean(formData: FormData, key: string) {
  return formData.get(key) === "on";
}

async function deactivateOtherTracks(
  serviceClient: Awaited<ReturnType<typeof requireAdminActionContext>>["serviceClient"],
  exceptTrackId?: string,
) {
  let query = serviceClient.from("music_tracks").update({ is_active: false }).eq("is_active", true);

  if (exceptTrackId) {
    query = query.neq("id", exceptTrackId);
  }

  const { error } = await query;
  if (error) throw new Error(error.message);
}

function revalidateMusicPaths() {
  revalidatePath("/admin");
  revalidatePath("/admin/music");
  revalidatePath("/archive");
  revalidatePath("/archive/preview");
  revalidatePath("/archive/open-when");
  revalidatePath("/archive/from-me");
  revalidatePath("/archive/favourites");
}

export async function updateMusicTrack(formData: FormData) {
  const trackId = uuidSchema.parse(formText(formData, "trackId"));
  const title = titleSchema.parse(formData.get("title"));
  const description = descriptionSchema.parse(formData.get("description"));
  const defaultVolume = volumeSchema.parse(formData.get("defaultVolume") || 0.25);
  const isActive = formBoolean(formData, "isActive");
  const { profile, serviceClient } = await requireAdminActionContext();

  if (isActive) {
    await deactivateOtherTracks(serviceClient, trackId);
  }

  const { error } = await serviceClient
    .from("music_tracks")
    .update({
      title,
      description,
      default_volume: defaultVolume,
      is_active: isActive,
    })
    .eq("id", trackId);

  if (error) {
    throw new Error(error.message);
  }

  await logAdminActivity(serviceClient, {
    adminId: profile.id,
    action: "update_music_track",
    targetTable: "music_tracks",
    targetId: trackId,
    metadata: { title, isActive, defaultVolume } satisfies Json,
  });

  revalidateMusicPaths();
}

export async function deleteMusicTrack(formData: FormData) {
  const trackId = uuidSchema.parse(formText(formData, "trackId"));
  const deleteFile = formBoolean(formData, "deleteFile");
  const { profile, serviceClient } = await requireAdminActionContext();
  const { data: track, error: trackError } = await serviceClient
    .from("music_tracks")
    .select("*")
    .eq("id", trackId)
    .single<MusicTrackRow>();

  if (trackError || !track) {
    throw new Error(trackError?.message ?? "Music track was not found.");
  }

  const storageFailures: string[] = [];
  if (deleteFile) {
    const { error } = await serviceClient.storage.from(track.bucket).remove([track.storage_path]);
    if (error) storageFailures.push(error.message);
  }

  const { error } = await serviceClient.from("music_tracks").delete().eq("id", trackId);

  if (error) {
    throw new Error(error.message);
  }

  await logAdminActivity(serviceClient, {
    adminId: profile.id,
    action: "delete_music_track",
    targetTable: "music_tracks",
    targetId: trackId,
    metadata: {
      title: track.title,
      deletedStorageFile: deleteFile,
      storageFailures,
    },
  });

  revalidateMusicPaths();
}

export async function updateMusicPromptSetting(formData: FormData) {
  const settingsId = uuidSchema.parse(formText(formData, "settingsId") || "11111111-1111-1111-1111-111111111111");
  const musicPromptEnabled = formBoolean(formData, "musicPromptEnabled");
  const { profile, serviceClient } = await requireAdminActionContext();

  const { error } = await serviceClient
    .from("archive_settings")
    .upsert({ id: settingsId, music_prompt_enabled: musicPromptEnabled }, { onConflict: "id" });

  if (error) {
    throw new Error(error.message);
  }

  await logAdminActivity(serviceClient, {
    adminId: profile.id,
    action: "update_music_prompt_setting",
    targetTable: "archive_settings",
    targetId: settingsId,
    metadata: { musicPromptEnabled },
  });

  revalidateMusicPaths();
}
