import "server-only";

import { createClient, isSupabaseConfigured } from "@/lib/supabase/server";
import type { Database } from "@/lib/types";

type ProfileRow = Database["public"]["Tables"]["profiles"]["Row"];

export type AdminAccessResult =
  | { status: "admin"; profile: ProfileRow }
  | { status: "unauthenticated"; profile: null }
  | { status: "unauthorized"; profile: ProfileRow | null }
  | { status: "unconfigured"; profile: null }
  | { status: "error"; profile: null };

export async function getCurrentProfile() {
  const supabase = await createClient();

  if (!supabase) {
    return { status: "unconfigured" as const, profile: null };
  }

  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser();

  if (userError || !user) {
    return { status: "unauthenticated" as const, profile: null };
  }

  const { data: profile, error: profileError } = await supabase
    .from("profiles")
    .select("*")
    .eq("id", user.id)
    .maybeSingle();

  if (profileError) {
    return { status: "error" as const, profile: null };
  }

  return { status: "authenticated" as const, profile };
}

export async function getAdminAccess(): Promise<AdminAccessResult> {
  if (!isSupabaseConfigured()) {
    return { status: "unconfigured", profile: null };
  }

  const result = await getCurrentProfile();

  if (result.status === "unauthenticated") {
    return { status: "unauthenticated", profile: null };
  }

  if (result.status !== "authenticated") {
    return { status: "error", profile: null };
  }

  if (result.profile?.role !== "admin") {
    return { status: "unauthorized", profile: result.profile };
  }

  return { status: "admin", profile: result.profile };
}
