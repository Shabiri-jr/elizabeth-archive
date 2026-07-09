"use client";

import { useRef, useState, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import { Music2 } from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import { STORAGE_BUCKETS } from "@/lib/storage";

const inputClasses =
  "min-h-12 w-full rounded-2xl border border-lilac-border/45 bg-ivory/70 px-4 text-sm text-espresso outline-none focus:border-deep-lilac/45 focus:ring-4 focus:ring-lilac-primary/16";

const MAX_MUSIC_FILE_SIZE = 25 * 1024 * 1024;
const allowedContentTypes = new Set(["audio/mpeg", "audio/mp4", "audio/x-m4a", "audio/wav", "audio/webm"]);

type UploadUrlResponse = {
  bucket: typeof STORAGE_BUCKETS.music;
  storagePath: string;
  token: string;
  signedUrl: string;
};

function validateMusicFile(file: File) {
  if (!allowedContentTypes.has(file.type)) {
    return "Unsupported file type. Use mp3, m4a, wav, or webm.";
  }

  if (file.size > MAX_MUSIC_FILE_SIZE) {
    return "Music file is too large. Maximum size is 25MB.";
  }

  const extension = file.name.split(".").pop()?.toLowerCase();
  const validExtension =
    (file.type === "audio/mpeg" && extension === "mp3") ||
    ((file.type === "audio/mp4" || file.type === "audio/x-m4a") && extension === "m4a") ||
    (file.type === "audio/wav" && extension === "wav") ||
    (file.type === "audio/webm" && extension === "webm");

  return validExtension ? null : "The file extension does not match the selected audio type.";
}

export function UploadMusicTrackForm() {
  const router = useRouter();
  const formRef = useRef<HTMLFormElement | null>(null);
  const [status, setStatus] = useState("");
  const [error, setError] = useState("");
  const [isUploading, setIsUploading] = useState(false);

  async function submitUpload(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (isUploading) return;

    const form = event.currentTarget;
    const formData = new FormData(form);
    const title = String(formData.get("title") ?? "").trim();
    const description = String(formData.get("description") ?? "").trim();
    const defaultVolume = Number(formData.get("defaultVolume") || 0.25);
    const isActive = formData.get("isActive") === "on";
    const file = formData.get("file");

    setError("");
    setStatus("");

    if (!title) {
      setError("Add a track title before uploading.");
      return;
    }

    if (!(file instanceof File) || file.size === 0) {
      setError("Choose a music file before uploading.");
      return;
    }

    const fileError = validateMusicFile(file);
    if (fileError) {
      setError(fileError);
      return;
    }

    if (!Number.isFinite(defaultVolume) || defaultVolume < 0 || defaultVolume > 1) {
      setError("Default volume must be between 0 and 1.");
      return;
    }

    setIsUploading(true);

    try {
      setStatus("Creating a private upload link...");
      const uploadUrlResponse = await fetch("/api/admin/music/create-upload-url", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          filename: file.name,
          contentType: file.type,
          fileSize: file.size,
          title,
          description: description || null,
          defaultVolume,
        }),
      });

      const uploadUrlPayload = (await uploadUrlResponse.json()) as UploadUrlResponse | { error?: string };

      if (!uploadUrlResponse.ok || !("token" in uploadUrlPayload)) {
        throw new Error("error" in uploadUrlPayload ? uploadUrlPayload.error : "Could not create upload URL.");
      }

      setStatus("Uploading music directly to Supabase Storage...");
      const supabase = createClient();
      const { error: uploadError } = await supabase.storage
        .from(uploadUrlPayload.bucket)
        .uploadToSignedUrl(uploadUrlPayload.storagePath, uploadUrlPayload.token, file, {
          contentType: file.type,
          cacheControl: "3600",
        });

      if (uploadError) {
        throw new Error(uploadError.message);
      }

      setStatus("Saving track details...");
      const createTrackResponse = await fetch("/api/admin/music/create-track", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          title,
          description: description || null,
          bucket: uploadUrlPayload.bucket,
          storagePath: uploadUrlPayload.storagePath,
          defaultVolume,
          isActive,
        }),
      });

      const createTrackPayload = (await createTrackResponse.json()) as { id?: string; error?: string };

      if (!createTrackResponse.ok || !createTrackPayload.id) {
        throw new Error(createTrackPayload.error ?? "Music uploaded, but metadata could not be saved.");
      }

      setStatus("Music track saved.");
      formRef.current?.reset();
      router.refresh();
    } catch (uploadError) {
      setError(uploadError instanceof Error ? uploadError.message : "Music upload failed.");
      setStatus("");
    } finally {
      setIsUploading(false);
    }
  }

  return (
    <form
      ref={formRef}
      onSubmit={submitUpload}
      className="rounded-[1.75rem] bg-warm-black/[0.035] p-1.5 ring-1 ring-espresso/7 shadow-[var(--shadow-beautiful-md)]"
    >
      <div className="rounded-[calc(1.75rem-0.375rem)] border border-porcelain/80 bg-porcelain/76 p-5">
        <div className="flex items-start gap-4">
          <div className="flex size-12 shrink-0 items-center justify-center rounded-full bg-pale-lilac text-deep-lilac">
            <Music2 aria-hidden="true" className="size-5" strokeWidth={1.5} />
          </div>
          <div>
            <h2 className="font-serif text-3xl font-semibold leading-tight text-espresso">Upload background music</h2>
            <p className="mt-2 text-sm leading-7 text-espresso/58">
              Add one gentle track for Elizabeth&apos;s archive. Only upload music you own, created yourself, or have
              permission to use.
            </p>
          </div>
        </div>

        <div className="mt-6 grid gap-4">
          <label className="space-y-2">
            <span className="text-sm font-bold text-espresso">Track title</span>
            <input
              name="title"
              required
              maxLength={160}
              placeholder="Soft birthday theme"
              className={inputClasses}
              disabled={isUploading}
            />
          </label>

          <label className="space-y-2">
            <span className="text-sm font-bold text-espresso">Artist/source note</span>
            <textarea
              name="description"
              rows={3}
              maxLength={500}
              placeholder="Original piano sketch, licensed track, or source note."
              className="min-h-28 w-full resize-y rounded-2xl border border-lilac-border/45 bg-ivory/70 px-4 py-3 text-sm leading-6 text-espresso outline-none focus:border-deep-lilac/45 focus:ring-4 focus:ring-lilac-primary/16"
              disabled={isUploading}
            />
          </label>

          <div className="grid gap-4 sm:grid-cols-[1fr_12rem]">
            <label className="space-y-2">
              <span className="text-sm font-bold text-espresso">Audio file</span>
              <input
                type="file"
                name="file"
                required
                accept=".mp3,.m4a,.wav,.webm,audio/mpeg,audio/mp4,audio/x-m4a,audio/wav,audio/webm"
                className={inputClasses}
                disabled={isUploading}
              />
              <span className="block text-xs leading-5 text-espresso/48">Accepted: mp3, m4a, wav, webm. Max 25MB.</span>
            </label>
            <label className="space-y-2">
              <span className="text-sm font-bold text-espresso">Default volume</span>
              <input
                type="number"
                name="defaultVolume"
                min="0"
                max="1"
                step="0.01"
                defaultValue="0.25"
                className={inputClasses}
                disabled={isUploading}
              />
              <span className="block text-xs leading-5 text-espresso/48">0.25 is calm and low.</span>
            </label>
          </div>

          <label className="flex items-start gap-3 rounded-2xl border border-lilac-border/40 bg-ivory/56 p-3 text-sm leading-6 text-espresso/62">
            <input
              type="checkbox"
              name="isActive"
              defaultChecked
              className="mt-1 size-4 rounded border-lilac-border text-deep-lilac accent-deep-lilac"
              disabled={isUploading}
            />
            Make this the active archive track after upload.
          </label>
        </div>

        <div className="mt-5 min-h-6" aria-live="polite">
          {error ? <p className="text-sm font-semibold text-rose-700">{error}</p> : null}
          {status ? <p className="text-sm font-semibold text-deep-lilac">{status}</p> : null}
        </div>

        <div className="mt-5 flex justify-end">
          <button
            type="submit"
            disabled={isUploading}
            className="inline-flex min-h-10 items-center justify-center rounded-full bg-deep-lilac px-4 py-2 text-sm font-bold text-ivory shadow-[var(--shadow-beautiful-sm)] ring-1 ring-espresso/8 transition-[background,transform,opacity] duration-300 ease-[var(--ease-weighted)] hover:-translate-y-0.5 hover:bg-[#6c5392] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-deep-lilac/45 disabled:pointer-events-none disabled:opacity-50"
          >
            {isUploading ? "Uploading..." : "Upload track"}
          </button>
        </div>
      </div>
    </form>
  );
}
