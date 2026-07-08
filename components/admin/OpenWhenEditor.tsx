import { ConfirmDialog } from "@/components/admin/ConfirmDialog";
import { PendingSubmitButton } from "@/components/admin/PendingSubmitButton";
import { StatusBadge } from "@/components/admin/StatusBadge";
import { createOpenWhenLetter, deleteOpenWhenLetter, updateOpenWhenLetter } from "@/lib/admin/actions";
import type { Database } from "@/lib/types";

type OpenWhenLetterRow = Database["public"]["Tables"]["open_when_letters"]["Row"];

type OpenWhenEditorProps = {
  letters: OpenWhenLetterRow[];
};

function TextInput({
  label,
  name,
  defaultValue,
  required = false,
  type = "text",
}: {
  label: string;
  name: string;
  defaultValue?: string | number | null;
  required?: boolean;
  type?: "text" | "number";
}) {
  return (
    <label className="space-y-2">
      <span className="text-sm font-bold text-espresso">{label}</span>
      <input
        name={name}
        type={type}
        defaultValue={defaultValue ?? ""}
        required={required}
        className="min-h-12 w-full rounded-2xl border border-lilac-border/45 bg-ivory/70 px-4 text-sm text-espresso outline-none focus:border-deep-lilac/45 focus:ring-4 focus:ring-lilac-primary/16"
      />
    </label>
  );
}

function BodyTextarea({ defaultValue, required = false }: { defaultValue?: string | null; required?: boolean }) {
  return (
    <label className="block space-y-2">
      <span className="text-sm font-bold text-espresso">Letter body</span>
      <textarea
        name="body"
        defaultValue={defaultValue ?? ""}
        required={required}
        className="min-h-44 w-full resize-y rounded-2xl border border-lilac-border/45 bg-ivory/70 px-4 py-3 text-sm leading-7 text-espresso outline-none focus:border-deep-lilac/45 focus:ring-4 focus:ring-lilac-primary/16"
      />
    </label>
  );
}

export function OpenWhenEditor({ letters }: OpenWhenEditorProps) {
  return (
    <div className="space-y-6">
      <form
        action={createOpenWhenLetter}
        className="rounded-[1.75rem] bg-warm-black/[0.035] p-1.5 ring-1 ring-espresso/7 shadow-[var(--shadow-beautiful-md)]"
      >
        <div className="rounded-[calc(1.75rem-0.375rem)] border border-lilac-border/60 bg-porcelain/76 p-5">
          <p className="text-xs font-bold uppercase tracking-[0.18em] text-deep-lilac/72">Create new letter</p>
          <div className="mt-5 grid gap-4 md:grid-cols-[1fr_12rem_10rem]">
            <TextInput label="Title" name="title" required />
            <TextInput label="Mood" name="mood" />
            <TextInput label="Sort order" name="sortOrder" type="number" defaultValue={letters.length * 10 + 10} />
          </div>
          <div className="mt-4">
            <TextInput label="Subtitle" name="subtitle" />
          </div>
          <div className="mt-4">
            <BodyTextarea required />
          </div>
          <div className="mt-5 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <label className="flex items-center gap-3 rounded-2xl border border-lilac-border/45 bg-pale-lilac/24 px-4 py-3 text-sm font-semibold text-espresso/70">
              <input type="checkbox" name="isVisible" defaultChecked className="size-4 rounded border-lilac-border accent-deep-lilac" />
              Visible in Elizabeth&apos;s Open When drawer
            </label>
            <PendingSubmitButton pendingLabel="Creating letter...">Create letter</PendingSubmitButton>
          </div>
        </div>
      </form>

      {letters.length ? (
        letters.map((letter) => (
          <form
            key={letter.id}
            action={updateOpenWhenLetter}
            className="rounded-[1.75rem] bg-warm-black/[0.035] p-1.5 ring-1 ring-espresso/7 shadow-[var(--shadow-beautiful-md)]"
          >
            <input type="hidden" name="letterId" value={letter.id} />
            <div className="rounded-[calc(1.75rem-0.375rem)] border border-porcelain/80 bg-porcelain/76 p-5">
              <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                <div>
                  <p className="text-xs font-bold uppercase tracking-[0.18em] text-deep-lilac/72">
                    {letter.slug} / {letter.mood ?? "letter"}
                  </p>
                  <h2 className="mt-2 font-serif text-3xl font-semibold text-espresso">{letter.title}</h2>
                </div>
                <StatusBadge status={letter.is_visible ? "visible" : "hidden"} label={letter.is_visible ? "Visible" : "Hidden"} />
              </div>
              <div className="mt-5 grid gap-4 md:grid-cols-[1fr_12rem_10rem]">
                <TextInput label="Title" name="title" defaultValue={letter.title} required />
                <TextInput label="Mood" name="mood" defaultValue={letter.mood} />
                <TextInput label="Sort order" name="sortOrder" type="number" defaultValue={letter.sort_order} />
              </div>
              <div className="mt-4">
                <TextInput label="Subtitle" name="subtitle" defaultValue={letter.subtitle} />
              </div>
              <div className="mt-4">
                <BodyTextarea defaultValue={letter.body} required />
              </div>
              <div className="mt-5 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                <label className="flex items-center gap-3 rounded-2xl border border-lilac-border/45 bg-pale-lilac/24 px-4 py-3 text-sm font-semibold text-espresso/70">
                  <input
                    type="checkbox"
                    name="isVisible"
                    defaultChecked={letter.is_visible}
                    className="size-4 rounded border-lilac-border accent-deep-lilac"
                  />
                  Visible in Elizabeth&apos;s Open When drawer
                </label>
                <div className="flex flex-col gap-3 sm:flex-row">
                  <PendingSubmitButton pendingLabel="Saving letter...">Save letter</PendingSubmitButton>
                  <ConfirmDialog
                    form={`delete-open-when-${letter.id}`}
                    message={`Delete "${letter.title}"? This removes it from Elizabeth's Open When drawer.`}
                    pendingLabel="Deleting letter..."
                  >
                    Delete
                  </ConfirmDialog>
                </div>
              </div>
            </div>
          </form>
        ))
      ) : (
        <div className="rounded-[1.75rem] border border-dashed border-espresso/16 bg-porcelain/58 p-8 text-center shadow-[var(--shadow-beautiful-sm)]">
          <p className="font-serif text-3xl font-semibold text-espresso">No Open When letters yet.</p>
          <p className="mx-auto mt-3 max-w-xl text-sm leading-7 text-espresso/58">
            Create a few letters Elizabeth can return to after her birthday.
          </p>
        </div>
      )}

      {letters.map((letter) => (
        <form key={`delete-${letter.id}`} id={`delete-open-when-${letter.id}`} action={deleteOpenWhenLetter}>
          <input type="hidden" name="letterId" value={letter.id} />
        </form>
      ))}
    </div>
  );
}
