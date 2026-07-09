import "server-only";

import { NextResponse, type NextRequest } from "next/server";
import { getAdminAccess } from "@/lib/auth";
import { createServiceRoleClient } from "@/lib/supabase/server";

export function assertSameOrigin(request: NextRequest) {
  const origin = request.headers.get("origin");
  const host = request.headers.get("host");

  if (!origin || !host) return false;

  try {
    const originUrl = new URL(origin);
    return originUrl.host === host;
  } catch {
    return false;
  }
}

export async function requireAdminApiContext(request: NextRequest) {
  if (!assertSameOrigin(request)) {
    return {
      ok: false as const,
      response: NextResponse.json({ error: "Invalid request origin." }, { status: 403 }),
    };
  }

  const access = await getAdminAccess();

  if (access.status !== "admin") {
    return {
      ok: false as const,
      response: NextResponse.json({ error: "Admin access is required." }, { status: 401 }),
    };
  }

  const serviceClient = createServiceRoleClient();

  if (!serviceClient) {
    return {
      ok: false as const,
      response: NextResponse.json({ error: "Supabase service role credentials are not configured." }, { status: 503 }),
    };
  }

  return {
    ok: true as const,
    profile: access.profile,
    serviceClient,
  };
}
