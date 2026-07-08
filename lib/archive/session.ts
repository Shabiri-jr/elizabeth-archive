import "server-only";

import { createHmac, randomBytes, timingSafeEqual } from "node:crypto";
import { cookies } from "next/headers";

export const ELIZABETH_ARCHIVE_SESSION_COOKIE = "elizabeth_archive_session";

const SESSION_MAX_AGE_SECONDS = 60 * 60 * 24 * 30;

type ElizabethSessionPayload = {
  sub: "elizabeth";
  iat: number;
  exp: number;
  nonce: string;
};

function getSessionSecret() {
  if (process.env.ELIZABETH_SESSION_SECRET) {
    return process.env.ELIZABETH_SESSION_SECRET;
  }

  if (process.env.NODE_ENV === "production") {
    return null;
  }

  return process.env.ELIZABETH_ACCESS_CODE || null;
}

function encodeBase64Url(value: string) {
  return Buffer.from(value, "utf8").toString("base64url");
}

function decodeBase64Url(value: string) {
  return Buffer.from(value, "base64url").toString("utf8");
}

function signPayload(payload: string) {
  const secret = getSessionSecret();

  if (!secret) {
    return null;
  }

  return createHmac("sha256", secret).update(payload).digest("base64url");
}

function safeCompare(a: string, b: string) {
  const left = Buffer.from(a);
  const right = Buffer.from(b);

  if (left.length !== right.length) {
    return false;
  }

  return timingSafeEqual(left, right);
}

export function isElizabethAccessCodeValid(accessCode: string) {
  const configuredCode = process.env.ELIZABETH_ACCESS_CODE;

  if (!configuredCode || !accessCode) {
    return false;
  }

  return safeCompare(accessCode, configuredCode);
}

export async function createElizabethArchiveSession() {
  const now = Math.floor(Date.now() / 1000);
  const payload: ElizabethSessionPayload = {
    sub: "elizabeth",
    iat: now,
    exp: now + SESSION_MAX_AGE_SECONDS,
    nonce: randomBytes(16).toString("base64url"),
  };
  const encodedPayload = encodeBase64Url(JSON.stringify(payload));
  const signature = signPayload(encodedPayload);

  if (!signature) {
    return false;
  }

  const cookieStore = await cookies();
  cookieStore.set(ELIZABETH_ARCHIVE_SESSION_COOKIE, `${encodedPayload}.${signature}`, {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: SESSION_MAX_AGE_SECONDS,
  });

  return true;
}

export async function hasValidElizabethArchiveSession() {
  const secret = getSessionSecret();

  if (!secret) {
    return false;
  }

  const cookieStore = await cookies();
  const cookieValue = cookieStore.get(ELIZABETH_ARCHIVE_SESSION_COOKIE)?.value;

  if (!cookieValue) {
    return false;
  }

  const [encodedPayload, signature] = cookieValue.split(".");

  if (!encodedPayload || !signature) {
    return false;
  }

  const expectedSignature = signPayload(encodedPayload);

  if (!expectedSignature || !safeCompare(signature, expectedSignature)) {
    return false;
  }

  try {
    const payload = JSON.parse(decodeBase64Url(encodedPayload)) as ElizabethSessionPayload;
    return payload.sub === "elizabeth" && payload.exp > Math.floor(Date.now() / 1000);
  } catch {
    return false;
  }
}

export async function clearElizabethArchiveSession() {
  const cookieStore = await cookies();
  cookieStore.delete(ELIZABETH_ARCHIVE_SESSION_COOKIE);
}
