"use client";

import type { ButtonHTMLAttributes, ReactNode } from "react";
import { useFormStatus } from "react-dom";
import { cn } from "@/lib/utils";

type ConfirmDialogProps = {
  children: ReactNode;
  message: string;
  pendingLabel?: string;
} & Omit<ButtonHTMLAttributes<HTMLButtonElement>, "onClick">;

export function ConfirmDialog({
  children,
  message,
  pendingLabel = "Deleting...",
  className,
  disabled,
  type = "submit",
  ...props
}: ConfirmDialogProps) {
  const { pending } = useFormStatus();

  return (
    <button
      {...props}
      type={type}
      disabled={pending || disabled}
      onClick={(event) => {
        if (!window.confirm(message)) {
          event.preventDefault();
        }
      }}
      className={cn(
        "inline-flex min-h-10 items-center justify-center rounded-full bg-warm-black px-4 py-2 text-sm font-bold text-ivory shadow-[var(--shadow-beautiful-sm)] ring-1 ring-warm-black/10 transition-[background,transform,opacity] duration-300 ease-[var(--ease-weighted)] hover:-translate-y-0.5 hover:bg-espresso focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-deep-lilac/45 disabled:pointer-events-none disabled:opacity-50",
        className,
      )}
    >
      {pending ? pendingLabel : children}
    </button>
  );
}
