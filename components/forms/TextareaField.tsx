import type { TextareaHTMLAttributes } from "react";
import { cn } from "@/lib/utils";

type TextareaFieldProps = {
  id: string;
  label: string;
  helper?: string;
  error?: string;
} & Omit<TextareaHTMLAttributes<HTMLTextAreaElement>, "id">;

export function TextareaField({ id, label, helper, error, className, ...props }: TextareaFieldProps) {
  return (
    <div className="space-y-2">
      <label htmlFor={id} className="text-sm font-bold text-espresso">
        {label}
      </label>
      <textarea
        id={id}
        className={cn(
          "min-h-36 w-full resize-y rounded-2xl border border-lilac-border/45 bg-porcelain/78 px-4 py-3 text-base leading-7 text-espresso outline-none shadow-[0px_2px_3px_-1px_rgba(0,0,0,0.1),0px_1px_0px_0px_rgba(25,28,33,0.02),0px_0px_0px_1px_rgba(25,28,33,0.08)] transition-[border,box-shadow,background] duration-500 ease-[var(--ease-weighted)] placeholder:text-espresso/36 focus:border-deep-lilac/45 focus:bg-porcelain focus:ring-4 focus:ring-lilac-primary/16",
          className,
        )}
        {...props}
      />
      {error ? (
        <p className="text-sm font-semibold leading-6 text-deep-lilac" role="alert">
          {error}
        </p>
      ) : helper ? (
        <p className="text-sm leading-6 text-espresso/58">{helper}</p>
      ) : null}
    </div>
  );
}
