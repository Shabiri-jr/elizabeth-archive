"use server";

import { randomBytes } from "node:crypto";
import { revalidatePath } from "next/cache";
import { z } from "zod";
import { requireAdminActionContext } from "@/lib/admin/permissions";
import { logAdminActivity } from "@/lib/admin/logs";
import { createContributorToken } from "@/lib/contributors/create-token";
import type { Database, Json, SubmissionStatus } from "@/lib/types";

type ServiceClient = Awaited<ReturnType<typeof requireAdminActionContext>>["serviceClient"];
type MediaRow = Database["public"]["Tables"]["media_assets"]["Row"];

const uuidSchema = z.string().uuid();
const statusSchema = z.enum(["pending", "approved", "rejected"]);
const requiredLongTextSchema = z.string().trim().min(1).max(6000);
const optionalTextSchema = z.preprocess(
  (value) => {
    const text = String(value ?? "").trim();
    return text.length ? text : null;
  },
  z.string().max(4000).nullable(),
);

function formText(formData: FormData, key: string) {
  return String(formData.get(key) ?? "").trim();
}

function formBoolean(formData: FormData, key: string) {
  return formData.get(key) === "on";
}

function slugify(value: string) {
  const slug = value
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 56);

  return slug || `letter-${randomBytes(4).toString("hex")}`;
}

function parseDateOrNull(value: string, endOfDay = false) {
  if (!value) return null;

  const date = new Date(endOfDay ? `${value}T23:59:59.000Z` : value);
  if (Number.isNaN(date.getTime())) {
    throw new Error("The selected date is not valid.");
  }

  return date.toISOString();
}

async function removeStorageFiles(serviceClient: ServiceClient, mediaRows: Pick<MediaRow, "bucket" | "storage_path">[]) {
  const failures: string[] = [];
  const pathsByBucket = new Map<string, string[]>();

  mediaRows.forEach((media) => {
    pathsByBucket.set(media.bucket, [...(pathsByBucket.get(media.bucket) ?? []), media.storage_path]);
  });

  for (const [bucket, paths] of pathsByBucket) {
    const { error } = await serviceClient.storage.from(bucket).remove(paths);

    if (error) {
      failures.push(`${bucket}: ${error.message}`);
    }
  }

  return failures;
}

function submissionActionForStatus(status: SubmissionStatus) {
  if (status === "approved") return "approve_submission";
  if (status === "rejected") return "reject_submission";
  return "restore_submission";
}

function mediaActionForStatus(status: SubmissionStatus) {
  if (status === "approved") return "approve_media";
  if (status === "rejected") return "reject_media";
  return "restore_media";
}

export async function setSubmissionStatus(formData: FormData) {
  const submissionId = uuidSchema.parse(formText(formData, "submissionId"));
  const status = statusSchema.parse(formText(formData, "status"));
  const { profile, serviceClient } = await requireAdminActionContext();

  const { error } = await serviceClient
    .from("birthday_submissions")
    .update({ status })
    .eq("id", submissionId);

  if (error) {
    throw new Error(error.message);
  }

  await logAdminActivity(serviceClient, {
    adminId: profile.id,
    action: submissionActionForStatus(status),
    targetTable: "birthday_submissions",
    targetId: submissionId,
    metadata: { status },
  });

  revalidatePath("/admin");
  revalidatePath("/admin/submissions");
}

export async function updateSubmissionNotes(formData: FormData) {
  const submissionId = uuidSchema.parse(formText(formData, "submissionId"));
  const adminNotes = optionalTextSchema.parse(formData.get("adminNotes"));
  const { profile, serviceClient } = await requireAdminActionContext();

  const { error } = await serviceClient
    .from("birthday_submissions")
    .update({ admin_notes: adminNotes })
    .eq("id", submissionId);

  if (error) {
    throw new Error(error.message);
  }

  await logAdminActivity(serviceClient, {
    adminId: profile.id,
    action: "update_submission_notes",
    targetTable: "birthday_submissions",
    targetId: submissionId,
  });

  revalidatePath("/admin/submissions");
}

export async function deleteSubmission(formData: FormData) {
  const submissionId = uuidSchema.parse(formText(formData, "submissionId"));
  const { profile, serviceClient } = await requireAdminActionContext();

  const { data: mediaRows } = await serviceClient
    .from("media_assets")
    .select("bucket, storage_path")
    .eq("submission_id", submissionId);

  const storageFailures = await removeStorageFiles(serviceClient, mediaRows ?? []);

  const { error } = await serviceClient
    .from("birthday_submissions")
    .delete()
    .eq("id", submissionId);

  if (error) {
    throw new Error(error.message);
  }

  await logAdminActivity(serviceClient, {
    adminId: profile.id,
    action: "delete_submission",
    targetTable: "birthday_submissions",
    targetId: submissionId,
    metadata: {
      removedMediaCount: mediaRows?.length ?? 0,
      storageFailures,
    },
  });

  revalidatePath("/admin");
  revalidatePath("/admin/submissions");
  revalidatePath("/admin/media");
}

export async function setMediaStatus(formData: FormData) {
  const mediaId = uuidSchema.parse(formText(formData, "mediaId"));
  const status = statusSchema.parse(formText(formData, "status"));
  const { profile, serviceClient } = await requireAdminActionContext();

  const { error } = await serviceClient
    .from("media_assets")
    .update({ status })
    .eq("id", mediaId);

  if (error) {
    throw new Error(error.message);
  }

  await logAdminActivity(serviceClient, {
    adminId: profile.id,
    action: mediaActionForStatus(status),
    targetTable: "media_assets",
    targetId: mediaId,
    metadata: { status },
  });

  revalidatePath("/admin");
  revalidatePath("/admin/media");
  revalidatePath("/admin/submissions");
}

export async function deleteMedia(formData: FormData) {
  const mediaId = uuidSchema.parse(formText(formData, "mediaId"));
  const deleteFile = formBoolean(formData, "deleteFile");
  const { profile, serviceClient } = await requireAdminActionContext();

  const { data: media, error: mediaError } = await serviceClient
    .from("media_assets")
    .select("*")
    .eq("id", mediaId)
    .single();

  if (mediaError || !media) {
    throw new Error(mediaError?.message ?? "Media file was not found.");
  }

  const storageFailures = deleteFile ? await removeStorageFiles(serviceClient, [media]) : [];

  const { error } = await serviceClient.from("media_assets").delete().eq("id", mediaId);

  if (error) {
    throw new Error(error.message);
  }

  await logAdminActivity(serviceClient, {
    adminId: profile.id,
    action: "delete_media",
    targetTable: "media_assets",
    targetId: mediaId,
    metadata: {
      bucket: media.bucket,
      storagePath: media.storage_path,
      deletedStorageFile: deleteFile,
      storageFailures,
    },
  });

  revalidatePath("/admin");
  revalidatePath("/admin/media");
  revalidatePath("/admin/submissions");
}

const contributorSchema = z.object({
  name: optionalTextSchema,
  relationship: optionalTextSchema,
  email: z
    .preprocess((value) => {
      const text = String(value ?? "").trim();
      return text.length ? text : null;
    }, z.string().email().max(254).nullable()),
  maxSubmissions: z.coerce.number().int().min(1).max(50),
  expiresAt: z.string().trim().optional(),
  notes: optionalTextSchema,
});

export async function createContributorLink(formData: FormData) {
  const input = contributorSchema.parse({
    name: formData.get("name"),
    relationship: formData.get("relationship"),
    email: formData.get("email"),
    maxSubmissions: formData.get("maxSubmissions") || 1,
    expiresAt: formText(formData, "expiresAt"),
    notes: formData.get("notes"),
  });
  const { profile, serviceClient } = await requireAdminActionContext();
  const token = createContributorToken();
  const expiresAt = parseDateOrNull(input.expiresAt ?? "", true);

  const { data, error } = await serviceClient
    .from("contributors")
    .insert({
      token,
      name: input.name,
      relationship: input.relationship,
      email: input.email,
      max_submissions: input.maxSubmissions,
      expires_at: expiresAt,
      notes: input.notes,
      created_by: profile.id,
    })
    .select("id")
    .single();

  if (error) {
    throw new Error(error.message);
  }

  await logAdminActivity(serviceClient, {
    adminId: profile.id,
    action: "create_contributor_link",
    targetTable: "contributors",
    targetId: data.id,
    metadata: { maxSubmissions: input.maxSubmissions },
  });

  revalidatePath("/admin");
  revalidatePath("/admin/contributors");
}

export async function updateContributorLink(formData: FormData) {
  const contributorId = uuidSchema.parse(formText(formData, "contributorId"));
  const input = contributorSchema.parse({
    name: formData.get("name"),
    relationship: formData.get("relationship"),
    email: formData.get("email"),
    maxSubmissions: formData.get("maxSubmissions") || 1,
    expiresAt: formText(formData, "expiresAt"),
    notes: formData.get("notes"),
  });
  const { profile, serviceClient } = await requireAdminActionContext();

  const { error } = await serviceClient
    .from("contributors")
    .update({
      name: input.name,
      relationship: input.relationship,
      email: input.email,
      max_submissions: input.maxSubmissions,
      expires_at: parseDateOrNull(input.expiresAt ?? "", true),
      notes: input.notes,
      is_used: formBoolean(formData, "isUsed"),
    })
    .eq("id", contributorId);

  if (error) {
    throw new Error(error.message);
  }

  await logAdminActivity(serviceClient, {
    adminId: profile.id,
    action: "update_contributor_link",
    targetTable: "contributors",
    targetId: contributorId,
  });

  revalidatePath("/admin");
  revalidatePath("/admin/contributors");
}

export async function expireContributorLink(formData: FormData) {
  const contributorId = uuidSchema.parse(formText(formData, "contributorId"));
  const { profile, serviceClient } = await requireAdminActionContext();

  const { error } = await serviceClient
    .from("contributors")
    .update({ is_used: true, expires_at: new Date().toISOString() })
    .eq("id", contributorId);

  if (error) {
    throw new Error(error.message);
  }

  await logAdminActivity(serviceClient, {
    adminId: profile.id,
    action: "update_contributor_link",
    targetTable: "contributors",
    targetId: contributorId,
    metadata: { expired: true },
  });

  revalidatePath("/admin");
  revalidatePath("/admin/contributors");
}

export async function updateChapter(formData: FormData) {
  const chapterId = uuidSchema.parse(formText(formData, "chapterId"));
  const title = z.string().trim().min(1).max(160).parse(formData.get("title"));
  const subtitle = optionalTextSchema.parse(formData.get("subtitle"));
  const body = optionalTextSchema.parse(formData.get("body"));
  const sortOrder = z.coerce.number().int().min(0).max(999).parse(formData.get("sortOrder"));
  const { profile, serviceClient } = await requireAdminActionContext();

  const { error } = await serviceClient
    .from("archive_chapters")
    .update({
      title,
      subtitle,
      body,
      sort_order: sortOrder,
      is_visible: formBoolean(formData, "isVisible"),
    })
    .eq("id", chapterId);

  if (error) {
    throw new Error(error.message);
  }

  await logAdminActivity(serviceClient, {
    adminId: profile.id,
    action: "update_chapter",
    targetTable: "archive_chapters",
    targetId: chapterId,
    metadata: { title, sortOrder },
  });

  revalidatePath("/admin");
  revalidatePath("/admin/chapters");
  revalidatePath("/archive");
  revalidatePath("/archive/from-me");
  revalidatePath("/archive/preview");
}

const openWhenSchema = z.object({
  title: z.string().trim().min(1).max(160),
  subtitle: optionalTextSchema,
  mood: optionalTextSchema,
  body: requiredLongTextSchema,
  sortOrder: z.coerce.number().int().min(0).max(999),
});

export async function createOpenWhenLetter(formData: FormData) {
  const input = openWhenSchema.parse({
    title: formData.get("title"),
    subtitle: formData.get("subtitle"),
    mood: formData.get("mood"),
    body: formData.get("body"),
    sortOrder: formData.get("sortOrder") || 0,
  });
  const { profile, serviceClient } = await requireAdminActionContext();
  const slug = `${slugify(input.title)}-${randomBytes(3).toString("hex")}`;

  const { data, error } = await serviceClient
    .from("open_when_letters")
    .insert({
      slug,
      title: input.title,
      subtitle: input.subtitle,
      mood: input.mood,
      body: input.body,
      sort_order: input.sortOrder,
      is_visible: formBoolean(formData, "isVisible"),
    })
    .select("id")
    .single();

  if (error) {
    throw new Error(error.message);
  }

  await logAdminActivity(serviceClient, {
    adminId: profile.id,
    action: "create_open_when_letter",
    targetTable: "open_when_letters",
    targetId: data.id,
    metadata: { title: input.title, sortOrder: input.sortOrder },
  });

  revalidatePath("/admin");
  revalidatePath("/admin/open-when");
  revalidatePath("/archive");
  revalidatePath("/archive/open-when");
  revalidatePath("/archive/preview");
}

export async function updateOpenWhenLetter(formData: FormData) {
  const letterId = uuidSchema.parse(formText(formData, "letterId"));
  const input = openWhenSchema.parse({
    title: formData.get("title"),
    subtitle: formData.get("subtitle"),
    mood: formData.get("mood"),
    body: formData.get("body"),
    sortOrder: formData.get("sortOrder") || 0,
  });
  const { profile, serviceClient } = await requireAdminActionContext();

  const { error } = await serviceClient
    .from("open_when_letters")
    .update({
      title: input.title,
      subtitle: input.subtitle,
      mood: input.mood,
      body: input.body,
      sort_order: input.sortOrder,
      is_visible: formBoolean(formData, "isVisible"),
    })
    .eq("id", letterId);

  if (error) {
    throw new Error(error.message);
  }

  await logAdminActivity(serviceClient, {
    adminId: profile.id,
    action: "update_open_when_letter",
    targetTable: "open_when_letters",
    targetId: letterId,
    metadata: { title: input.title, sortOrder: input.sortOrder },
  });

  revalidatePath("/admin");
  revalidatePath("/admin/open-when");
  revalidatePath("/archive");
  revalidatePath("/archive/open-when");
  revalidatePath("/archive/preview");
}

export async function deleteOpenWhenLetter(formData: FormData) {
  const letterId = uuidSchema.parse(formText(formData, "letterId"));
  const { profile, serviceClient } = await requireAdminActionContext();

  const { error } = await serviceClient.from("open_when_letters").delete().eq("id", letterId);

  if (error) {
    throw new Error(error.message);
  }

  await logAdminActivity(serviceClient, {
    adminId: profile.id,
    action: "delete_open_when_letter",
    targetTable: "open_when_letters",
    targetId: letterId,
  });

  revalidatePath("/admin");
  revalidatePath("/admin/open-when");
  revalidatePath("/archive");
  revalidatePath("/archive/open-when");
  revalidatePath("/archive/preview");
}

export async function updateArchiveSettings(formData: FormData) {
  const settingsId = formText(formData, "settingsId") || "11111111-1111-1111-1111-111111111111";
  const birthdayDate = z.string().trim().min(1).parse(formData.get("birthdayDate"));
  const { profile, serviceClient } = await requireAdminActionContext();
  const settings = {
    id: uuidSchema.parse(settingsId),
    birthday_date: birthdayDate,
    archive_live: formBoolean(formData, "archiveLive"),
    contributions_open: formBoolean(formData, "contributionsOpen"),
    elizabeth_access_enabled: formBoolean(formData, "elizabethAccessEnabled"),
    reveal_mode_enabled: formBoolean(formData, "revealModeEnabled"),
    maintenance_mode: formBoolean(formData, "maintenanceMode"),
  };

  const { error } = await serviceClient.from("archive_settings").upsert(settings, { onConflict: "id" });

  if (error) {
    throw new Error(error.message);
  }

  await logAdminActivity(serviceClient, {
    adminId: profile.id,
    action: "update_archive_settings",
    targetTable: "archive_settings",
    targetId: settings.id,
    metadata: settings as unknown as Json,
  });

  revalidatePath("/admin");
  revalidatePath("/admin/settings");
  revalidatePath("/archive");
  revalidatePath("/archive/preview");
}
