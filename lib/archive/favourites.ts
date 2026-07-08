import "server-only";

import { createServiceRoleClient } from "@/lib/supabase/server";
import type { Database, FavouriteItemType } from "@/lib/types";

type ServiceClient = NonNullable<ReturnType<typeof createServiceRoleClient>>;
type FavouriteRow = Database["public"]["Tables"]["elizabeth_favourites"]["Row"];

export type FavouriteKey = `${FavouriteItemType}:${string}`;

export function createFavouriteKey(itemType: FavouriteItemType, itemId: string): FavouriteKey {
  return `${itemType}:${itemId}`;
}

export function parseFavouriteKey(key: string): { itemType: FavouriteItemType; itemId: string } | null {
  const [itemType, itemId] = key.split(":");

  if (
    !itemId ||
    !["submission", "memory", "future_wish", "media", "open_when_letter"].includes(itemType ?? "")
  ) {
    return null;
  }

  return {
    itemType: itemType as FavouriteItemType,
    itemId,
  };
}

export async function getFavouriteKeys(): Promise<FavouriteKey[]> {
  const serviceClient = createServiceRoleClient();

  if (!serviceClient) return [];

  const { data, error } = await serviceClient
    .from("elizabeth_favourites")
    .select("item_type, item_id")
    .order("created_at", { ascending: false });

  return error ? [] : (data ?? []).map((row) => createFavouriteKey(row.item_type, row.item_id));
}

async function submissionCanBeFavourited(
  serviceClient: ServiceClient,
  itemType: FavouriteItemType,
  itemId: string,
) {
  const { data, error } = await serviceClient
    .from("birthday_submissions")
    .select("id, birthday_message, memory, future_wish, status")
    .eq("id", itemId)
    .eq("status", "approved")
    .maybeSingle();

  if (error || !data) return false;
  if (itemType === "memory") return Boolean(data.memory?.trim());
  if (itemType === "future_wish") return Boolean(data.future_wish?.trim());
  return Boolean(data.birthday_message.trim());
}

async function mediaCanBeFavourited(serviceClient: ServiceClient, itemId: string) {
  const { data, error } = await serviceClient
    .from("media_assets")
    .select("id, status, submission_id")
    .eq("id", itemId)
    .eq("status", "approved")
    .maybeSingle();

  if (error || !data?.submission_id) return false;

  const { data: submission } = await serviceClient
    .from("birthday_submissions")
    .select("id")
    .eq("id", data.submission_id)
    .eq("status", "approved")
    .maybeSingle();

  return Boolean(submission);
}

async function openWhenLetterCanBeFavourited(serviceClient: ServiceClient, itemId: string) {
  const { data, error } = await serviceClient
    .from("open_when_letters")
    .select("id")
    .eq("id", itemId)
    .eq("is_visible", true)
    .maybeSingle();

  return !error && Boolean(data);
}

export async function itemCanBeFavourited(itemType: FavouriteItemType, itemId: string) {
  const serviceClient = createServiceRoleClient();

  if (!serviceClient) return false;

  if (itemType === "media") {
    return mediaCanBeFavourited(serviceClient, itemId);
  }

  if (itemType === "open_when_letter") {
    return openWhenLetterCanBeFavourited(serviceClient, itemId);
  }

  return submissionCanBeFavourited(serviceClient, itemType, itemId);
}

export async function addFavourite(itemType: FavouriteItemType, itemId: string): Promise<FavouriteRow | null> {
  const serviceClient = createServiceRoleClient();

  if (!serviceClient) return null;

  const { data, error } = await serviceClient
    .from("elizabeth_favourites")
    .upsert({ item_type: itemType, item_id: itemId }, { onConflict: "item_type,item_id" })
    .select("*")
    .single();

  return error ? null : data;
}

export async function removeFavourite(itemType: FavouriteItemType, itemId: string) {
  const serviceClient = createServiceRoleClient();

  if (!serviceClient) return false;

  const { error } = await serviceClient
    .from("elizabeth_favourites")
    .delete()
    .eq("item_type", itemType)
    .eq("item_id", itemId);

  return !error;
}

