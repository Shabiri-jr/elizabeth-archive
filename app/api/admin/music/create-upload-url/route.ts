import { randomBytes } from "node:crypto";
import { NextResponse, type NextRequest } from "next/server";
import { z } from "zod";
import { requireAdminApiContext } from "@/lib/admin/api";
import { STORAGE_BUCKETS } from "@/lib/storage";

export const dynamic = "force-dynamic";

const MAX_MUSIC_FILE_SIZE = 25 * 1024 * 1024;
const allowedContentTypes = new Set(["audio/mpeg", "audio/mp4", "audio/x-m4a", "audio/wav", "audio/webm"]);
const extensionByContentType: Record<string, string> = {
  "audio/mpeg": "mp3",
  "audio/mp4": "m4a",
  "audio/x-m4a": "m4a",
  "audio/wav": "wav",
  "audio/webm": "webm",
};

const uploadRequestSchema = z.object({
  filename: z.string().trim().min(1).max(240),
  contentType: z.string().trim().min(1).max(120),
  fileSize: z.number().int().positive().max(MAX_MUSIC_FILE_SIZE),
  title: z.string().trim().min(1).max(160),
  description: z.string().trim().max(500).optional().nullable(),
  defaultVolume: z.number().min(0).max(1).optional(),
});

function extensionFromFilename(filename: string) {
  return filename.split(".").pop()?.toLowerCase() ?? "";
}

function createMusicStoragePath(filename: string, contentType: string) {
  const requestedExtension = extensionFromFilename(filename);
  const safeExtension = extensionByContentType[contentType];

  if (!safeExtension || requestedExtension !== safeExtension) {
    throw new Error("The audio file extension does not match its content type.");
  }

  return `music/${Date.now()}-${randomBytes(8).toString("hex")}.${safeExtension}`;
}

export async function POST(request: NextRequest) {
  const adminContext = await requireAdminApiContext(request);

  if (!adminContext.ok) {
    return adminContext.response;
  }

  let input: z.infer<typeof uploadRequestSchema>;

  try {
    input = uploadRequestSchema.parse(await request.json());
  } catch {
    return NextResponse.json({ error: "Invalid music upload request." }, { status: 400 });
  }

  if (!allowedContentTypes.has(input.contentType)) {
    return NextResponse.json({ error: "Unsupported music file type." }, { status: 400 });
  }

  let storagePath: string;

  try {
    storagePath = createMusicStoragePath(input.filename, input.contentType);
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Invalid music filename." },
      { status: 400 },
    );
  }

  const { data, error } = await adminContext.serviceClient.storage
    .from(STORAGE_BUCKETS.music)
    .createSignedUploadUrl(storagePath, { upsert: false });

  if (error || !data) {
    return NextResponse.json({ error: error?.message ?? "Could not create signed upload URL." }, { status: 500 });
  }

  return NextResponse.json({
    bucket: STORAGE_BUCKETS.music,
    storagePath,
    token: data.token,
    signedUrl: data.signedUrl,
  });
}
