import "server-only";

import QRCode from "qrcode";
import { headers } from "next/headers";

export async function getSiteOrigin() {
  const configuredOrigin = process.env.NEXT_PUBLIC_SITE_URL || process.env.APP_ORIGIN;

  if (configuredOrigin) {
    try {
      return new URL(configuredOrigin).origin;
    } catch {
      // Fall back to request headers when local environment values are still placeholders.
    }
  }

  const headerStore = await headers();
  const host = headerStore.get("x-forwarded-host") ?? headerStore.get("host") ?? "localhost:3000";
  const protocol = headerStore.get("x-forwarded-proto") ?? (host.startsWith("localhost") ? "http" : "https");

  return `${protocol}://${host}`;
}

export async function getElizabethInviteUrl() {
  return new URL("/for-elizabeth", await getSiteOrigin()).toString();
}

export async function createInviteQrSvg(url: string) {
  return QRCode.toString(url, {
    type: "svg",
    margin: 1,
    width: 720,
    color: {
      dark: "#241A17",
      light: "#FFFAF3",
    },
  });
}

