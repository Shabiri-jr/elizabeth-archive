"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { z } from "zod";
import { getArchiveAccessState } from "@/lib/archive/access";
import { addFavourite, itemCanBeFavourited, removeFavourite } from "@/lib/archive/favourites";
import { clearElizabethArchiveSession } from "@/lib/archive/session";

const favouriteSchema = z.object({
  itemType: z.enum(["submission", "memory", "future_wish", "media", "open_when_letter"]),
  itemId: z.string().uuid(),
  shouldSave: z.boolean(),
});

export async function closeElizabethArchive() {
  await clearElizabethArchiveSession();
  redirect("/elizabeth/login");
}

export async function toggleElizabethFavourite(input: z.input<typeof favouriteSchema>) {
  const parsed = favouriteSchema.parse(input);
  const access = await getArchiveAccessState();

  if (!access.allowed || access.isAdminPreview) {
    return {
      ok: false,
      message: "Favourites are only available inside Elizabeth's private archive session.",
      saved: false,
    };
  }

  const canFavourite = await itemCanBeFavourited(parsed.itemType, parsed.itemId);

  if (!canFavourite) {
    return {
      ok: false,
      message: "This moment is not available to save right now.",
      saved: false,
    };
  }

  const ok = parsed.shouldSave
    ? Boolean(await addFavourite(parsed.itemType, parsed.itemId))
    : await removeFavourite(parsed.itemType, parsed.itemId);

  if (ok) {
    revalidatePath("/archive/favourites");
  }

  return {
    ok,
    message: parsed.shouldSave ? "Saved to your favourites." : "Removed from favourites.",
    saved: parsed.shouldSave && ok,
  };
}
