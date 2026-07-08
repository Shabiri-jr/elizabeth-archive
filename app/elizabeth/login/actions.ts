"use server";

import { redirect } from "next/navigation";
import {
  createElizabethArchiveSession,
  isElizabethAccessCodeValid,
} from "@/lib/archive/session";

export type ElizabethAccessState = {
  status: "idle" | "error";
  message: string;
};

export async function requestElizabethAccess(
  _previousState: ElizabethAccessState,
  formData: FormData,
): Promise<ElizabethAccessState> {
  const accessCode = String(formData.get("accessCode") ?? "").trim();

  if (!process.env.ELIZABETH_ACCESS_CODE) {
    return {
      status: "error",
      message: "Elizabeth's private access code is not configured yet.",
    };
  }

  if (!isElizabethAccessCodeValid(accessCode)) {
    return {
      status: "error",
      message: "That access code does not match this private archive.",
    };
  }

  const didSetCookie = await createElizabethArchiveSession();

  if (!didSetCookie) {
    return {
      status: "error",
      message: "The archive access cookie could not be created.",
    };
  }

  redirect("/archive");
}
