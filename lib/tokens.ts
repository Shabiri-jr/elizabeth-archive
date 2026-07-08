import "server-only";

import { createClient, createServiceRoleClient, isSupabaseConfigured } from "@/lib/supabase/server";
import type { ContributorTokenResult, Database } from "@/lib/types";

const TOKEN_PATTERN = /^[a-zA-Z0-9_-]{6,128}$/;
const LOCAL_TEST_TOKEN = "test-elizabeth-invite";

type ServiceClient = NonNullable<ReturnType<typeof createServiceRoleClient>>;
type ContributorRow = Pick<
  Database["public"]["Tables"]["contributors"]["Row"],
  "id" | "token" | "name" | "relationship" | "is_used" | "max_submissions" | "expires_at"
>;

export function normalizeContributorToken(token: string) {
  return token.trim();
}

export function isContributorTokenShapeValid(token: string) {
  return TOKEN_PATTERN.test(token);
}

function getUsedMessage() {
  return "This invitation has already reached its submission limit.";
}

async function getSubmissionCount(serviceClient: ServiceClient, contributorId: string) {
  const { count, error } = await serviceClient
    .from("birthday_submissions")
    .select("*", { count: "exact", head: true })
    .eq("contributor_id", contributorId);

  if (error) {
    return null;
  }

  return count ?? 0;
}

function buildValidTokenResult(contributor: ContributorRow, usedSubmissions: number): ContributorTokenResult {
  const remainingSubmissions = Math.max(contributor.max_submissions - usedSubmissions, 0);

  return {
    status: "valid",
    contributor: {
      id: contributor.id,
      token: contributor.token,
      name: contributor.name,
      relationship: contributor.relationship,
      expiresAt: contributor.expires_at,
      maxSubmissions: contributor.max_submissions,
      usedSubmissions,
      remainingSubmissions,
    },
    message: "Invitation is valid.",
  };
}

export async function validateContributorToken(token: string): Promise<ContributorTokenResult> {
  const normalizedToken = normalizeContributorToken(token);

  if (!isContributorTokenShapeValid(normalizedToken)) {
    return {
      status: "invalid",
      contributor: null,
      message: "This invitation link does not look valid.",
    };
  }

  if (!isSupabaseConfigured()) {
    if (normalizedToken === LOCAL_TEST_TOKEN) {
      return {
        status: "valid",
        contributor: {
          token: normalizedToken,
          name: "Local preview contributor",
          relationship: "Build 3 test invite",
          expiresAt: null,
          maxSubmissions: 1,
          usedSubmissions: 0,
          remainingSubmissions: 1,
        },
        message: "Supabase is not configured, so this local preview token is allowed for UI testing.",
      };
    }

    return {
      status: "unconfigured",
      contributor: null,
      message: "Supabase is not configured yet. Contributor links cannot be checked.",
    };
  }

  const publicClient = await createClient();
  const serviceClient = createServiceRoleClient();

  if (!publicClient || !serviceClient) {
    return {
      status: "unconfigured",
      contributor: null,
      message: "Server-side Supabase credentials are missing for secure invite validation.",
    };
  }

  const { data: settings, error: settingsError } = await publicClient
    .from("archive_settings")
    .select("contributions_open")
    .limit(1)
    .maybeSingle();

  if (settingsError) {
    return {
      status: "error",
      contributor: null,
      message: "Contribution settings could not be loaded.",
    };
  }

  if (settings?.contributions_open === false) {
    return {
      status: "closed",
      contributor: null,
      message: "Birthday contributions are currently closed.",
    };
  }

  const { data: contributor, error } = await serviceClient
    .from("contributors")
    .select("id, token, name, relationship, is_used, max_submissions, expires_at")
    .eq("token", normalizedToken)
    .maybeSingle();

  if (error) {
    return {
      status: "error",
      contributor: null,
      message: "This invitation could not be checked.",
    };
  }

  if (!contributor) {
    return {
      status: "invalid",
      contributor: null,
      message: "This invitation link is not valid.",
    };
  }

  if (contributor.expires_at && new Date(contributor.expires_at).getTime() < Date.now()) {
    return {
      status: "expired",
      contributor: null,
      message: "This invitation link has expired.",
    };
  }

  const usedSubmissions = await getSubmissionCount(serviceClient, contributor.id);

  if (usedSubmissions === null) {
    return {
      status: "error",
      contributor: null,
      message: "This invitation could not be checked.",
    };
  }

  if (contributor.is_used || usedSubmissions >= contributor.max_submissions) {
    return {
      status: "used",
      contributor: null,
      message: getUsedMessage(),
    };
  }

  return buildValidTokenResult(contributor, usedSubmissions);
}

export async function markContributorUsedIfComplete(params: {
  serviceClient: ServiceClient;
  contributorId: string;
  maxSubmissions: number;
}) {
  const usedSubmissions = await getSubmissionCount(params.serviceClient, params.contributorId);

  if (usedSubmissions === null || usedSubmissions < params.maxSubmissions) {
    return;
  }

  await params.serviceClient
    .from("contributors")
    .update({ is_used: true })
    .eq("id", params.contributorId);
}
