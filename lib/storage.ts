import type { MediaAssetType } from "@/lib/types";

export const STORAGE_BUCKETS = {
  photos: "elizabeth-photos",
  voiceNotes: "elizabeth-voice-notes",
  videos: "elizabeth-videos",
  music: "elizabeth-music",
} as const;

export const MAX_FILE_SIZE_BYTES = {
  photos: 8 * 1024 * 1024,
  voiceNotes: 25 * 1024 * 1024,
  videos: 80 * 1024 * 1024,
  music: 25 * 1024 * 1024,
} as const;

export const ALLOWED_MIME_TYPES = {
  photos: ["image/jpeg", "image/png", "image/webp"],
  voiceNotes: [
    "audio/mpeg",
    "audio/mp4",
    "audio/mp3",
    "audio/m4a",
    "audio/x-m4a",
    "audio/wav",
    "audio/x-wav",
    "audio/wave",
    "audio/webm",
  ],
  videos: ["video/mp4", "video/quicktime", "video/webm"],
  music: [
    "audio/mpeg",
    "audio/mp4",
    "audio/mp3",
    "audio/m4a",
    "audio/x-m4a",
    "audio/wav",
    "audio/x-wav",
    "audio/wave",
    "audio/webm",
  ],
} as const;

export type StorageKind = keyof typeof STORAGE_BUCKETS;
export type ContributorStorageKind = Exclude<StorageKind, "music">;

export function getStorageKindForMediaType(type: MediaAssetType): StorageKind {
  if (type === "image") return "photos";
  if (type === "audio") return "voiceNotes";
  return "videos";
}

export function getBucketForMediaType(type: MediaAssetType) {
  return STORAGE_BUCKETS[getStorageKindForMediaType(type)];
}

export function validateStorageFile(kind: StorageKind, file: { size: number; type: string }) {
  const allowedTypes = ALLOWED_MIME_TYPES[kind];
  const maxSize = MAX_FILE_SIZE_BYTES[kind];

  if (!(allowedTypes as readonly string[]).includes(file.type)) {
    return {
      valid: false,
      reason: `Unsupported file type. Allowed: ${allowedTypes.join(", ")}.`,
    };
  }

  if (file.size > maxSize) {
    return {
      valid: false,
      reason: `File is too large. Maximum size is ${Math.round(maxSize / 1024 / 1024)}MB.`,
    };
  }

  return { valid: true, reason: null };
}

export function buildContributorStoragePath(params: {
  contributorId: string;
  submissionId: string;
  kind: ContributorStorageKind;
  fileName: string;
}) {
  const directory = params.kind === "voiceNotes" ? "voice" : params.kind === "videos" ? "videos" : "photos";
  const safeFileName = params.fileName.replace(/[^a-zA-Z0-9._-]/g, "-");
  return `contributors/${params.contributorId}/submissions/${params.submissionId}/${directory}/${Date.now()}-${safeFileName}`;
}

export function buildMusicStoragePath(params: { trackId: string; fileName: string }) {
  const safeFileName = params.fileName.replace(/[^a-zA-Z0-9._-]/g, "-");
  return `music/${params.trackId}/${Date.now()}-${safeFileName}`;
}
