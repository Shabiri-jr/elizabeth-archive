import { Plus } from "lucide-react";
import { PendingSubmitButton } from "@/components/admin/PendingSubmitButton";
import { createContributorLink } from "@/lib/admin/actions";

export function CreateContributorLinkDialog() {
  return (
    <details className="group rounded-[1.75rem] bg-warm-black/[0.035] p-1.5 ring-1 ring-espresso/7 shadow-[var(--shadow-beautiful-md)]">
      <summary className="flex cursor-pointer list-none items-center justify-between gap-4 rounded-[calc(1.75rem-0.375rem)] border border-porcelain/80 bg-porcelain/76 p-5">
        <span>
          <span className="block text-sm font-bold uppercase tracking-[0.18em] text-deep-lilac/72">
            Private invite
          </span>
          <span className="mt-2 block font-serif text-3xl font-semibold text-espresso">Create contributor link</span>
        </span>
        <span className="flex size-11 shrink-0 items-center justify-center rounded-full bg-deep-lilac text-ivory">
          <Plus aria-hidden="true" className="size-5" />
        </span>
      </summary>

      <form action={createContributorLink} className="space-y-5 px-5 pb-5 pt-1">
        <div className="grid gap-4 md:grid-cols-2">
          <label className="space-y-2">
            <span className="text-sm font-bold text-espresso">Name</span>
            <input
              name="name"
              placeholder="Optional contributor name"
              className="min-h-12 w-full rounded-2xl border border-lilac-border/45 bg-porcelain/78 px-4 text-sm text-espresso outline-none focus:border-deep-lilac/45 focus:ring-4 focus:ring-lilac-primary/16"
            />
          </label>
          <label className="space-y-2">
            <span className="text-sm font-bold text-espresso">Relationship</span>
            <input
              name="relationship"
              placeholder="Friend, cousin, mentor..."
              className="min-h-12 w-full rounded-2xl border border-lilac-border/45 bg-porcelain/78 px-4 text-sm text-espresso outline-none focus:border-deep-lilac/45 focus:ring-4 focus:ring-lilac-primary/16"
            />
          </label>
          <label className="space-y-2">
            <span className="text-sm font-bold text-espresso">Email</span>
            <input
              name="email"
              type="email"
              placeholder="Optional email"
              className="min-h-12 w-full rounded-2xl border border-lilac-border/45 bg-porcelain/78 px-4 text-sm text-espresso outline-none focus:border-deep-lilac/45 focus:ring-4 focus:ring-lilac-primary/16"
            />
          </label>
          <label className="space-y-2">
            <span className="text-sm font-bold text-espresso">Max submissions</span>
            <input
              name="maxSubmissions"
              type="number"
              min={1}
              max={50}
              defaultValue={1}
              className="min-h-12 w-full rounded-2xl border border-lilac-border/45 bg-porcelain/78 px-4 text-sm text-espresso outline-none focus:border-deep-lilac/45 focus:ring-4 focus:ring-lilac-primary/16"
            />
          </label>
          <label className="space-y-2 md:col-span-2">
            <span className="text-sm font-bold text-espresso">Expiry date</span>
            <input
              name="expiresAt"
              type="date"
              className="min-h-12 w-full rounded-2xl border border-lilac-border/45 bg-porcelain/78 px-4 text-sm text-espresso outline-none focus:border-deep-lilac/45 focus:ring-4 focus:ring-lilac-primary/16"
            />
          </label>
        </div>
        <label className="space-y-2">
          <span className="text-sm font-bold text-espresso">Notes</span>
          <textarea
            name="notes"
            placeholder="Private admin note"
            className="min-h-28 w-full resize-y rounded-2xl border border-lilac-border/45 bg-porcelain/78 px-4 py-3 text-sm leading-7 text-espresso outline-none focus:border-deep-lilac/45 focus:ring-4 focus:ring-lilac-primary/16"
          />
        </label>
        <PendingSubmitButton pendingLabel="Creating link...">Create secure link</PendingSubmitButton>
      </form>
    </details>
  );
}
