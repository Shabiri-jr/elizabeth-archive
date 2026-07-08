"use client";

import { useCallback, useMemo, useState } from "react";
import { FilmStripGallery } from "@/components/archive/gallery/FilmStripGallery";
import { FloatingPhotoMemories } from "@/components/archive/gallery/FloatingPhotoMemories";
import { GalleryEmptyState } from "@/components/archive/gallery/GalleryEmptyState";
import { GallerySectionIntro } from "@/components/archive/gallery/GallerySectionIntro";
import { PhotoMemoryModal } from "@/components/archive/gallery/PhotoMemoryModal";
import { PolaroidWall } from "@/components/archive/gallery/PolaroidWall";
import { TimelineGallery } from "@/components/archive/gallery/TimelineGallery";
import { groupGalleryImages } from "@/lib/archive/gallery";
import type { ArchiveMedia } from "@/lib/archive/queries";

type EmotionalGalleryProps = {
  images: ArchiveMedia[];
};

export function EmotionalGallery({ images }: EmotionalGalleryProps) {
  const groups = useMemo(() => groupGalleryImages(images), [images]);
  const [activeIndex, setActiveIndex] = useState<number | null>(null);

  const openById = useCallback(
    (imageId: string) => {
      const index = groups.allImages.findIndex((image) => image.id === imageId);
      if (index >= 0) setActiveIndex(index);
    },
    [groups.allImages],
  );

  const close = useCallback(() => setActiveIndex(null), []);

  const showPrevious = useCallback(() => {
    setActiveIndex((index) => {
      if (index === null) return index;
      return (index - 1 + groups.allImages.length) % groups.allImages.length;
    });
  }, [groups.allImages.length]);

  const showNext = useCallback(() => {
    setActiveIndex((index) => {
      if (index === null) return index;
      return (index + 1) % groups.allImages.length;
    });
  }, [groups.allImages.length]);

  if (!groups.allImages.length) {
    return <GalleryEmptyState />;
  }

  const showFloating = groups.featuredImages.length > 0;
  const showFilmStrip = groups.filmStripImages.length > 1;
  const showTimeline = groups.timelineImages.length > 1;

  return (
    <div className="space-y-18">
      <div className="rounded-[2rem] border border-lilac-border/45 bg-porcelain/66 p-6 text-center shadow-[var(--shadow-beautiful-sm)] sm:p-8">
        <p className="mx-auto max-w-4xl font-serif text-3xl font-semibold leading-tight text-espresso sm:text-4xl">
          Not every memory arrives as a paragraph. Some arrive as a picture, a smile, a dress, a room, a day, a version of you people were grateful to witness.
        </p>
      </div>

      {showFloating ? (
        <section data-gallery-polaroid>
          <GallerySectionIntro
            eyebrow="Featured memories"
            title="Photos that float back first."
            body="A few selected keepsakes drift around the words they brought with them."
          />
          <FloatingPhotoMemories images={groups.featuredImages} onOpen={openById} />
        </section>
      ) : null}

      <section>
        <GallerySectionIntro
          eyebrow="Polaroid wall"
          title="Pictures people kept because you were in them."
          body="Some memories do not need perfect words. They just need to be kept."
        />
        <PolaroidWall images={groups.polaroidImages} onOpen={openById} />
      </section>

      {showFilmStrip ? (
        <section>
          <GallerySectionIntro
            eyebrow="The film reel"
            title="A small reel of moments."
            body="A little film strip of the moments people kept, with the story beside the active frame."
          />
          <FilmStripGallery images={groups.filmStripImages} onOpen={openById} />
        </section>
      ) : null}

      {showTimeline ? (
        <section>
          <GallerySectionIntro
            eyebrow="Timeline of moments"
            title="Every photo is a small chapter."
            body="When a date or label exists, it becomes a marker. When it does not, the memory still keeps its place."
          />
          <TimelineGallery images={groups.timelineImages} onOpen={openById} />
        </section>
      ) : null}

      <PhotoMemoryModal
        images={groups.allImages}
        activeIndex={activeIndex}
        onClose={close}
        onPrevious={showPrevious}
        onNext={showNext}
      />
    </div>
  );
}
