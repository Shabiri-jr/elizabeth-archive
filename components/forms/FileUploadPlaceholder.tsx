import { Mic2, UploadCloud } from "lucide-react";
import { cn } from "@/lib/utils";

type FileUploadPlaceholderProps = {
  label: string;
  description: string;
  helper?: string;
  kind?: "photo" | "voice";
  className?: string;
};

export function FileUploadPlaceholder({
  label,
  description,
  helper,
  kind = "photo",
  className,
}: FileUploadPlaceholderProps) {
  const Icon = kind === "voice" ? Mic2 : UploadCloud;

  return (
    <div
      className={cn(
        "rounded-[1.5rem] border border-dashed border-lilac-border/80 bg-pale-lilac/30 p-5 shadow-[0px_2px_3px_-1px_rgba(0,0,0,0.1),0px_1px_0px_0px_rgba(25,28,33,0.02),0px_0px_0px_1px_rgba(25,28,33,0.08)]",
        className,
      )}
    >
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
        <button
          type="button"
          className="min-h-11 rounded-full border border-lilac-border/70 bg-ivory px-4 text-sm font-bold text-espresso transition-[transform,background] duration-500 ease-[var(--ease-weighted)] hover:-translate-y-0.5 hover:bg-porcelain focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-deep-lilac/35"
        >
          Choose later
        </button>
      </div>
      {helper ? <p className="mt-4 text-sm leading-6 text-espresso/54">{helper}</p> : null}
    </div>
  );
}
