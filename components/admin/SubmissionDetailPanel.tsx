import { ConfirmDialog } from "@/components/admin/ConfirmDialog";
import { PendingSubmitButton } from "@/components/admin/PendingSubmitButton";
import { StatusBadge } from "@/components/admin/StatusBadge";
import {
  deleteSubmission,
  setSubmissionStatus,
  updateSubmissionNotes,
} from "@/lib/admin/actions";
import type { AdminSubmission } from "@/lib/admin/queries";

type SubmissionDetailPanelProps = {
  submission: AdminSubmission;
};

function OptionalBlock({ label, value }: { label: string; value: string | null }) {
  if (!value) return null;

  return (
    <div className="rounded-2xl border border-lilac-border/45 bg-pale-lilac/22 p-4">
      <p className="text-xs font-bold uppercase tracking-[0.18em] text-deep-lilac/72">{label}</p>
      <p className="mt-2 whitespace-pre-wrap text-sm leading-7 text-espresso/68">{value}</p>
    </div>
  );
}

export function SubmissionDetailPanel({ submission }: SubmissionDetailPanelProps) {
  return (
    <div className="mt-5 space-y-5 border-t border-lilac-border/45 pt-5">
      <div className="grid gap-4 md:grid-cols-2">
        <OptionalBlock label="Birthday message" value={submission.birthday_message} />
        <OptionalBlock label="Memory with Elizabeth" value={submission.memory} />
        <OptionalBlock label="Future wish or prayer" value={submission.future_wish} />
        <div className="rounded-2xl border border-lilac-border/45 bg-pale-lilac/22 p-4">
          <p className="text-xs font-bold uppercase tracking-[0.18em] text-deep-lilac/72">Permission</p>
          <p className="mt-2 text-sm leading-7 text-espresso/68">
            {submission.permission_given
              ? "Permission was given for this message and media to be included in the private archive."
              : "Permission was not given."}
          </p>
        </div>
      </div>

      <div className="rounded-2xl border border-lilac-border/45 bg-porcelain/72 p-4">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.18em] text-deep-lilac/72">Linked media</p>
            <p className="mt-2 text-sm leading-6 text-espresso/58">
              {submission.mediaCount} file{submission.mediaCount === 1 ? "" : "s"} attached to this submission.
            </p>
          </div>
          <StatusBadge status={submission.status} />
        </div>
        {submission.media.length ? (
          <div className="mt-4 flex flex-wrap gap-2">
            {submission.media.map((media) => (
              <span
                key={media.id}
                className="rounded-full border border-lilac-border/55 bg-pale-lilac/42 px-3 py-1 text-xs font-semibold text-espresso/66"
              >
                {media.type} / {media.status}
              </span>
            ))}
          </div>
        ) : null}
      </div>

      <form action={updateSubmissionNotes} className="space-y-3">
        <input type="hidden" name="submissionId" value={submission.id} />
        <label htmlFor={`notes-${submission.id}`} className="text-sm font-bold text-espresso">
          Admin notes
        </label>
        <textarea
          id={`notes-${submission.id}`}
          name="adminNotes"
          defaultValue={submission.admin_notes ?? ""}
          className="min-h-28 w-full resize-y rounded-2xl border border-lilac-border/45 bg-porcelain/78 px-4 py-3 text-sm leading-7 text-espresso outline-none shadow-[var(--shadow-beautiful-sm)] transition-[border,box-shadow,background] duration-500 ease-[var(--ease-weighted)] placeholder:text-espresso/36 focus:border-deep-lilac/45 focus:bg-porcelain focus:ring-4 focus:ring-lilac-primary/16"
          placeholder="Keep private context for approval decisions."
        />
        <PendingSubmitButton tone="quiet" pendingLabel="Saving note...">
          Save note
        </PendingSubmitButton>
      </form>

      <div className="flex flex-wrap gap-3">
        <form action={setSubmissionStatus}>
          <input type="hidden" name="submissionId" value={submission.id} />
          <PendingSubmitButton name="status" value="approved" tone="approve" pendingLabel="Approving...">
            Approve
          </PendingSubmitButton>
        </form>
        <form action={setSubmissionStatus}>
          <input type="hidden" name="submissionId" value={submission.id} />
          <PendingSubmitButton name="status" value="rejected" tone="reject" pendingLabel="Rejecting...">
            Reject
          </PendingSubmitButton>
        </form>
        <form action={setSubmissionStatus}>
          <input type="hidden" name="submissionId" value={submission.id} />
          <PendingSubmitButton name="status" value="pending" tone="quiet" pendingLabel="Restoring...">
            Restore to pending
          </PendingSubmitButton>
        </form>
        <form action={deleteSubmission}>
          <input type="hidden" name="submissionId" value={submission.id} />
          <ConfirmDialog message="Delete this submission and its linked media records? This cannot be undone.">
            Delete
          </ConfirmDialog>
        </form>
      </div>
    </div>
  );
}
