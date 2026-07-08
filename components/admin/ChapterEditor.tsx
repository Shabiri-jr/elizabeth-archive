import { PendingSubmitButton } from "@/components/admin/PendingSubmitButton";
import { StatusBadge } from "@/components/admin/StatusBadge";
import { updateChapter } from "@/lib/admin/actions";
import type { Database } from "@/lib/types";

type ChapterRow = Database["public"]["Tables"]["archive_chapters"]["Row"];

type ChapterEditorProps = {
  chapters: ChapterRow[];
};

export function ChapterEditor({ chapters }: ChapterEditorProps) {
  if (!chapters.length) {
    return (
      <div className="rounded-[1.75rem] border border-dashed border-espresso/16 bg-porcelain/58 p-8 text-center shadow-[var(--shadow-beautiful-sm)]">
        <p className="font-serif text-3xl font-semibold text-espresso">No chapters are seeded yet.</p>
        <p className="mx-auto mt-3 max-w-xl text-sm leading-7 text-espresso/58">
          Run the Supabase seed file to create Elizabeth&apos;s archive chapter structure.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-5">
      {chapters.map((chapter) => (
        <form
          key={chapter.id}
          action={updateChapter}
          className="rounded-[1.75rem] bg-warm-black/[0.035] p-1.5 ring-1 ring-espresso/7 shadow-[var(--shadow-beautiful-md)]"
        >
          <input type="hidden" name="chapterId" value={chapter.id} />
          <div className="rounded-[calc(1.75rem-0.375rem)] border border-porcelain/80 bg-porcelain/76 p-5">
            <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
              <div>
                <p className="text-xs font-bold uppercase tracking-[0.18em] text-deep-lilac/72">
                  Chapter {String(chapter.chapter_number).padStart(2, "0")} / {chapter.slug}
                </p>
                <h2 className="mt-2 font-serif text-3xl font-semibold text-espresso">{chapter.title}</h2>
              </div>
              <StatusBadge status={chapter.is_visible ? "visible" : "hidden"} label={chapter.is_visible ? "Visible" : "Hidden"} />
            </div>

            <div className="mt-5 grid gap-4 md:grid-cols-[1fr_11rem]">
              <label className="space-y-2">
                <span className="text-sm font-bold text-espresso">Title</span>
                <input
                  name="title"
                  defaultValue={chapter.title}
                  required
                  className="min-h-12 w-full rounded-2xl border border-lilac-border/45 bg-ivory/70 px-4 text-sm text-espresso outline-none focus:border-deep-lilac/45 focus:ring-4 focus:ring-lilac-primary/16"
                />
              </label>
              <label className="space-y-2">
                <span className="text-sm font-bold text-espresso">Sort order</span>
                <input
                  name="sortOrder"
                  type="number"
                  min={0}
                  max={999}
                  defaultValue={chapter.sort_order}
                  className="min-h-12 w-full rounded-2xl border border-lilac-border/45 bg-ivory/70 px-4 text-sm text-espresso outline-none focus:border-deep-lilac/45 focus:ring-4 focus:ring-lilac-primary/16"
                />
              </label>
            </div>
            <label className="mt-4 block space-y-2">
              <span className="text-sm font-bold text-espresso">Subtitle</span>
              <input
                name="subtitle"
                defaultValue={chapter.subtitle ?? ""}
                className="min-h-12 w-full rounded-2xl border border-lilac-border/45 bg-ivory/70 px-4 text-sm text-espresso outline-none focus:border-deep-lilac/45 focus:ring-4 focus:ring-lilac-primary/16"
              />
            </label>
            <label className="mt-4 block space-y-2">
              <span className="text-sm font-bold text-espresso">Body</span>
              <textarea
                name="body"
                defaultValue={chapter.body ?? ""}
                className="min-h-32 w-full resize-y rounded-2xl border border-lilac-border/45 bg-ivory/70 px-4 py-3 text-sm leading-7 text-espresso outline-none focus:border-deep-lilac/45 focus:ring-4 focus:ring-lilac-primary/16"
              />
            </label>
            <div className="mt-5 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
              <label className="flex items-center gap-3 rounded-2xl border border-lilac-border/45 bg-pale-lilac/24 px-4 py-3 text-sm font-semibold text-espresso/70">
                <input
                  type="checkbox"
                  name="isVisible"
                  defaultChecked={chapter.is_visible}
                  className="size-4 rounded border-lilac-border accent-deep-lilac"
                />
                Visible in the later archive experience
              </label>
              <PendingSubmitButton pendingLabel="Saving chapter...">Save chapter</PendingSubmitButton>
            </div>
          </div>
        </form>
      ))}
    </div>
  );
}
