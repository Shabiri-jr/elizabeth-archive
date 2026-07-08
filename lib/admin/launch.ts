import "server-only";

import { requireAdminProfile } from "@/lib/admin/permissions";
import { createServiceRoleClient } from "@/lib/supabase/server";
import type { Database } from "@/lib/types";

type SettingsRow = Database["public"]["Tables"]["archive_settings"]["Row"];

export type LaunchDashboardData = {
  status: "connected" | "unconfigured";
  settings: SettingsRow | null;
  pendingSubmissions: number;
  pendingMedia: number;
  unusedContributorLinks: number;
  totalContributorLinks: number;
};

async function countRows(
  serviceClient: NonNullable<ReturnType<typeof createServiceRoleClient>>,
  table: "birthday_submissions" | "media_assets" | "contributors",
  filter?: { column: string; value: string | boolean },
) {
  let query = serviceClient.from(table).select("*", { count: "exact", head: true });

  if (filter) {
    query = query.eq(filter.column, filter.value);
  }

  const { count, error } = await query;
  return error ? 0 : count ?? 0;
}

export async function getLaunchDashboardData(): Promise<LaunchDashboardData> {
  await requireAdminProfile();
  const serviceClient = createServiceRoleClient();

  if (!serviceClient) {
    return {
      status: "unconfigured",
      settings: null,
      pendingSubmissions: 0,
      pendingMedia: 0,
      unusedContributorLinks: 0,
      totalContributorLinks: 0,
    };
  }

  const [{ data: settings }, pendingSubmissions, pendingMedia, unusedContributorLinks, totalContributorLinks] =
    await Promise.all([
      serviceClient
        .from("archive_settings")
        .select("*")
        .order("updated_at", { ascending: false })
        .limit(1)
        .maybeSingle(),
      countRows(serviceClient, "birthday_submissions", { column: "status", value: "pending" }),
      countRows(serviceClient, "media_assets", { column: "status", value: "pending" }),
      countRows(serviceClient, "contributors", { column: "is_used", value: false }),
      countRows(serviceClient, "contributors"),
    ]);

  return {
    status: "connected",
    settings: settings ?? null,
    pendingSubmissions,
    pendingMedia,
    unusedContributorLinks,
    totalContributorLinks,
  };
}

