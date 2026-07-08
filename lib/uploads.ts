import "server-only";

import { randomUUID } from "node:crypto";
import type { SupabaseClient } from "@supabase/supabase-js";
import { ALLOWED_MIME_TYPES, MAX_FILE_SIZE_BYTES, STORAGE_BUCKETS } from "@/lib/storage";
import type { ContributorFieldErrors } from "@/lib/validation/contributor";
import type { Database, MediaAssetType } from "@/lib/types";

type ServiceClient = SupabaseClient<Database>;

type UploadKind = "photos" | "voiceNote" | "video";

type UploadRule = {
  field: UploadKind;
  bucket: string;
  directory: "photos" | "voice" | "videos";
  mediaType: MediaAssetType;
  maxFiles: number;
  maxSize: number;
  allowedMimeTypes: readonly string[];
};

export type SubmissionUploadFile = {
  file: File;
  bucket: string;
  directory: UploadRule["directory"];
  mediaType: MediaAssetType;
};

type UploadedObject = {
  bucket: string;
  path: string;
};

export const UPLOAD_RULES: Record<UploadKind, UploadRule> = {
  photos: {
    field: "photos",
    bucket: STORAGE_BUCKETS.photos,
    directory: "photos",
    mediaType: "image",
    maxFiles: 5,
    maxSize: MAX_FILE_SIZE_BYTES.photos,
    allowedMimeTypes: ALLOWED_MIME_TYPES.photos,
  },
  voiceNote: {
    field: "voiceNote",
    bucket: STORAGE_BUCKETS.voiceNotes,
    directory: "voice",
    mediaType: "audio",
    maxFiles: 1,
    maxSize: MAX_FILE_SIZE_BYTES.voiceNotes,
    allowedMimeTypes: ALLOWED_MIME_TYPES.voiceNotes,
  },
  video: {
    field: "video",
    bucket: STORAGE_BUCKETS.videos,
    directory: "videos",
    mediaType: "video",
    maxFiles: 1,
    maxSize: MAX_FILE_SIZE_BYTES.videos,
    allowedMimeTypes: ALLOWED_MIME_TYPES.videos,
  },
};

export function formatMegabytes(bytes: number) {
  return `${Math.round(bytes / 1024 / 1024)}MB`;
}

export function sanitizeFileName(fileName: string) {
  const fallback = "keepsake";
  const withoutPath = fileName.split(/[\\/]/).pop() ?? fallback;
  const collapsed = withoutPath.replace(/[^a-zA-Z0-9._-]/g, "-").replace(/-+/g, "-");
  const trimmed = collapsed.replace(/^-+|-+$/g, "").slice(0, 80);
  return trimmed || fallback;
}

function getExtension(fileName: string) {
  const safeName = sanitizeFileName(fileName);
  const extension = safeName.includes(".") ? safeName.split(".").pop() : "";
  return extension ? `.${extension.toLowerCase()}` : "";
}

function getFiles(formData: FormData, field: UploadKind) {
  return formData
    .getAll(field)
    .filter((value): value is File => value instanceof File && value.size > 0);
}

function validateFile(rule: UploadRule, file: File) {
  if (!(rule.allowedMimeTypes as readonly string[]).includes(file.type)) {
    return `Unsupported file type. Accepted: ${rule.allowedMimeTypes.join(", ")}.`;
  }

  if (file.size > rule.maxSize) {
    return `This file is too large. Maximum size is ${formatMegabytes(rule.maxSize)}.`;
  }

  return null;
}

export function collectSubmissionFiles(formData: FormData) {
  const errors: ContributorFieldErrors = {};
  const files: SubmissionUploadFile[] = [];

  for (const rule of Object.values(UPLOAD_RULES)) {
    const selectedFiles = getFiles(formData, rule.field);

    if (selectedFiles.length > rule.maxFiles) {
      errors[rule.field] = `Please choose no more than ${rule.maxFiles} ${rule.maxFiles === 1 ? "file" : "files"}.`;
      continue;
    }

    for (const file of selectedFiles) {
      const fileError = validateFile(rule, file);

      if (fileError) {
        errors[rule.field] = fileError;
        break;
      }

      files.push({
        file,
        bucket: rule.bucket,
        directory: rule.directory,
        mediaType: rule.mediaType,
      });
    }
  }

  return {
    success: Object.keys(errors).length === 0,
    files,
    errors,
  };
}

export function buildSubmissionStoragePath(params: {
  contributorId: string;
  submissionId: string;
  directory: SubmissionUploadFile["directory"];
  originalFileName: string;
}) {
  const extension = getExtension(params.originalFileName);
  const uniqueName = `${Date.now()}-${randomUUID()}${extension}`;
  return `contributors/${params.contributorId}/submissions/${params.submissionId}/${params.directory}/${uniqueName}`;
}

async function removeUploadedObjects(serviceClient: ServiceClient, uploadedObjects: UploadedObject[]) {
  const byBucket = new Map<string, string[]>();

  for (const object of uploadedObjects) {
    byBucket.set(object.bucket, [...(byBucket.get(object.bucket) ?? []), object.path]);
  }

  await Promise.all(
    [...byBucket.entries()].map(([bucket, paths]) =>
      serviceClient.storage.from(bucket).remove(paths),
    ),
  );
}

export async function uploadSubmissionFiles(params: {
  serviceClient: ServiceClient;
  contributorId: string;
  submissionId: string;
  files: SubmissionUploadFile[];
}) {
  const uploadedObjects: UploadedObject[] = [];
  const mediaRows: Database["public"]["Tables"]["media_assets"]["Insert"][] = [];

  for (const uploadFile of params.files) {
    const storagePath = buildSubmissionStoragePath({
      contributorId: params.contributorId,
      submissionId: params.submissionId,
      directory: uploadFile.directory,
      originalFileName: uploadFile.file.name,
    });

    const { error } = await params.serviceClient.storage
      .from(uploadFile.bucket)
      .upload(storagePath, uploadFile.file, {
        contentType: uploadFile.file.type,
        upsert: false,
      });

    if (error) {
      await removeUploadedObjects(params.serviceClient, uploadedObjects);
      return {
        success: false as const,
        error: "One of the keepsakes could not be uploaded. Please try again.",
      };
    }

    uploadedObjects.push({ bucket: uploadFile.bucket, path: storagePath });
    mediaRows.push({
      submission_id: params.submissionId,
      contributor_id: params.contributorId,
      type: uploadFile.mediaType,
      bucket: uploadFile.bucket,
      storage_path: storagePath,
      status: "pending",
    });
  }

  if (mediaRows.length === 0) {
    return { success: true as const, mediaCount: 0 };
  }

  const { error: metadataError } = await params.serviceClient.from("media_assets").insert(mediaRows);

  if (metadataError) {
    await removeUploadedObjects(params.serviceClient, uploadedObjects);
    return {
      success: false as const,
      error: "The keepsakes uploaded, but their archive records could not be saved.",
    };
  }

  return { success: true as const, mediaCount: mediaRows.length };
}
