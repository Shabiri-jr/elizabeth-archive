"use client";

import { useState } from "react";
import { Copy, Check } from "lucide-react";

type CopyTextButtonProps = {
  value: string;
  label: string;
  copiedLabel?: string;
};

export function CopyTextButton({ value, label, copiedLabel = "Copied" }: CopyTextButtonProps) {
  const [copied, setCopied] = useState(false);

  async function copyValue() {
    await navigator.clipboard.writeText(value);
    setCopied(true);
    window.setTimeout(() => setCopied(false), 1800);
  }

  return (
    <button
      type="button"
      onClick={copyValue}
      className="inline-flex min-h-11 items-center gap-2 rounded-full bg-pale-lilac px-4 py-2 text-sm font-bold text-[#6c5392] shadow-[var(--shadow-beautiful-sm)] ring-1 ring-lilac-border/65 transition-[background,transform] duration-300 ease-[var(--ease-weighted)] hover:-translate-y-0.5 hover:bg-porcelain focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-deep-lilac/45"
    >
      {copied ? <Check aria-hidden="true" className="size-4" /> : <Copy aria-hidden="true" className="size-4" />}
      {copied ? copiedLabel : label}
    </button>
  );
}

