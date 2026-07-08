import { NextRequest, NextResponse } from "next/server";
import { getAdminAccess } from "@/lib/auth";
import { createServiceRoleClient } from "@/lib/supabase/server";

export const dynamic = "force-dynamic";

type ExportType = "approved" | "all" | "launch";

function exportTypeFromRequest(request: NextRequest): ExportType {
  const value = request.nextUrl.searchParams.get("type");
  return value === "all" || value === "launch" ? value : "approved";
}

function jsonAttachment(payload: unknown, filename: string) {
  return new NextResponse(JSON.stringify(payload, null, 2), {
    status: 200,
    headers: {
      "Cache-Control": "no-store",
      "Content-Type": "application/json; charset=utf-8",
      "Content-Disposition": `attachment; filename="${filename}"`,
    },
  });
}

async function requireAdminExportClient() {
  const access = await getAdminAccess();

  if (access.status !== "admin") {
    return { error: NextResponse.json({ message: "Admin access required." }, { status: 401 }) };
  }

  const serviceClient = createServiceRoleClient();

  if (!serviceClient) {
    return { error: NextResponse.json({ message: "Supabase service role is not configured." }, { status: 503 }) };
  }

  return { serviceClient };
}

export async function GET(request: NextRequest) {
  const context = await requireAdminExportClient();

  if ("error" in context) {
    return context.error;
  }

  const type = exportTypeFromRequest(request);
  const { serviceClient } = context;
  const generatedAt = new Date().toISOString();

  const [{ data: settings }, { data: chapters }] = await Promise.all([
    serviceClient.from("archive_settings").select("*").order("updated_at", { ascending: false }).limit(1).maybeSingle(),
    serviceClient
      .from("archive_chapters")
      .select("id, chapter_number, slug, title, subtitle, body, sort_order, is_visible, updated_at")
      .order("sort_order", { ascending: true }),
  ]);

  if (type === "approved" || type === "launch") {
    const [{ data: submissions }, { data: media }] = await Promise.all([
      serviceClient
        .from("birthday_submissions")
        .select("id, contributor_id, name, relationship, birthday_message, memory, one_word, future_wish, permission_given, status, created_at, updated_at")
        .eq("status", "approved")
        .order("created_at", { ascending: true }),
      serviceClient
        .from("media_assets")
        .select("id, submission_id, contributor_id, type, bucket, storage_path, public_url, caption, status, created_at")
        .eq("status", "approved")
        .order("created_at", { ascending: true }),
    ]);

    const payload = {
      export_type: type,
      generated_at: generatedAt,
      archive_settings: settings,
      visible_chapters: (chapters ?? []).filter((chapter) => chapter.is_visible),
      approved_submissions: submissions ?? [],
      approved_media_assets: media ?? [],
      safety_notes: [
        "Contributor private tokens are not included.",
        "Admin notes are not included.",
        "Auth data and secrets are not included.",
      ],
    };

    return jsonAttachment(payload, type === "launch" ? "elizabeth-launch-backup.json" : "elizabeth-approved-archive.json");
  }

  const [{ data: submissions }, { data: media }] = await Promise.all([
    serviceClient
      .from("birthday_submissions")
      .select("id, contributor_id, name, relationship, birthday_message, memory, one_word, future_wish, permission_given, status, created_at, updated_at")
      .order("created_at", { ascending: true }),
    serviceClient
      .from("media_assets")
      .select("id, submission_id, contributor_id, type, bucket, storage_path, public_url, caption, status, created_at")
      .order("created_at", { ascending: true }),
  ]);

  return jsonAttachment(
    {
      export_type: "all",
      generated_at: generatedAt,
      archive_settings: settings,
      chapters: chapters ?? [],
      submissions: submissions ?? [],
      media_assets: media ?? [],
      safety_notes: [
        "Contributor private tokens are not included.",
        "Admin notes are not included.",
        "Auth data and secrets are not included.",
      ],
    },
    "elizabeth-all-submissions.json",
  );
}
