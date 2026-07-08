import Link from "next/link";
import { Search } from "lucide-react";
import { SubmissionDetailPanel } from "@/components/admin/SubmissionDetailPanel";
import { StatusBadge } from "@/components/admin/StatusBadge";
import type { AdminSubmission } from "@/lib/admin/queries";

type SubmissionTableProps = {
  submissions: AdminSubmission[];
  filters: {
    status: string;
    search: string;
    sort: string;
  };
};

function formatDate(value: string) {
  return new Intl.DateTimeFormat("en", {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(new Date(value));
}

function preview(value: string, length = 170) {
  return value.length > length ? `${value.slice(0, length).trim()}...` : value;
}

export function SubmissionTable({ submissions, filters }: SubmissionTableProps) {
  return (
    <div className="space-y-6">
      <form
        method="get"
        action="/admin/submissions"
        className="rounded-[1.5rem] border border-lilac-border/55 bg-porcelain/74 p-4 shadow-[var(--shadow-beautiful-sm)]"
      >
        <div className="grid gap-3 md:grid-cols-[1fr_12rem_11rem_auto] md:items-end">
          <label className="space-y-2">
            <span className="text-sm font-bold text-espresso">Search</span>
            <span className="relative block">
              <Search aria-hidden="true" className="absolute left-4 top-1/2 size-4 -translate-y-1/2 text-deep-lilac" />
              <input
                name="search"
                defaultValue={filters.search}
                placeholder="Name or relationship"
                className="min-h-12 w-full rounded-2xl border border-lilac-border/45 bg-ivory/70 pl-11 pr-4 text-sm text-espresso outline-none focus:border-deep-lilac/45 focus:ring-4 focus:ring-lilac-primary/16"
              />
            </span>
          </label>
          <label className="space-y-2">
            <span className="text-sm font-bold text-espresso">Status</span>
            <select
              name="status"
              defaultValue={filters.status}
              className="min-h-12 w-full rounded-2xl border border-lilac-border/45 bg-ivory/70 px-4 text-sm font-semibold text-espresso outline-none focus:border-deep-lilac/45 focus:ring-4 focus:ring-lilac-primary/16"
            >
              <option value="all">All</option>
              <option value="pending">Pending</option>
              <option value="approved">Approved</option>
              <option value="rejected">Rejected</option>
            </select>
          </label>
          <label className="space-y-2">
            <span className="text-sm font-bold text-espresso">Sort</span>
            <select
              name="sort"
              defaultValue={filters.sort}
              className="min-h-12 w-full rounded-2xl border border-lilac-border/45 bg-ivory/70 px-4 text-sm font-semibold text-espresso outline-none focus:border-deep-lilac/45 focus:ring-4 focus:ring-lilac-primary/16"
            >
              <option value="newest">Newest</option>
              <option value="oldest">Oldest</option>
            </select>
          </label>
          <div className="flex gap-2">
            <button className="min-h-12 rounded-full bg-deep-lilac px-5 text-sm font-bold text-ivory shadow-[var(--shadow-beautiful-sm)]">
              Filter
            </button>
            <Link
              href="/admin/submissions"
              className="inline-flex min-h-12 items-center rounded-full bg-pale-lilac px-5 text-sm font-bold text-deep-lilac shadow-[var(--shadow-beautiful-sm)]"
            >
              Reset
            </Link>
          </div>
        </div>
      </form>

      {submissions.length ? (
        <div className="space-y-4">
          {submissions.map((submission) => (
            <article
              key={submission.id}
              className="rounded-[1.75rem] bg-warm-black/[0.035] p-1.5 ring-1 ring-espresso/7 shadow-[var(--shadow-beautiful-md)]"
            >
              <div className="rounded-[calc(1.75rem-0.375rem)] border border-porcelain/80 bg-porcelain/76 p-5">
                <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
                  <div className="min-w-0">
                    <div className="flex flex-wrap items-center gap-2">
                      <StatusBadge status={submission.status} />
                      <span className="rounded-full border border-lilac-border/55 bg-pale-lilac/32 px-3 py-1 text-xs font-bold uppercase tracking-[0.14em] text-espresso/56">
                        {submission.mediaCount} media
                      </span>
                    </div>
                    <h2 className="mt-4 font-serif text-3xl font-semibold text-espresso">{submission.name}</h2>
                    <p className="mt-1 text-sm font-semibold text-deep-lilac">
                      {submission.relationship}
                      {submission.contributor?.token ? ` / ${submission.contributor.token.slice(0, 12)}...` : ""}
                    </p>
                    <p className="mt-4 max-w-4xl text-sm leading-7 text-espresso/64">
                      {preview(submission.birthday_message)}
                    </p>
                    {submission.one_word ? (
                      <p className="mt-3 text-sm leading-6 text-espresso/58">
                        One word: <span className="font-bold text-espresso">{submission.one_word}</span>
                      </p>
                    ) : null}
                  </div>
                  <time className="shrink-0 text-xs font-bold uppercase tracking-[0.16em] text-espresso/42">
                    {formatDate(submission.created_at)}
                  </time>
                </div>
                <details className="group mt-5">
                  <summary className="inline-flex cursor-pointer list-none rounded-full bg-pale-lilac px-4 py-2 text-sm font-bold text-deep-lilac shadow-[var(--shadow-beautiful-sm)] transition-[background,transform] duration-300 ease-[var(--ease-weighted)] hover:-translate-y-0.5 hover:bg-porcelain">
                    Open review panel
                  </summary>
                  <SubmissionDetailPanel submission={submission} />
                </details>
              </div>
            </article>
          ))}
        </div>
      ) : (
        <div className="rounded-[1.75rem] border border-dashed border-espresso/16 bg-porcelain/58 p-8 text-center shadow-[var(--shadow-beautiful-sm)]">
          <p className="font-serif text-3xl font-semibold text-espresso">No submissions match this view.</p>
          <p className="mx-auto mt-3 max-w-xl text-sm leading-7 text-espresso/58">
            When Elizabeth&apos;s people send messages, they will appear here for approval before anything joins the final
            archive.
          </p>
        </div>
      )}
    </div>
  );
}
