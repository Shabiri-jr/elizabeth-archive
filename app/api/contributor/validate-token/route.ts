import { NextResponse } from "next/server";
import { validateContributorToken } from "@/lib/tokens";

export const dynamic = "force-dynamic";

export async function POST(request: Request) {
  let payload: unknown;

  try {
    payload = await request.json();
  } catch {
    return NextResponse.json(
      {
        status: "invalid",
        message: "A token is required.",
        contributor: null,
      },
      {
        status: 400,
        headers: {
          "Cache-Control": "no-store",
        },
      },
    );
  }

  const token =
    typeof payload === "object" && payload !== null && "token" in payload
      ? String(payload.token ?? "")
      : "";

  const result = await validateContributorToken(token);
  const statusCode = result.status === "valid" ? 200 : result.status === "error" ? 500 : 400;

  return NextResponse.json(
    {
      status: result.status,
      message: result.message,
      contributor: result.contributor
        ? {
            token: result.contributor.token,
            name: result.contributor.name,
            relationship: result.contributor.relationship,
            expiresAt: result.contributor.expiresAt,
          }
        : null,
    },
    {
      status: statusCode,
      headers: {
        "Cache-Control": "no-store",
      },
    },
  );
}
