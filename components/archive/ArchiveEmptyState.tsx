import { Sparkles } from "lucide-react";

type ArchiveEmptyStateProps = {
  title: string;
  body: string;
};

export function ArchiveEmptyState({ title, body }: ArchiveEmptyStateProps) {
  return (
    <div className="rounded-[1.75rem] border border-dashed border-lilac-border/70 bg-porcelain/58 p-8 text-center shadow-[var(--shadow-beautiful-sm)]">
      <span className="mx-auto flex size-11 items-center justify-center rounded-full bg-pale-lilac text-deep-lilac">
        <Sparkles aria-hidden="true" className="size-5" strokeWidth={1.35} />
      </span>
      <p className="mt-5 font-serif text-3xl font-semibold text-espresso">{title}</p>
      <p className="mx-auto mt-3 max-w-xl text-sm leading-7 text-espresso/58">{body}</p>
    </div>
  );
}
