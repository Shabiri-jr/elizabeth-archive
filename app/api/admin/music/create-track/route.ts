import { revalidatePath } from "next/cache";
import { NextResponse, type NextRequest } from "next/server";
import { z } from "zod";
import { logAdminActivity } from "@/lib/admin/logs";
import { requireAdminApiContext } from "@/lib/admin/api";
import { STORAGE_BUCKETS } from "@/lib/storage";

export const dynamic = "force-dynamic";

const trackRequestSchema = z.object({
  title: z.string().trim().min(1).max(160),
  description: z.string().trim().max(500).nullable().optional(),
  bucket: z.literal(STORAGE_BUCKETS.music),
  storagePath: z.string().trim().regex(/^music\/[0-9]+-[a-f0-9]{16}\.(mp3|m4a|wav|webm)$/),
  defaultVolume: z.number().min(0).max(1),
  isActive: z.boolean(),
});

function revalidateMusicPaths() {
  revalidatePath("/admin");
  revalidatePath("/admin/music");
  revalidatePath("/archive");
  revalidatePath("/archive/preview");
  revalidatePath("/archive/open-when");
  revalidatePath("/archive/from-me");
  revalidatePath("/archive/favourites");
}

export async function POST(request: NextRequest) {
  const adminContext = await requireAdminApiContext(request);

  if (!adminContext.ok) {
    return adminContext.response;
  }

  let input: z.infer<typeof trackRequestSchema>;

  try {
    input = trackRequestSchema.parse(await request.json());
  } catch {
    return NextResponse.json({ error: "Invalid music track metadata." }, { status: 400 });
  }

  const { error: signedUrlError } = await adminContext.serviceClient.storage
    .from(input.bucket)
    .createSignedUrl(input.storagePath, 60);

  if (signedUrlError) {
    return NextResponse.json({ error: "Uploaded music file was not found in private storage." }, { status: 400 });
  }

  const { data, error } = await adminContext.serviceClient
    .from("music_tracks")
    .insert({
      title: input.title,
      description: input.description?.trim() || null,
      bucket: input.bucket,
      storage_path: input.storagePath,
      is_active: input.isActive,
      default_volume: input.defaultVolume,
    })
    .select("id")
    .single();

  if (error || !data) {
    await adminContext.serviceClient.storage.from(input.bucket).remove([input.storagePath]);
    return NextResponse.json({ error: error?.message ?? "Could not create music track." }, { status: 500 });
  }

  if (input.isActive) {
    const { error: deactivateError } = await adminContext.serviceClient
      .from("music_tracks")
      .update({ is_active: false })
      .eq("is_active", true)
      .neq("id", data.id);

    if (deactivateError) {
      await adminContext.serviceClient.from("music_tracks").delete().eq("id", data.id);
      await adminContext.serviceClient.storage.from(input.bucket).remove([input.storagePath]);
      return NextResponse.json({ error: deactivateError.message }, { status: 500 });
    }
  }

  await logAdminActivity(adminContext.serviceClient, {
    adminId: adminContext.profile.id,
    action: "upload_music_track",
    targetTable: "music_tracks",
    targetId: data.id,
    metadata: {
      title: input.title,
      isActive: input.isActive,
      defaultVolume: input.defaultVolume,
      storagePath: input.storagePath,
    },
  });

  revalidateMusicPaths();

  return NextResponse.json({ id: data.id });
}
