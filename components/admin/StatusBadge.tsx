import { cn } from "@/lib/utils";

type StatusBadgeProps = {
  status: string;
  label?: string;
  className?: string;
};

const statusStyles: Record<string, string> = {
  pending: "border-champagne/45 bg-champagne/15 text-espresso",
  approved: "border-emerald-300/55 bg-emerald-50/80 text-emerald-900",
  rejected: "border-rose-300/55 bg-rose-50/80 text-rose-900",
  live: "border-lilac-border bg-pale-lilac text-deep-lilac",
  locked: "border-espresso/12 bg-espresso/[0.04] text-espresso/70",
  open: "border-emerald-300/55 bg-emerald-50/80 text-emerald-900",
  closed: "border-rose-300/55 bg-rose-50/80 text-rose-900",
  used: "border-espresso/12 bg-espresso/[0.04] text-espresso/70",
  unused: "border-lilac-border bg-pale-lilac text-deep-lilac",
  visible: "border-lilac-border bg-pale-lilac text-deep-lilac",
  hidden: "border-espresso/12 bg-espresso/[0.04] text-espresso/70",
};

export function StatusBadge({ status, label, className }: StatusBadgeProps) {
  const normalizedStatus = status.toLowerCase();

  return (
    <span
      className={cn(
        "inline-flex w-fit items-center rounded-full border px-3 py-1 text-xs font-bold uppercase tracking-[0.14em]",
        statusStyles[normalizedStatus] ?? statusStyles.locked,
        className,
      )}
    >
      {label ?? status}
    </span>
  );
}
