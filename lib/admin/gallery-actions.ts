"use server";

import { revalidatePath } from "next/cache";
import { z } from "zod";
import { logAdminActivity } from "@/lib/admin/logs";
import { requireAdminActionContext } from "@/lib/admin/permissions";
import type { Json } from "@/lib/types";

const uuidSchema = z.string().uuid();
const statusSchema = z.enum(["pending", "approved", "rejected"]);
const galleryModeSchema = z.preprocess(
  (value) => {
    const text = String(value ?? "").trim();
    return text.length ? text : null;
  },
  z.enum(["polaroid", "film-strip", "timeline", "floating"]).nullable(),
);
const optionalTextSchema = z.preprocess(
  (value) => {
    const text = String(value ?? "").trim();
    return text.length ? text : null;
  },
  z.string().max(500).nullable(),
);
const displayOrderSchema = z.preprocess(
  (value) => {
    const text = String(value ?? "").trim();
    return text.length ? Number(text) : null;
  },
  z.number().int().min(0).max(9999).nullable(),
);

function formText(formData: FormData, key: string) {
  return String(formData.get(key) ?? "").trim();
}

function formBoolean(formData: FormData, key: string) {
  return formData.get(key) === "on";
}

export async function updateGalleryImage(formData: FormData) {
  const mediaId = uuidSchema.parse(formText(formData, "mediaId"));
  const input = {
    status: statusSchema.parse(formText(formData, "status")),
    gallery_mode: galleryModeSchema.parse(formData.get("galleryMode")),
    display_order: displayOrderSchema.parse(formData.get("displayOrder")),
    featured: formBoolean(formData, "featured"),
    memory_date: optionalTextSchema.parse(formData.get("memoryDate")),
    emotion_tag: optionalTextSchema.parse(formData.get("emotionTag")),
    admin_caption: optionalTextSchema.parse(formData.get("adminCaption")),
  };
  const { profile, serviceClient } = await requireAdminActionContext();

  const { error } = await serviceClient
    .from("media_assets")
    .update(input)
    .eq("id", mediaId)
    .eq("type", "image");

  if (error) {
    throw new Error(error.message);
  }

  await logAdminActivity(serviceClient, {
    adminId: profile.id,
    action: "update_gallery_image",
    targetTable: "media_assets",
    targetId: mediaId,
    metadata: input as unknown as Json,
  });

  revalidatePath("/admin");
  revalidatePath("/admin/gallery");
  revalidatePath("/admin/media");
  revalidatePath("/archive");
  revalidatePath("/archive/preview");
  revalidatePath("/archive/favourites");
}
