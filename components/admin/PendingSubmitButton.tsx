"use client";

import { useFormStatus } from "react-dom";
import type { ButtonHTMLAttributes, ReactNode } from "react";
import { cn } from "@/lib/utils";

type PendingSubmitButtonProps = {
  children: ReactNode;
  pendingLabel?: string;
  tone?: "primary" | "quiet" | "approve" | "reject" | "danger";
} & ButtonHTMLAttributes<HTMLButtonElement>;

const toneClasses: Record<NonNullable<PendingSubmitButtonProps["tone"]>, string> = {
  primary: "bg-deep-lilac text-ivory hover:bg-[#6c5392]",
  quiet: "bg-pale-lilac text-deep-lilac hover:bg-porcelain",
  approve: "bg-emerald-50 text-emerald-900 ring-emerald-300/60 hover:bg-emerald-100",
  reject: "bg-rose-50 text-rose-900 ring-rose-300/60 hover:bg-rose-100",
  danger: "bg-warm-black text-ivory hover:bg-espresso",
};

export function PendingSubmitButton({
  children,
  pendingLabel = "Saving...",
  tone = "primary",
  className,
  disabled,
  type = "submit",
  ...props
}: PendingSubmitButtonProps) {
  const { pending } = useFormStatus();

  return (
    <button
      {...props}
      type={type}
      disabled={pending || disabled}
      className={cn(
        "inline-flex min-h-10 items-center justify-center rounded-full px-4 py-2 text-sm font-bold shadow-[var(--shadow-beautiful-sm)] ring-1 ring-espresso/8 transition-[background,transform,opacity] duration-300 ease-[var(--ease-weighted)] hover:-translate-y-0.5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-deep-lilac/45 disabled:pointer-events-none disabled:opacity-50",
        toneClasses[tone],
        className,
      )}
    >
      {pending ? pendingLabel : children}
    </button>
  );
}
