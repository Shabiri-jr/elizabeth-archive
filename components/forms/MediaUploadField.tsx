"use client";

import { useRef } from "react";
import { Image, Mic2, UploadCloud, Video } from "lucide-react";
import { cn } from "@/lib/utils";

type MediaUploadFieldProps = {
  id: string;
  name: string;
  label: string;
  description: string;
  helper: string;
  accept: string;
  maxFiles: number;
  maxSizeLabel: string;
  multiple?: boolean;
  disabled?: boolean;
  error?: string;
  files: File[];
  kind?: "photos" | "voice" | "video";
  onFilesChange: (files: File[]) => void;
};

const iconMap = {
  photos: Image,
  voice: Mic2,
  video: Video,
};

function formatFileSize(bytes: number) {
  if (bytes < 1024 * 1024) {
    return `${Math.max(Math.round(bytes / 1024), 1)}KB`;
  }

  return `${(bytes / 1024 / 1024).toFixed(1)}MB`;
}

export function MediaUploadField({
  id,
  name,
  label,
  description,
  helper,
  accept,
  maxFiles,
  maxSizeLabel,
  multiple = false,
  disabled,
  error,
  files,
  kind = "photos",
  onFilesChange,
}: MediaUploadFieldProps) {
  const inputRef = useRef<HTMLInputElement | null>(null);
  const Icon = iconMap[kind] ?? UploadCloud;

  function clearFiles() {
    if (inputRef.current) {
      inputRef.current.value = "";
    }

    onFilesChange([]);
  }

  return (
    <div className="space-y-3">
      <label
        htmlFor={id}
        className={cn(
          "block rounded-[1.5rem] border border-dashed border-lilac-border/80 bg-pale-lilac/30 p-5 shadow-[0px_2px_3px_-1px_rgba(0,0,0,0.1),0px_1px_0px_0px_rgba(25,28,33,0.02),0px_0px_0px_1px_rgba(25,28,33,0.08)] transition-[background,border,transform] duration-500 ease-[var(--ease-weighted)]",
          disabled ? "opacity-65" : "cursor-pointer hover:-translate-y-0.5 hover:bg-pale-lilac/44",
        )}
      >
        <input
          ref={inputRef}
          id={id}
          name={name}
          type="file"
          accept={accept}
          multiple={multiple}
          disabled={disabled}
          className="sr-only"
          onChange={(event) => onFilesChange(Array.from(event.currentTarget.files ?? []))}
        />
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex gap-4">
            <span className="flex size-11 shrink-0 items-center justify-center rounded-full bg-lilac-primary/18 text-deep-lilac">
              <Icon aria-hidden="true" className="size-5" strokeWidth={1.35} />
            </span>
            <div>
              <p className="font-bold text-espresso">{label}</p>
              <p className="mt-1 text-sm leading-6 text-espresso/60">{description}</p>
            </div>
          </div>
          <span className="min-h-11 rounded-full border border-lilac-border/70 bg-ivory px-4 py-2.5 text-center text-sm font-bold text-espresso">
            Choose {maxFiles === 1 ? "file" : "files"}
          </span>
        </div>
        <p className="mt-4 text-sm leading-6 text-espresso/54">
          {helper} Up to {maxFiles} {maxFiles === 1 ? "file" : "files"}, {maxSizeLabel} each.
        </p>
      </label>

      {files.length > 0 ? (
        <div className="rounded-2xl border border-lilac-border/55 bg-porcelain/70 p-4">
          <div className="flex items-center justify-between gap-4">
            <p className="text-sm font-bold text-espresso">
              {files.length} {files.length === 1 ? "file" : "files"} selected
            </p>
            <button
              type="button"
              disabled={disabled}
              onClick={clearFiles}
              className="rounded-full border border-lilac-border/70 px-3 py-1 text-xs font-bold text-deep-lilac transition-colors hover:bg-pale-lilac focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-deep-lilac/35 disabled:opacity-50"
            >
              Clear
            </button>
          </div>
          <ul className="mt-3 space-y-2">
            {files.map((file) => (
              <li
                key={`${file.name}-${file.size}-${file.lastModified}`}
                className="flex items-center justify-between gap-4 rounded-xl bg-pale-lilac/36 px-3 py-2 text-sm text-espresso/68"
              >
                <span className="min-w-0 truncate">{file.name}</span>
                <span className="shrink-0 font-semibold text-espresso/50">{formatFileSize(file.size)}</span>
              </li>
            ))}
          </ul>
        </div>
      ) : null}

      {error ? (
        <p className="text-sm font-semibold leading-6 text-deep-lilac" role="alert">
          {error}
        </p>
      ) : null}
    </div>
  );
}
