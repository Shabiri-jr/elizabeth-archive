import { GalleryImageCard } from "@/components/admin/gallery/GalleryImageCard";
import type { AdminMediaAsset } from "@/lib/admin/queries";

type AdminGalleryManagerProps = {
  images: AdminMediaAsset[];
};

export function AdminGalleryManager({ images }: AdminGalleryManagerProps) {
  const approvedCount = images.filter((image) => image.status === "approved").length;
  const featuredCount = images.filter((image) => image.featured).length;

  return (
    <div className="space-y-6">
      <div className="grid gap-4 md:grid-cols-3">
        <div className="rounded-[1.5rem] border border-lilac-border/45 bg-porcelain/72 p-5 shadow-[var(--shadow-beautiful-sm)]">
          <p className="text-xs font-bold uppercase tracking-[0.18em] text-deep-lilac/72">Gallery images</p>
          <p className="mt-2 font-serif text-4xl font-semibold text-espresso">{images.length}</p>
        </div>
        <div className="rounded-[1.5rem] border border-lilac-border/45 bg-porcelain/72 p-5 shadow-[var(--shadow-beautiful-sm)]">
          <p className="text-xs font-bold uppercase tracking-[0.18em] text-deep-lilac/72">Approved</p>
          <p className="mt-2 font-serif text-4xl font-semibold text-espresso">{approvedCount}</p>
        </div>
        <div className="rounded-[1.5rem] border border-lilac-border/45 bg-porcelain/72 p-5 shadow-[var(--shadow-beautiful-sm)]">
          <p className="text-xs font-bold uppercase tracking-[0.18em] text-deep-lilac/72">Featured</p>
          <p className="mt-2 font-serif text-4xl font-semibold text-espresso">{featuredCount}</p>
        </div>
      </div>

      {images.length ? (
        <div className="grid gap-5 xl:grid-cols-2">
          {images.map((image) => (
            <GalleryImageCard key={image.id} media={image} />
          ))}
        </div>
      ) : (
        <div className="rounded-[1.75rem] border border-dashed border-espresso/16 bg-porcelain/58 p-8 text-center shadow-[var(--shadow-beautiful-sm)]">
          <p className="font-serif text-3xl font-semibold text-espresso">No photos are ready for gallery styling yet.</p>
          <p className="mx-auto mt-3 max-w-xl text-sm leading-7 text-espresso/58">
            Once contributors upload photos, they will appear here for captions, featured placement, and emotional gallery modes.
          </p>
        </div>
      )}
    </div>
  );
}
