import { ConfirmDialog } from "@/components/admin/ConfirmDialog";
import { CopyContributorLinkButton } from "@/components/admin/CopyContributorLinkButton";
import { PendingSubmitButton } from "@/components/admin/PendingSubmitButton";
import { StatusBadge } from "@/components/admin/StatusBadge";
import { expireContributorLink, updateContributorLink } from "@/lib/admin/actions";
import type { AdminContributor } from "@/lib/admin/queries";

type ContributorLinksTableProps = {
  contributors: AdminContributor[];
};

function formatDate(value: string | null) {
  if (!value) return "No expiry";

  return new Intl.DateTimeFormat("en", {
    dateStyle: "medium",
  }).format(new Date(value));
}

function dateInputValue(value: string | null) {
  if (!value) return "";
  return value.slice(0, 10);
}

function shortToken(token: string) {
  return token.length > 24 ? `${token.slice(0, 12)}...${token.slice(-8)}` : token;
}

function isExpired(value: string | null) {
  return value ? new Date(value).getTime() < Date.now() : false;
}

export function ContributorLinksTable({ contributors }: ContributorLinksTableProps) {
  if (!contributors.length) {
    return (
      <div className="rounded-[1.75rem] border border-dashed border-espresso/16 bg-porcelain/58 p-8 text-center shadow-[var(--shadow-beautiful-sm)]">
        <p className="font-serif text-3xl font-semibold text-espresso">No contributor links yet.</p>
        <p className="mx-auto mt-3 max-w-xl text-sm leading-7 text-espresso/58">
          Create private links for Elizabeth&apos;s people, then copy and send each one personally.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {contributors.map((contributor) => {
        const expired = isExpired(contributor.expires_at);

        return (
          <article
            key={contributor.id}
            className="rounded-[1.75rem] bg-warm-black/[0.035] p-1.5 ring-1 ring-espresso/7 shadow-[var(--shadow-beautiful-md)]"
          >
            <div className="rounded-[calc(1.75rem-0.375rem)] border border-porcelain/80 bg-porcelain/76 p-5">
              <div className="grid gap-5 lg:grid-cols-[1fr_auto] lg:items-start">
                <div className="min-w-0">
                  <div className="flex flex-wrap items-center gap-2">
                    <StatusBadge
                      status={expired ? "closed" : contributor.is_used ? "used" : "unused"}
                      label={expired ? "Expired" : contributor.is_used ? "Used" : "Available"}
                    />
                    <span className="rounded-full border border-lilac-border/55 bg-pale-lilac/32 px-3 py-1 text-xs font-bold uppercase tracking-[0.14em] text-espresso/56">
                      {contributor.submissionCount}/{contributor.max_submissions} submissions
                    </span>
                  </div>
                  <h2 className="mt-4 break-words font-mono text-lg font-bold text-espresso">
                    {shortToken(contributor.token)}
                  </h2>
                  <p className="mt-2 text-sm leading-6 text-espresso/58">
                    {contributor.name ?? "Unnamed contributor"}
                    {contributor.relationship ? ` / ${contributor.relationship}` : ""}
                    {contributor.email ? ` / ${contributor.email}` : ""}
                  </p>
                  <p className="mt-2 text-xs font-bold uppercase tracking-[0.14em] text-espresso/42">
                    Expires: {formatDate(contributor.expires_at)}
                  </p>
                </div>
                <div className="flex flex-wrap gap-2 lg:justify-end">
                  <CopyContributorLinkButton token={contributor.token} />
                  <form action={expireContributorLink}>
                    <input type="hidden" name="contributorId" value={contributor.id} />
                    <ConfirmDialog message="Expire this contributor link now? It will stop accepting submissions.">
                      Expire
                    </ConfirmDialog>
                  </form>
                </div>
              </div>

              <details className="group mt-5">
                <summary className="inline-flex cursor-pointer list-none rounded-full bg-pale-lilac px-4 py-2 text-sm font-bold text-deep-lilac shadow-[var(--shadow-beautiful-sm)] transition-[background,transform] duration-300 ease-[var(--ease-weighted)] hover:-translate-y-0.5 hover:bg-porcelain">
                  Edit link
                </summary>
                <form action={updateContributorLink} className="mt-5 space-y-5 border-t border-lilac-border/45 pt-5">
                  <input type="hidden" name="contributorId" value={contributor.id} />
                  <div className="grid gap-4 md:grid-cols-2">
                    <label className="space-y-2">
                      <span className="text-sm font-bold text-espresso">Name</span>
                      <input
                        name="name"
                        defaultValue={contributor.name ?? ""}
                        className="min-h-12 w-full rounded-2xl border border-lilac-border/45 bg-ivory/70 px-4 text-sm text-espresso outline-none focus:border-deep-lilac/45 focus:ring-4 focus:ring-lilac-primary/16"
                      />
                    </label>
                    <label className="space-y-2">
                      <span className="text-sm font-bold text-espresso">Relationship</span>
                      <input
                        name="relationship"
                        defaultValue={contributor.relationship ?? ""}
                        className="min-h-12 w-full rounded-2xl border border-lilac-border/45 bg-ivory/70 px-4 text-sm text-espresso outline-none focus:border-deep-lilac/45 focus:ring-4 focus:ring-lilac-primary/16"
                      />
                    </label>
                    <label className="space-y-2">
                      <span className="text-sm font-bold text-espresso">Email</span>
                      <input
                        name="email"
                        type="email"
                        defaultValue={contributor.email ?? ""}
                        className="min-h-12 w-full rounded-2xl border border-lilac-border/45 bg-ivory/70 px-4 text-sm text-espresso outline-none focus:border-deep-lilac/45 focus:ring-4 focus:ring-lilac-primary/16"
                      />
                    </label>
                    <label className="space-y-2">
                      <span className="text-sm font-bold text-espresso">Max submissions</span>
                      <input
                        name="maxSubmissions"
                        type="number"
                        min={1}
                        max={50}
                        defaultValue={contributor.max_submissions}
                        className="min-h-12 w-full rounded-2xl border border-lilac-border/45 bg-ivory/70 px-4 text-sm text-espresso outline-none focus:border-deep-lilac/45 focus:ring-4 focus:ring-lilac-primary/16"
                      />
                    </label>
                    <label className="space-y-2">
                      <span className="text-sm font-bold text-espresso">Expiry date</span>
                      <input
                        name="expiresAt"
                        type="date"
                        defaultValue={dateInputValue(contributor.expires_at)}
                        className="min-h-12 w-full rounded-2xl border border-lilac-border/45 bg-ivory/70 px-4 text-sm text-espresso outline-none focus:border-deep-lilac/45 focus:ring-4 focus:ring-lilac-primary/16"
                      />
                    </label>
                    <label className="flex items-center gap-3 self-end rounded-2xl border border-lilac-border/45 bg-pale-lilac/24 px-4 py-3 text-sm font-semibold text-espresso/70">
                      <input
                        type="checkbox"
                        name="isUsed"
                        defaultChecked={contributor.is_used}
                        className="size-4 rounded border-lilac-border accent-deep-lilac"
                      />
                      Mark link used or disabled
                    </label>
                  </div>
                  <label className="space-y-2">
                    <span className="text-sm font-bold text-espresso">Notes</span>
                    <textarea
                      name="notes"
                      defaultValue={contributor.notes ?? ""}
                      className="min-h-24 w-full resize-y rounded-2xl border border-lilac-border/45 bg-ivory/70 px-4 py-3 text-sm leading-7 text-espresso outline-none focus:border-deep-lilac/45 focus:ring-4 focus:ring-lilac-primary/16"
                    />
                  </label>
                  <PendingSubmitButton pendingLabel="Updating link...">Save link</PendingSubmitButton>
                </form>
              </details>
            </div>
          </article>
        );
      })}
    </div>
  );
}
