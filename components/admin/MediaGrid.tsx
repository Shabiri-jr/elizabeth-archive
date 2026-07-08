import Link from "next/link";
import { MediaPreviewCard } from "@/components/admin/MediaPreviewCard";
import type { AdminMediaAsset } from "@/lib/admin/queries";

type MediaGridProps = {
  mediaAssets: AdminMediaAsset[];
  filters: {
    status: string;
    type: string;
  };
};

export function MediaGrid({ mediaAssets, filters }: MediaGridProps) {
  return (
    <div className="space-y-6">
      <form
        method="get"
        action="/admin/media"
        className="rounded-[1.5rem] border border-lilac-border/55 bg-porcelain/74 p-4 shadow-[var(--shadow-beautiful-sm)]"
      >
        <div className="grid gap-3 sm:grid-cols-[12rem_12rem_auto] sm:items-end">
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
            <span className="text-sm font-bold text-espresso">Type</span>
            <select
              name="type"
              defaultValue={filters.type}
              className="min-h-12 w-full rounded-2xl border border-lilac-border/45 bg-ivory/70 px-4 text-sm font-semibold text-espresso outline-none focus:border-deep-lilac/45 focus:ring-4 focus:ring-lilac-primary/16"
            >
              <option value="all">All</option>
              <option value="image">Images</option>
              <option value="audio">Audio</option>
              <option value="video">Video</option>
            </select>
          </label>
          <div className="flex gap-2">
            <button className="min-h-12 rounded-full bg-deep-lilac px-5 text-sm font-bold text-ivory shadow-[var(--shadow-beautiful-sm)]">
              Filter
            </button>
            <Link
              href="/admin/media"
              className="inline-flex min-h-12 items-center rounded-full bg-pale-lilac px-5 text-sm font-bold text-deep-lilac shadow-[var(--shadow-beautiful-sm)]"
            >
              Reset
            </Link>
          </div>
        </div>
      </form>

      {mediaAssets.length ? (
        <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
          {mediaAssets.map((media) => (
            <MediaPreviewCard key={media.id} media={media} />
          ))}
        </div>
      ) : (
        <div className="rounded-[1.75rem] border border-dashed border-espresso/16 bg-porcelain/58 p-8 text-center shadow-[var(--shadow-beautiful-sm)]">
          <p className="font-serif text-3xl font-semibold text-espresso">No media matches this room.</p>
          <p className="mx-auto mt-3 max-w-xl text-sm leading-7 text-espresso/58">
            Uploaded photos, voice notes, and videos will appear here with private previews for approval.
          </p>
        </div>
      )}
    </div>
  );
}
