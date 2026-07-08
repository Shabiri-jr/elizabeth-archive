import type { ButtonHTMLAttributes, ReactNode } from "react";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { cn } from "@/lib/utils";

type ButtonVariant = "primary" | "secondary" | "ghost" | "dark";
type ButtonSize = "md" | "lg";

type BaseButtonProps = {
  children: ReactNode;
  className?: string;
  href?: string;
  variant?: ButtonVariant;
  size?: ButtonSize;
  showArrow?: boolean;
} & Pick<ButtonHTMLAttributes<HTMLButtonElement>, "type" | "disabled" | "aria-label">;

const variantClasses: Record<ButtonVariant, string> = {
  primary:
    "bg-deep-lilac text-ivory ring-deep-lilac/20 hover:bg-[#6c5392]",
  secondary:
    "bg-pale-lilac text-espresso ring-lilac-border/65 hover:bg-porcelain",
  ghost:
    "bg-transparent text-espresso ring-lilac-border/65 hover:bg-pale-lilac/72",
  dark:
    "bg-warm-black text-ivory ring-warm-black/10 hover:bg-espresso",
};

const sizeClasses: Record<ButtonSize, string> = {
  md: "min-h-11 gap-3 px-4 py-2.5 text-sm",
  lg: "min-h-12 gap-4 px-5 py-3 text-base",
};

export function Button({
  children,
  className,
  href,
  variant = "primary",
  size = "md",
  showArrow = true,
  type = "button",
  disabled,
  "aria-label": ariaLabel,
}: BaseButtonProps) {
  const classes = cn(
    "group inline-flex items-center justify-center rounded-full font-semibold tracking-[0.01em] shadow-[0px_2px_3px_-1px_rgba(0,0,0,0.1),0px_1px_0px_0px_rgba(25,28,33,0.02),0px_0px_0px_1px_rgba(25,28,33,0.08)] ring-1 transition-[transform,background,color] duration-500 ease-[var(--ease-weighted)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-deep-lilac/45 active:scale-[0.98] disabled:pointer-events-none disabled:opacity-55",
    variantClasses[variant],
    sizeClasses[size],
    className,
  );

  const content = (
    <>
      <span>{children}</span>
      {showArrow ? (
        <span className="flex size-8 shrink-0 items-center justify-center rounded-full bg-current/10 transition-transform duration-500 ease-[var(--ease-weighted)] group-hover:translate-x-1 group-hover:-translate-y-px group-hover:scale-105">
          <ArrowRight aria-hidden="true" className="size-3.5" strokeWidth={1.35} />
        </span>
      ) : null}
    </>
  );

  if (href) {
    return (
      <Link href={href} className={classes} aria-label={ariaLabel}>
        {content}
      </Link>
    );
  }

  return (
    <button type={type} disabled={disabled} className={classes} aria-label={ariaLabel}>
      {content}
    </button>
  );
}
