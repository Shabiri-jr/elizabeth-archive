import "server-only";

import { adminCards } from "@/lib/constants";
import { getAdminOverview } from "@/lib/admin/queries";
import type { AdminDashboardStats, AdminMetricKey } from "@/lib/types";

const fallbackStats: AdminDashboardStats = {
  totalSubmissions: "0 total",
  pendingSubmissions: "0 pending",
  approvedSubmissions: "0 approved",
  rejectedSubmissions: "0 rejected",
  totalMediaFiles: "0 files",
  pendingMediaFiles: "0 pending",
  totalContributorLinks: "0 links",
  usedContributorLinks: "0 used",
  archiveLive: "Locked",
  contributionsOpen: "Open",
};

export async function getAdminDashboardStats() {
  try {
    const overview = await getAdminOverview();

    return {
      status: overview.status,
      stats: overview.stats,
      message: overview.message,
    };
  } catch {
    return {
      status: "error" as const,
      stats: fallbackStats,
      message: "Admin dashboard counts could not be loaded safely.",
    };
  }
}

export function getAdminCardsWithStats(stats: AdminDashboardStats) {
  return adminCards.map((card) => ({
    ...card,
    metric: stats[card.metricKey as AdminMetricKey],
  }));
}
