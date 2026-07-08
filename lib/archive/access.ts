import "server-only";

import { getAdminAccess } from "@/lib/auth";
import { hasValidElizabethArchiveSession } from "@/lib/archive/session";
import { isOnOrAfterRevealDate } from "@/lib/archive/formatters";
import { createClient, createServiceRoleClient, isSupabaseConfigured } from "@/lib/supabase/server";
import type { Database } from "@/lib/types";

type SettingsRow = Database["public"]["Tables"]["archive_settings"]["Row"];

export type ArchiveAccessStatus =
  | "allowed"
  | "admin-preview"
  | "login-required"
  | "access-disabled"
  | "too-early"
  | "maintenance"
  | "unconfigured"
  | "error";

export type ArchiveAccessState = {
  status: ArchiveAccessStatus;
  allowed: boolean;
  isAdminPreview: boolean;
  settings: SettingsRow | null;
  title: string;
  message: string;
};

async function getArchiveSettings() {
  const serviceClient = createServiceRoleClient();

  if (serviceClient) {
    const { data, error } = await serviceClient
      .from("archive_settings")
      .select("*")
      .order("updated_at", { ascending: false })
      .limit(1)
      .maybeSingle();

    if (!error) return data;
  }

  const publicClient = await createClient();

  if (!publicClient) return null;

  const { data, error } = await publicClient
    .from("archive_settings")
    .select("*")
    .order("updated_at", { ascending: false })
    .limit(1)
    .maybeSingle();

  return error ? null : data;
}

function lockedState(status: ArchiveAccessStatus, settings: SettingsRow | null, title: string, message: string) {
  return {
    status,
    settings,
    title,
    message,
    allowed: false,
    isAdminPreview: false,
  };
}

export async function getArchiveAccessState(): Promise<ArchiveAccessState> {
  const adminAccess = await getAdminAccess();

  if (adminAccess.status === "admin") {
    const settings = isSupabaseConfigured() ? await getArchiveSettings() : null;

    return {
      status: "admin-preview",
      settings,
      title: "Admin preview",
      message: "You are previewing the final archive before the public reveal rules open it.",
      allowed: true,
      isAdminPreview: true,
    };
  }

  if (!isSupabaseConfigured()) {
    return lockedState(
      "unconfigured",
      null,
      "Something beautiful is still being prepared.",
      "Supabase is not configured yet, so the archive is safely locked.",
    );
  }

  const settings = await getArchiveSettings();

  if (!settings) {
    return lockedState(
      "error",
      null,
      "Something beautiful is still being prepared.",
      "The archive settings could not be loaded.",
    );
  }

  if (settings.maintenance_mode) {
    return lockedState(
      "maintenance",
      settings,
      "The archive is being polished.",
      "A few final details are being handled before the story opens again.",
    );
  }

  const hasSession = await hasValidElizabethArchiveSession();

  if (!hasSession) {
    return lockedState(
      "login-required",
      settings,
      "Something beautiful is still being prepared.",
      "Enter Elizabeth's private access code to open the archive when the reveal is ready.",
    );
  }

  if (!settings.elizabeth_access_enabled) {
    return lockedState(
      "access-disabled",
      settings,
      "Your story is almost ready.",
      "Elizabeth access has not been enabled yet. The archive is still being prepared with care.",
    );
  }

  if (!settings.archive_live && !isOnOrAfterRevealDate(settings.birthday_date)) {
    return lockedState(
      "too-early",
      settings,
      "Your story is almost ready.",
      "Elizabeth's birthday archive will open on August 19.",
    );
  }

  return {
    status: "allowed",
    settings,
    title: "Welcome, Elizabeth.",
    message: "Your birthday archive is open.",
    allowed: true,
    isAdminPreview: false,
  };
}
