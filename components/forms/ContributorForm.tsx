"use client";

import { useRef, useState } from "react";
import type { FormEvent } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/Button";
import { FormField } from "@/components/forms/FormField";
import { MediaUploadField } from "@/components/forms/MediaUploadField";
import { PermissionCheckbox } from "@/components/forms/PermissionCheckbox";
import { TextareaField } from "@/components/forms/TextareaField";
import { ALLOWED_MIME_TYPES, MAX_FILE_SIZE_BYTES } from "@/lib/storage";
import { parseContributorSubmission, type ContributorFieldErrors } from "@/lib/validation/contributor";
import type { SafeContributor } from "@/lib/types";

type ContributorFormProps = {
  token: string;
  contributor: SafeContributor;
};

type ClientUploadRule = {
  field: "photos" | "voiceNote" | "video";
  files: File[];
  maxFiles: number;
  maxSize: number;
  allowedMimeTypes: readonly string[];
};

function formatMegabytes(bytes: number) {
  return `${Math.round(bytes / 1024 / 1024)}MB`;
}

function validateClientFiles(rules: ClientUploadRule[]) {
  const errors: ContributorFieldErrors = {};

  for (const rule of rules) {
    if (rule.files.length > rule.maxFiles) {
      errors[rule.field] = `Please choose no more than ${rule.maxFiles} ${rule.maxFiles === 1 ? "file" : "files"}.`;
      continue;
    }

    for (const file of rule.files) {
      if (!(rule.allowedMimeTypes as readonly string[]).includes(file.type)) {
        errors[rule.field] = `Unsupported file type. Accepted: ${rule.allowedMimeTypes.join(", ")}.`;
        break;
      }

      if (file.size > rule.maxSize) {
        errors[rule.field] = `This file is too large. Maximum size is ${formatMegabytes(rule.maxSize)}.`;
        break;
      }
    }
  }

  return errors;
}

async function readJsonResponse(response: Response) {
  try {
    return await response.json();
  } catch {
    return null;
  }
}

export function ContributorForm({ token, contributor }: ContributorFormProps) {
  const router = useRouter();
  const [photos, setPhotos] = useState<File[]>([]);
  const [voiceNotes, setVoiceNotes] = useState<File[]>([]);
  const [videos, setVideos] = useState<File[]>([]);
  const [fieldErrors, setFieldErrors] = useState<ContributorFieldErrors>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const submitLockRef = useRef(false);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (submitLockRef.current) {
      return;
    }

    const form = event.currentTarget;
    const formData = new FormData(form);
    const parsed = parseContributorSubmission(formData);
    const mediaErrors = validateClientFiles([
      {
        field: "photos",
        files: photos,
        maxFiles: 5,
        maxSize: MAX_FILE_SIZE_BYTES.photos,
        allowedMimeTypes: ALLOWED_MIME_TYPES.photos,
      },
      {
        field: "voiceNote",
        files: voiceNotes,
        maxFiles: 1,
        maxSize: MAX_FILE_SIZE_BYTES.voiceNotes,
        allowedMimeTypes: ALLOWED_MIME_TYPES.voiceNotes,
      },
      {
        field: "video",
        files: videos,
        maxFiles: 1,
        maxSize: MAX_FILE_SIZE_BYTES.videos,
        allowedMimeTypes: ALLOWED_MIME_TYPES.videos,
      },
    ]);

    const nextErrors = { ...parsed.errors, ...mediaErrors };

    if (!parsed.success || Object.keys(nextErrors).length > 0) {
      setFieldErrors(nextErrors);
      return;
    }

    setFieldErrors({});
    submitLockRef.current = true;
    setIsSubmitting(true);

    try {
      const response = await fetch("/api/contributor/submit", {
        method: "POST",
        body: formData,
      });
      const payload = await readJsonResponse(response);

      if (!response.ok) {
        if (["used", "expired", "closed", "invalid"].includes(String(payload?.status ?? ""))) {
          router.replace(`/contribute/${encodeURIComponent(token)}`);
          router.refresh();
          return;
        }

        setFieldErrors(payload?.errors ?? { form: payload?.message ?? "Your message could not be saved yet." });
        return;
      }

      router.push(`/contribute/${encodeURIComponent(token)}/success`);
      router.refresh();
    } catch {
      setFieldErrors({
        form: "The connection was interrupted. Please try again.",
      });
    } finally {
      submitLockRef.current = false;
      setIsSubmitting(false);
    }
  }

  return (
    <form className="grid gap-8" aria-label="Birthday wish submission form" onSubmit={handleSubmit}>
      <input type="hidden" name="token" value={token} />

      {fieldErrors.form ? (
        <div
          className="rounded-2xl border border-blush/55 bg-blush/16 px-4 py-3 text-sm font-semibold leading-6 text-espresso/72"
          role="alert"
        >
          {fieldErrors.form}
        </div>
      ) : null}

      <fieldset className="space-y-5" disabled={isSubmitting}>
        <legend className="mb-4 flex items-center gap-3 font-serif text-2xl font-semibold text-espresso">
          <span className="flex size-8 items-center justify-center rounded-full bg-pale-lilac text-sm font-bold text-deep-lilac">
            1
          </span>
          Start with you
        </legend>
        <div className="grid gap-6 md:grid-cols-2">
          <FormField
            id="name"
            name="name"
            label="Your name"
            placeholder="How should we show your name?"
            autoComplete="name"
            defaultValue={contributor.name ?? ""}
            error={fieldErrors.name}
            required
          />
          <FormField
            id="relationship"
            name="relationship"
            label="How Elizabeth knows you"
            placeholder="Friend, sister, colleague..."
            helper="A simple description is enough."
            defaultValue={contributor.relationship ?? ""}
            error={fieldErrors.relationship}
            required
          />
        </div>
      </fieldset>

      <fieldset className="space-y-5 border-t border-lilac-border/55 pt-7" disabled={isSubmitting}>
        <legend className="mb-4 flex items-center gap-3 font-serif text-2xl font-semibold text-espresso">
          <span className="flex size-8 items-center justify-center rounded-full bg-pale-lilac text-sm font-bold text-deep-lilac">
            2
          </span>
          Say what matters
        </legend>
        <TextareaField
          id="birthday-message"
          name="birthdayMessage"
          label="Your birthday note to Elizabeth"
          placeholder="Dear Elizabeth..."
          helper="Write the words you would want her to keep and read again."
          maxLength={2000}
          error={fieldErrors.birthdayMessage}
          required
        />
        <TextareaField
          id="memory"
          name="memory"
          label="A memory you still keep"
          placeholder="Tell a moment, a detail, or something she may not know stayed with you."
          helper="Share a moment, a prayer, a memory, or something she may not know she means to you."
          maxLength={2000}
          error={fieldErrors.memory}
        />
        <div className="grid gap-6 md:grid-cols-2">
          <FormField
            id="one-word"
            name="oneWord"
            label="One word for Elizabeth"
            placeholder="Radiant"
            maxLength={30}
            error={fieldErrors.oneWord}
          />
          <FormField
            id="future-wish"
            name="futureWish"
            label="A prayer or wish for her next year"
            placeholder="A blessing for the year ahead"
            maxLength={1500}
            error={fieldErrors.futureWish}
          />
        </div>
      </fieldset>

      <fieldset className="space-y-5 border-t border-lilac-border/55 pt-7" disabled={isSubmitting}>
        <legend className="mb-4 flex items-center gap-3 font-serif text-2xl font-semibold text-espresso">
          <span className="flex size-8 items-center justify-center rounded-full bg-pale-lilac text-sm font-bold text-deep-lilac">
            3
          </span>
          Add a keepsake
        </legend>
        <MediaUploadField
          id="photos"
          name="photos"
          label="Photo keepsakes"
          description="Add up to five photos Elizabeth may want to keep."
          helper="Accepted: jpg, jpeg, png, webp."
          accept="image/jpeg,image/png,image/webp,.jpg,.jpeg,.png,.webp"
          maxFiles={5}
          maxSizeLabel="8MB"
          multiple
          disabled={isSubmitting}
          files={photos}
          error={fieldErrors.photos}
          kind="photos"
          onFilesChange={setPhotos}
        />
        <MediaUploadField
          id="voice-note"
          name="voiceNote"
          label="Voice note"
          description="Optional, but beautiful if you want Elizabeth to hear your voice."
          helper="Accepted: mp3, m4a, wav, webm."
          accept="audio/mpeg,audio/mp4,audio/mp3,audio/m4a,audio/wav,audio/webm,.mp3,.m4a,.wav,.webm"
          maxFiles={1}
          maxSizeLabel="25MB"
          disabled={isSubmitting}
          files={voiceNotes}
          error={fieldErrors.voiceNote}
          kind="voice"
          onFilesChange={setVoiceNotes}
        />
        <MediaUploadField
          id="video"
          name="video"
          label="Short video"
          description="Optional. A short video can become one of the most personal archive moments."
          helper="Accepted: mp4, mov, webm."
          accept="video/mp4,video/quicktime,video/webm,.mp4,.mov,.webm"
          maxFiles={1}
          maxSizeLabel="80MB"
          disabled={isSubmitting}
          files={videos}
          error={fieldErrors.video}
          kind="video"
          onFilesChange={setVideos}
        />
      </fieldset>

      <PermissionCheckbox error={fieldErrors.permission} disabled={isSubmitting} />

      <div className="flex flex-col gap-3 border-t border-lilac-border/55 pt-7 sm:flex-row sm:items-center sm:justify-between">
        <p className="max-w-md text-sm leading-6 text-espresso/56">
          Your message will be reviewed before it appears in Elizabeth&apos;s archive.
        </p>
        <Button type="submit" size="lg" disabled={isSubmitting}>
          {isSubmitting ? "Saving your message..." : "Submit Birthday Wish"}
        </Button>
      </div>
    </form>
  );
}
