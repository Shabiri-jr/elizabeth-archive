import { z } from "zod";

export const CONTRIBUTOR_FIELD_LIMITS = {
  name: 120,
  relationship: 120,
  birthdayMessage: 2000,
  memory: 2000,
  oneWord: 30,
  futureWish: 1500,
} as const;

const trimmedRequiredString = (label: string, maxLength: number) =>
  z
    .string()
    .trim()
    .min(1, `${label} is required.`)
    .max(maxLength, `${label} is too long.`);

const trimmedOptionalString = (label: string, maxLength: number) =>
  z
    .string()
    .trim()
    .max(maxLength, `${label} is too long.`)
    .optional()
    .transform((value) => (value ? value : ""));

export const contributorSubmissionSchema = z
  .object({
    token: z.string().trim().min(1, "Invite token is missing."),
    name: trimmedRequiredString("Your name", CONTRIBUTOR_FIELD_LIMITS.name),
    relationship: trimmedRequiredString("Your relationship to Elizabeth", CONTRIBUTOR_FIELD_LIMITS.relationship),
    birthdayMessage: trimmedRequiredString("Birthday message", CONTRIBUTOR_FIELD_LIMITS.birthdayMessage),
    memory: trimmedOptionalString("Memory", CONTRIBUTOR_FIELD_LIMITS.memory),
    oneWord: trimmedOptionalString("One word", CONTRIBUTOR_FIELD_LIMITS.oneWord),
    futureWish: trimmedOptionalString("Future wish", CONTRIBUTOR_FIELD_LIMITS.futureWish),
    permission: z.literal("on", {
      error: "Please give permission before submitting.",
    }),
  })
  .refine(
    (data) =>
      [data.birthdayMessage, data.memory, data.oneWord, data.futureWish].some(
        (value) => value.trim().length > 0,
      ),
    {
      path: ["birthdayMessage"],
      message: "Share a note, memory, word, or prayer for Elizabeth.",
    },
  );

export type ContributorSubmissionInput = z.infer<typeof contributorSubmissionSchema>;
export type ContributorFieldErrors = Partial<Record<keyof ContributorSubmissionInput | "photos" | "voiceNote" | "video" | "form", string>>;

export function getFormString(formData: FormData, name: string) {
  const value = formData.get(name);
  return typeof value === "string" ? value : "";
}

export function parseContributorSubmission(formData: FormData) {
  const parsed = contributorSubmissionSchema.safeParse({
    token: getFormString(formData, "token"),
    name: getFormString(formData, "name"),
    relationship: getFormString(formData, "relationship"),
    birthdayMessage: getFormString(formData, "birthdayMessage"),
    memory: getFormString(formData, "memory"),
    oneWord: getFormString(formData, "oneWord"),
    futureWish: getFormString(formData, "futureWish"),
    permission: getFormString(formData, "permission"),
  });

  if (parsed.success) {
    return { success: true as const, data: parsed.data, errors: {} };
  }

  const errors: ContributorFieldErrors = {};

  for (const issue of parsed.error.issues) {
    const field = issue.path[0];

    if (typeof field === "string" && !(field in errors)) {
      errors[field as keyof ContributorFieldErrors] = issue.message;
    }
  }

  return { success: false as const, data: null, errors };
}
