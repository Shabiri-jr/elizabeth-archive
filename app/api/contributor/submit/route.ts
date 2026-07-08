import { NextResponse } from "next/server";
import { collectSubmissionFiles, uploadSubmissionFiles } from "@/lib/uploads";
import { createServiceRoleClient, isSupabaseConfigured } from "@/lib/supabase/server";
import { markContributorUsedIfComplete, validateContributorToken } from "@/lib/tokens";
import { parseContributorSubmission, type ContributorFieldErrors } from "@/lib/validation/contributor";

export const dynamic = "force-dynamic";

function noStoreJson(payload: unknown, status: number) {
  return NextResponse.json(payload, {
    status,
    headers: {
      "Cache-Control": "no-store",
    },
  });
}

function getTokenErrorStatus(status: string) {
  if (status === "expired") return 410;
  if (status === "used") return 409;
  if (status === "closed") return 403;
  if (status === "unconfigured") return 503;
  if (status === "error") return 500;
  return 400;
}

async function cleanupSubmission(serviceClient: NonNullable<ReturnType<typeof createServiceRoleClient>>, submissionId: string) {
  await serviceClient.from("birthday_submissions").delete().eq("id", submissionId);
}

export async function POST(request: Request) {
  const contentType = request.headers.get("content-type") ?? "";

  if (!contentType.toLowerCase().includes("multipart/form-data")) {
    return noStoreJson(
      {
        message: "Please submit the form with the expected upload format.",
        errors: { form: "Please submit the form again." },
      },
      415,
    );
  }

  let formData: FormData;

  try {
    formData = await request.formData();
  } catch {
    return noStoreJson(
      {
        message: "Your message could not be read. Please try again with smaller files.",
        errors: { form: "Your message could not be read. Please try again with smaller files." },
      },
      400,
    );
  }

  const parsedText = parseContributorSubmission(formData);
  const uploadValidation = collectSubmissionFiles(formData);
  const errors: ContributorFieldErrors = {
    ...parsedText.errors,
    ...uploadValidation.errors,
  };

  if (!parsedText.success || !uploadValidation.success) {
    return noStoreJson(
      {
        message: "Some details need a little attention.",
        errors,
      },
      400,
    );
  }

  const tokenResult = await validateContributorToken(parsedText.data.token);

  if (tokenResult.status !== "valid" || !tokenResult.contributor?.id) {
    return noStoreJson(
      {
        message: tokenResult.message,
        status: tokenResult.status,
        errors: { form: tokenResult.message },
      },
      getTokenErrorStatus(tokenResult.status),
    );
  }

  if (!isSupabaseConfigured()) {
    return noStoreJson(
      {
        message: "Supabase is not configured yet.",
        errors: { form: "Supabase is not configured yet." },
      },
      503,
    );
  }

  const serviceClient = createServiceRoleClient();

  if (!serviceClient) {
    return noStoreJson(
      {
        message: "Server-side Supabase credentials are missing.",
        errors: { form: "Submission saving is not configured yet." },
      },
      503,
    );
  }

  const contributor = tokenResult.contributor;
  const contributorId = contributor.id;

  if (!contributorId) {
    return noStoreJson(
      {
        message: "This invitation cannot create submissions yet.",
        errors: { form: "This invitation cannot create submissions yet." },
      },
      503,
    );
  }

  const { data: submission, error: submissionError } = await serviceClient
    .from("birthday_submissions")
    .insert({
      contributor_id: contributorId,
      name: parsedText.data.name,
      relationship: parsedText.data.relationship,
      birthday_message: parsedText.data.birthdayMessage,
      memory: parsedText.data.memory || null,
      one_word: parsedText.data.oneWord || null,
      future_wish: parsedText.data.futureWish || null,
      permission_given: true,
      status: "pending",
    })
    .select("id")
    .single();

  if (submissionError || !submission) {
    return noStoreJson(
      {
        message: "Your message could not be saved yet. Please try again.",
        errors: { form: "Your message could not be saved yet. Please try again." },
      },
      500,
    );
  }

  const uploadResult = await uploadSubmissionFiles({
    serviceClient,
    contributorId,
    submissionId: submission.id,
    files: uploadValidation.files,
  });

  if (!uploadResult.success) {
    await cleanupSubmission(serviceClient, submission.id);

    return noStoreJson(
      {
        message: uploadResult.error,
        errors: { form: uploadResult.error },
      },
      500,
    );
  }

  await markContributorUsedIfComplete({
    serviceClient,
    contributorId,
    maxSubmissions: contributor.maxSubmissions ?? 1,
  });

  await serviceClient.from("admin_activity_logs").insert({
    action: "contributor_submission_created",
    target_table: "birthday_submissions",
    target_id: submission.id,
    metadata: {
      contributor_id: contributorId,
      media_count: uploadResult.mediaCount,
    },
  });

  return noStoreJson(
    {
      status: "success",
      submissionId: submission.id,
      mediaCount: uploadResult.mediaCount,
    },
    201,
  );
}
