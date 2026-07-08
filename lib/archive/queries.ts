import "server-only";

import { createSignedArchiveMediaUrl } from "@/lib/archive/media";
import { createServiceRoleClient } from "@/lib/supabase/server";
import type { Database, GalleryMode, MediaAssetType } from "@/lib/types";

type ChapterRow = Database["public"]["Tables"]["archive_chapters"]["Row"];
type SubmissionRow = Database["public"]["Tables"]["birthday_submissions"]["Row"];
type MediaRow = Database["public"]["Tables"]["media_assets"]["Row"];
type SettingsRow = Database["public"]["Tables"]["archive_settings"]["Row"];
type OpenWhenLetterRow = Database["public"]["Tables"]["open_when_letters"]["Row"];

export type ArchiveChapter = Pick<
  ChapterRow,
  "id" | "chapter_number" | "slug" | "title" | "subtitle" | "body" | "sort_order"
>;

export type OpenWhenLetter = Pick<
  OpenWhenLetterRow,
  "id" | "slug" | "title" | "subtitle" | "body" | "mood" | "sort_order"
>;

export type ArchiveMedia = {
  id: string;
  type: MediaAssetType;
  url: string | null;
  caption: string | null;
  adminCaption: string | null;
  contributorName: string;
  relationship: string;
  submissionId: string;
  birthdayMessage: string | null;
  memory: string | null;
  futureWish: string | null;
  galleryMode: GalleryMode | null;
  displayOrder: number | null;
  featured: boolean;
  memoryDate: string | null;
  emotionTag: string | null;
  createdAt: string;
};

export type ArchiveSubmission = {
  id: string;
  name: string;
  relationship: string;
  birthdayMessage: string;
  memory: string | null;
  oneWord: string | null;
  futureWish: string | null;
  createdAt: string;
  images: ArchiveMedia[];
  audio: ArchiveMedia[];
  videos: ArchiveMedia[];
};

export type ArchiveData = {
  settings: SettingsRow | null;
  chapters: ArchiveChapter[];
  submissions: ArchiveSubmission[];
  words: string[];
  messages: ArchiveSubmission[];
  memories: ArchiveSubmission[];
  futureWishes: ArchiveSubmission[];
  images: ArchiveMedia[];
  audio: ArchiveMedia[];
  videos: ArchiveMedia[];
  openWhenLetters: OpenWhenLetter[];
};

async function getVisibleChapters(serviceClient: NonNullable<ReturnType<typeof createServiceRoleClient>>) {
  const { data, error } = await serviceClient
    .from("archive_chapters")
    .select("id, chapter_number, slug, title, subtitle, body, sort_order")
    .eq("is_visible", true)
    .order("sort_order", { ascending: true });

  return error ? [] : data ?? [];
}

async function getSettings(serviceClient: NonNullable<ReturnType<typeof createServiceRoleClient>>) {
  const { data, error } = await serviceClient
    .from("archive_settings")
    .select("*")
    .order("updated_at", { ascending: false })
    .limit(1)
    .maybeSingle();

  return error ? null : data;
}

async function getVisibleOpenWhenLetters(serviceClient: NonNullable<ReturnType<typeof createServiceRoleClient>>) {
  const { data, error } = await serviceClient
    .from("open_when_letters")
    .select("id, slug, title, subtitle, body, mood, sort_order")
    .eq("is_visible", true)
    .order("sort_order", { ascending: true });

  return error ? [] : data ?? [];
}

function buildSubmission(row: SubmissionRow): ArchiveSubmission {
  return {
    id: row.id,
    name: row.name,
    relationship: row.relationship,
    birthdayMessage: row.birthday_message,
    memory: row.memory,
    oneWord: row.one_word,
    futureWish: row.future_wish,
    createdAt: row.created_at,
    images: [],
    audio: [],
    videos: [],
  };
}

function addMediaToSubmission(submission: ArchiveSubmission, media: ArchiveMedia) {
  if (media.type === "image") {
    submission.images.push(media);
    return;
  }

  if (media.type === "audio") {
    submission.audio.push(media);
    return;
  }

  submission.videos.push(media);
}

export async function getArchiveData(): Promise<ArchiveData> {
  const serviceClient = createServiceRoleClient();

  if (!serviceClient) {
    return {
      settings: null,
      chapters: [],
      submissions: [],
      words: [],
      messages: [],
      memories: [],
      futureWishes: [],
      images: [],
      audio: [],
      videos: [],
      openWhenLetters: [],
    };
  }

  const [{ data: submissionRows, error: submissionsError }, chapters, settings, openWhenLetters] = await Promise.all([
    serviceClient
      .from("birthday_submissions")
      .select("*")
      .eq("status", "approved")
      .order("created_at", { ascending: true }),
    getVisibleChapters(serviceClient),
    getSettings(serviceClient),
    getVisibleOpenWhenLetters(serviceClient),
  ]);

  if (submissionsError || !submissionRows?.length) {
    return {
      settings,
      chapters,
      submissions: [],
      words: [],
      messages: [],
      memories: [],
      futureWishes: [],
      images: [],
      audio: [],
      videos: [],
      openWhenLetters,
    };
  }

  const submissions = submissionRows.map(buildSubmission);
  const submissionsById = new Map(submissions.map((submission) => [submission.id, submission]));
  const submissionIds = submissions.map((submission) => submission.id);

  const { data: mediaRows } = await serviceClient
    .from("media_assets")
    .select("*")
    .eq("status", "approved")
    .in("submission_id", submissionIds)
    .order("created_at", { ascending: true });

  const media = await Promise.all(
    (mediaRows ?? []).map(async (row: MediaRow): Promise<ArchiveMedia | null> => {
      if (!row.submission_id) return null;

      const submission = submissionsById.get(row.submission_id);
      if (!submission) return null;

      const url = await createSignedArchiveMediaUrl(serviceClient, row.bucket, row.storage_path);
      const archiveMedia: ArchiveMedia = {
        id: row.id,
        type: row.type,
        url,
        caption: row.caption,
        adminCaption: row.admin_caption,
        contributorName: submission.name,
        relationship: submission.relationship,
        submissionId: submission.id,
        birthdayMessage: submission.birthdayMessage,
        memory: submission.memory,
        futureWish: submission.futureWish,
        galleryMode: row.gallery_mode,
        displayOrder: row.display_order,
        featured: row.featured,
        memoryDate: row.memory_date,
        emotionTag: row.emotion_tag,
        createdAt: row.created_at,
      };

      addMediaToSubmission(submission, archiveMedia);
      return archiveMedia;
    }),
  );

  const approvedMedia = media.filter((item): item is ArchiveMedia => Boolean(item?.url));

  return {
    settings,
    chapters,
    submissions,
    words: submissions
      .map((submission) => submission.oneWord?.trim())
      .filter((word): word is string => Boolean(word)),
    messages: submissions.filter((submission) => Boolean(submission.birthdayMessage.trim())),
    memories: submissions.filter((submission) => Boolean(submission.memory?.trim())),
    futureWishes: submissions.filter((submission) => Boolean(submission.futureWish?.trim())),
    images: approvedMedia.filter((item) => item.type === "image"),
    audio: approvedMedia.filter((item) => item.type === "audio"),
    videos: approvedMedia.filter((item) => item.type === "video"),
    openWhenLetters,
  };
}
