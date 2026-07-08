"use client";

import { useState } from "react";
import { Copy, Check } from "lucide-react";

type CopyContributorLinkButtonProps = {
  token: string;
};

export function CopyContributorLinkButton({ token }: CopyContributorLinkButtonProps) {
  const [copied, setCopied] = useState(false);

  async function copyLink() {
    const url = `${window.location.origin}/contribute/${token}`;
    await navigator.clipboard.writeText(url);
    setCopied(true);
    window.setTimeout(() => setCopied(false), 1600);
  }

  return (
    <button
      type="button"
      onClick={copyLink}
      className="inline-flex min-h-10 items-center gap-2 rounded-full bg-pale-lilac px-4 py-2 text-sm font-bold text-deep-lilac shadow-[var(--shadow-beautiful-sm)] ring-1 ring-lilac-border/65 transition-[background,transform] duration-300 ease-[var(--ease-weighted)] hover:-translate-y-0.5 hover:bg-porcelain focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-deep-lilac/45"
    >
      {copied ? <Check aria-hidden="true" className="size-4" /> : <Copy aria-hidden="true" className="size-4" />}
      {copied ? "Copied" : "Copy link"}
    </button>
  );
}
