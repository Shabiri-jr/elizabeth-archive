import { formatArchiveDate } from "@/lib/archive/formatters";
import { FavouriteButton } from "@/components/archive/FavouriteButton";
import type { ArchiveSubmission } from "@/lib/archive/queries";

type MessageCardProps = {
  submission: ArchiveSubmission;
  featured?: boolean;
};

export function MessageCard({ submission, featured = false }: MessageCardProps) {
  return (
    <article
      data-archive-card
      className="rounded-[1.75rem] bg-warm-black/[0.035] p-1.5 ring-1 ring-espresso/7 shadow-[var(--shadow-beautiful-md)]"
    >
      <div className="h-full rounded-[calc(1.75rem-0.375rem)] border border-porcelain/80 bg-porcelain/76 p-6">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
          <div>
            <p className="font-serif text-2xl font-semibold text-espresso">{submission.name}</p>
            <p className="mt-1 text-sm font-semibold text-deep-lilac">{submission.relationship}</p>
          </div>
          <div className="flex flex-wrap items-center gap-2 sm:justify-end">
            <time className="text-xs font-bold uppercase tracking-[0.16em] text-espresso/38">
              {formatArchiveDate(submission.createdAt)}
            </time>
            <FavouriteButton itemType="submission" itemId={submission.id} label={`message from ${submission.name}`} />
          </div>
        </div>
        <p
          className={
            featured
              ? "mt-7 whitespace-pre-wrap font-serif text-3xl leading-tight text-espresso sm:text-4xl"
              : "mt-6 whitespace-pre-wrap text-base leading-8 text-espresso/70"
          }
        >
          {submission.birthdayMessage}
        </p>
      </div>
    </article>
  );
}
