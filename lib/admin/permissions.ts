import "server-only";

import { redirect } from "next/navigation";
import { getAdminAccess } from "@/lib/auth";
import { createServiceRoleClient } from "@/lib/supabase/server";
import type { Database } from "@/lib/types";

type ProfileRow = Database["public"]["Tables"]["profiles"]["Row"];

export async function requireAdminProfile(): Promise<ProfileRow> {
  const access = await getAdminAccess();

  if (access.status === "admin") {
    return access.profile;
  }

  if (access.status === "unauthorized") {
    redirect("/admin/login?error=unauthorized");
  }

  redirect("/admin/login");
}

export async function requireAdminActionContext() {
  const profile = await requireAdminProfile();
  const serviceClient = createServiceRoleClient();

  if (!serviceClient) {
    throw new Error("Supabase service role credentials are not configured for admin actions.");
  }

  return { profile, serviceClient };
}
