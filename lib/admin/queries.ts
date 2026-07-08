import "server-only";

import { createServiceRoleClient } from "@/lib/supabase/server";
import { requireAdminProfile } from "@/lib/admin/permissions";
import type {
  AdminDashboardStats,
  Database,
  MediaAssetType,
  SubmissionStatus,
} from "@/lib/types";

type ServiceClient = NonNullable<ReturnType<typeof createServiceRoleClient>>;
type CountTable = "birthday_submissions" | "media_assets" | "contributors" | "archive_chapters";
type SubmissionRow = Database["public"]["Tables"]["birthday_submissions"]["Row"];
type MediaRow = Database["public"]["Tables"]["media_assets"]["Row"];
type ContributorRow = Database["public"]["Tables"]["contributors"]["Row"];
type ChapterRow = Database["public"]["Tables"]["archive_chapters"]["Row"];
type SettingsRow = Database["public"]["Tables"]["archive_settings"]["Row"];
type ActivityLogRow = Database["public"]["Tables"]["admin_activity_logs"]["Row"];
type OpenWhenLetterRow = Database["public"]["Tables"]["open_when_letters"]["Row"];

export type AdminSubmission = SubmissionRow & {
  contributor: Pick<ContributorRow, "token" | "name" | "relationship" | "email"> | null;
  media: MediaRow[];
  mediaCount: number;
};

export type AdminMediaAsset = MediaRow & {
  signedUrl: string | null;
  contributorName: string | null;
  contributorRelationship: string | null;
  submissionName: string | null;
  submissionStatus: SubmissionStatus | null;
};

export type AdminContributor = ContributorRow & {
  submissionCount: number;
};

export type AdminOverview = {
  status: "connected" | "unconfigured";
  stats: AdminDashboardStats;
  message: string;
  settings: SettingsRow | null;
  recentActivity: ActivityLogRow[];
};

export type SubmissionFilters = {
  status?: SubmissionStatus | "all";
  search?: string;
  sort?: "newest" | "oldest";
};

export type MediaFilters = {
  status?: SubmissionStatus | "all";
  type?: MediaAssetType | "all";
};

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

function getAdminClient() {
  return createServiceRoleClient();
}

async function countRows(
  serviceClient: ServiceClient,
  table: CountTable,
  filter?: { column: string; value: string | boolean },
) {
  let query = serviceClient.from(table).select("*", { count: "exact", head: true });

  if (filter) {
    query = query.eq(filter.column, filter.value);
  }

  const { count, error } = await query;
  return error ? 0 : count ?? 0;
}

async function getSettingsRow(serviceClient: ServiceClient) {
  const { data, error } = await serviceClient
    .from("archive_settings")
    .select("*")
    .order("updated_at", { ascending: false })
    .limit(1)
    .maybeSingle();

  return error ? null : data;
}

export async function getRecentActivityLogs(limit = 8) {
  await requireAdminProfile();
  const serviceClient = getAdminClient();

  if (!serviceClient) {
    return [];
  }

  const { data, error } = await serviceClient
    .from("admin_activity_logs")
    .select("*")
    .order("created_at", { ascending: false })
    .limit(limit);

  return error ? [] : data ?? [];
}

export async function getAdminOverview(): Promise<AdminOverview> {
  await requireAdminProfile();
  const serviceClient = getAdminClient();

  if (!serviceClient) {
    return {
      status: "unconfigured",
      stats: fallbackStats,
      settings: null,
      recentActivity: [],
      message: "The admin session is valid, but the service-role key is missing, so live moderation data is hidden.",
    };
  }

  const [
    totalSubmissions,
    pendingSubmissions,
    approvedSubmissions,
    rejectedSubmissions,
    totalMediaFiles,
    pendingMediaFiles,
    totalContributorLinks,
    usedContributorLinks,
    settings,
    recentActivity,
  ] = await Promise.all([
    countRows(serviceClient, "birthday_submissions"),
    countRows(serviceClient, "birthday_submissions", { column: "status", value: "pending" }),
    countRows(serviceClient, "birthday_submissions", { column: "status", value: "approved" }),
    countRows(serviceClient, "birthday_submissions", { column: "status", value: "rejected" }),
    countRows(serviceClient, "media_assets"),
    countRows(serviceClient, "media_assets", { column: "status", value: "pending" }),
    countRows(serviceClient, "contributors"),
    countRows(serviceClient, "contributors", { column: "is_used", value: true }),
    getSettingsRow(serviceClient),
    getRecentActivityLogs(6),
  ]);

  return {
    status: "connected",
    settings,
    recentActivity,
    message: "Live moderation counts are loaded from Supabase and ready for review.",
    stats: {
      totalSubmissions: `${totalSubmissions} total`,
      pendingSubmissions: `${pendingSubmissions} pending`,
      approvedSubmissions: `${approvedSubmissions} approved`,
      rejectedSubmissions: `${rejectedSubmissions} rejected`,
      totalMediaFiles: `${totalMediaFiles} files`,
      pendingMediaFiles: `${pendingMediaFiles} pending`,
      totalContributorLinks: `${totalContributorLinks} links`,
      usedContributorLinks: `${usedContributorLinks} used`,
      archiveLive: settings?.archive_live ? "Live" : "Locked",
      contributionsOpen: settings?.contributions_open ? "Open" : "Closed",
    },
  };
}

export async function getSubmissions(filters: SubmissionFilters = {}) {
  await requireAdminProfile();
  const serviceClient = getAdminClient();

  if (!serviceClient) {
    return [];
  }

  let query = serviceClient
    .from("birthday_submissions")
    .select("*")
    .order("created_at", { ascending: filters.sort === "oldest" });

  if (filters.status && filters.status !== "all") {
    query = query.eq("status", filters.status);
  }

  const { data: submissions, error } = await query;

  if (error || !submissions?.length) {
    return [];
  }

  const search = filters.search?.trim().toLowerCase();
  const filteredSubmissions = search
    ? submissions.filter((submission) =>
        [submission.name, submission.relationship].some((value) =>
          value.toLowerCase().includes(search),
        ),
      )
    : submissions;

  if (!filteredSubmissions.length) {
    return [];
  }

  const submissionIds = filteredSubmissions.map((submission) => submission.id);
  const contributorIds = Array.from(
    new Set(filteredSubmissions.map((submission) => submission.contributor_id).filter(Boolean)),
  ) as string[];

  const [{ data: mediaRows }, { data: contributorRows }] = await Promise.all([
    serviceClient.from("media_assets").select("*").in("submission_id", submissionIds),
    contributorIds.length
      ? serviceClient.from("contributors").select("id, token, name, relationship, email").in("id", contributorIds)
      : Promise.resolve({ data: [] as Pick<ContributorRow, "id" | "token" | "name" | "relationship" | "email">[] }),
  ]);

  const mediaBySubmission = new Map<string, MediaRow[]>();
  (mediaRows ?? []).forEach((media) => {
    if (!media.submission_id) return;
    mediaBySubmission.set(media.submission_id, [...(mediaBySubmission.get(media.submission_id) ?? []), media]);
  });

  const contributorsById = new Map((contributorRows ?? []).map((contributor) => [contributor.id, contributor]));

  return filteredSubmissions.map((submission): AdminSubmission => {
    const media = mediaBySubmission.get(submission.id) ?? [];
    const contributor = submission.contributor_id ? contributorsById.get(submission.contributor_id) ?? null : null;

    return {
      ...submission,
      contributor,
      media,
      mediaCount: media.length,
    };
  });
}

export async function getMediaAssets(filters: MediaFilters = {}) {
  await requireAdminProfile();
  const serviceClient = getAdminClient();

  if (!serviceClient) {
    return [];
  }

  let query = serviceClient.from("media_assets").select("*").order("created_at", { ascending: false });

  if (filters.status && filters.status !== "all") {
    query = query.eq("status", filters.status);
  }

  if (filters.type && filters.type !== "all") {
    query = query.eq("type", filters.type);
  }

  const { data: mediaRows, error } = await query;

  if (error || !mediaRows?.length) {
    return [];
  }

  const submissionIds = Array.from(new Set(mediaRows.map((media) => media.submission_id).filter(Boolean))) as string[];
  const contributorIds = Array.from(new Set(mediaRows.map((media) => media.contributor_id).filter(Boolean))) as string[];

  const [{ data: submissions }, { data: contributors }] = await Promise.all([
    submissionIds.length
      ? serviceClient.from("birthday_submissions").select("id, name, status").in("id", submissionIds)
      : Promise.resolve({ data: [] as Pick<SubmissionRow, "id" | "name" | "status">[] }),
    contributorIds.length
      ? serviceClient.from("contributors").select("id, name, relationship").in("id", contributorIds)
      : Promise.resolve({ data: [] as Pick<ContributorRow, "id" | "name" | "relationship">[] }),
  ]);

  const submissionsById = new Map((submissions ?? []).map((submission) => [submission.id, submission]));
  const contributorsById = new Map((contributors ?? []).map((contributor) => [contributor.id, contributor]));

  return Promise.all(
    mediaRows.map(async (media): Promise<AdminMediaAsset> => {
      const { data } = await serviceClient.storage.from(media.bucket).createSignedUrl(media.storage_path, 60 * 20);
      const submission = media.submission_id ? submissionsById.get(media.submission_id) : null;
      const contributor = media.contributor_id ? contributorsById.get(media.contributor_id) : null;

      return {
        ...media,
        signedUrl: data?.signedUrl ?? null,
        contributorName: contributor?.name ?? null,
        contributorRelationship: contributor?.relationship ?? null,
        submissionName: submission?.name ?? null,
        submissionStatus: submission?.status ?? null,
      };
    }),
  );
}

export async function getGalleryImages() {
  return getMediaAssets({ type: "image" });
}

export async function getContributors() {
  await requireAdminProfile();
  const serviceClient = getAdminClient();

  if (!serviceClient) {
    return [];
  }

  const { data: contributors, error } = await serviceClient
    .from("contributors")
    .select("*")
    .order("created_at", { ascending: false });

  if (error || !contributors?.length) {
    return [];
  }

  const contributorIds = contributors.map((contributor) => contributor.id);
  const { data: submissions } = await serviceClient
    .from("birthday_submissions")
    .select("id, contributor_id")
    .in("contributor_id", contributorIds);

  const counts = new Map<string, number>();
  (submissions ?? []).forEach((submission) => {
    if (!submission.contributor_id) return;
    counts.set(submission.contributor_id, (counts.get(submission.contributor_id) ?? 0) + 1);
  });

  return contributors.map((contributor): AdminContributor => ({
    ...contributor,
    submissionCount: counts.get(contributor.id) ?? 0,
  }));
}

export async function getChapters() {
  await requireAdminProfile();
  const serviceClient = getAdminClient();

  if (!serviceClient) {
    return [] as ChapterRow[];
  }

  const { data, error } = await serviceClient
    .from("archive_chapters")
    .select("*")
    .order("sort_order", { ascending: true });

  return error ? [] : data ?? [];
}

export async function getOpenWhenLetters() {
  await requireAdminProfile();
  const serviceClient = getAdminClient();

  if (!serviceClient) {
    return [] as OpenWhenLetterRow[];
  }

  const { data, error } = await serviceClient
    .from("open_when_letters")
    .select("*")
    .order("sort_order", { ascending: true });

  return error ? [] : data ?? [];
}

export async function getArchiveSettings() {
  await requireAdminProfile();
  const serviceClient = getAdminClient();

  if (!serviceClient) {
    return null;
  }

  return getSettingsRow(serviceClient);
}
