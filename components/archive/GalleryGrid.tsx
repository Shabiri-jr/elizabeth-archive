import { ArchiveEmptyState } from "@/components/archive/ArchiveEmptyState";
import { ImageLightbox } from "@/components/archive/ImageLightbox";
import type { ArchiveMedia } from "@/lib/archive/queries";

type GalleryGridProps = {
  images: ArchiveMedia[];
};

export function GalleryGrid({ images }: GalleryGridProps) {
  if (!images.length) {
    return (
      <ArchiveEmptyState
        title="The gallery is still waiting for its first keepsake."
        body="Approved photos will sit here like carefully handled polaroids."
      />
    );
  }

  return <ImageLightbox images={images} />;
}
