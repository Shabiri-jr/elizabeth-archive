import type { ArchiveMedia } from "@/lib/archive/queries";
import type { GalleryMode } from "@/lib/types";

export type EmotionalGalleryImage = ArchiveMedia & {
  displayCaption: string;
  altText: string;
  momentLabel: string;
  detailText: string;
};

export type EmotionalGalleryGroups = {
  allImages: EmotionalGalleryImage[];
  featuredImages: EmotionalGalleryImage[];
  polaroidImages: EmotionalGalleryImage[];
  filmStripImages: EmotionalGalleryImage[];
  timelineImages: EmotionalGalleryImage[];
};

const galleryModeRank: Record<GalleryMode, number> = {
  floating: 0,
  polaroid: 1,
  "film-strip": 2,
  timeline: 3,
};

function cleanText(value: string | null | undefined) {
  const text = value?.trim();
  return text ? text : null;
}

function compareGalleryImages(a: ArchiveMedia, b: ArchiveMedia) {
  const aOrder = a.displayOrder ?? Number.MAX_SAFE_INTEGER;
  const bOrder = b.displayOrder ?? Number.MAX_SAFE_INTEGER;

  if (a.featured !== b.featured) return a.featured ? -1 : 1;
  if (aOrder !== bOrder) return aOrder - bOrder;

  const aMode = a.galleryMode ? galleryModeRank[a.galleryMode] : Number.MAX_SAFE_INTEGER;
  const bMode = b.galleryMode ? galleryModeRank[b.galleryMode] : Number.MAX_SAFE_INTEGER;
  if (aMode !== bMode) return aMode - bMode;

  return new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
}

export function getGalleryCaption(image: ArchiveMedia) {
  return (
    cleanText(image.adminCaption) ??
    cleanText(image.caption) ??
    cleanText(image.memory) ??
    `${image.contributorName} / ${image.relationship}`
  );
}

export function getGalleryDetailText(image: ArchiveMedia) {
  return (
    cleanText(image.memory) ??
    cleanText(image.birthdayMessage) ??
    cleanText(image.futureWish) ??
    "This picture came without a long story, but it still belongs here."
  );
}

export function getGalleryMomentLabel(image: ArchiveMedia, index: number) {
  return cleanText(image.memoryDate) ?? cleanText(image.emotionTag) ?? `Moment ${String(index + 1).padStart(2, "0")}`;
}

export function prepareGalleryImages(images: ArchiveMedia[]): EmotionalGalleryImage[] {
  return [...images]
    .filter((image) => image.type === "image" && Boolean(image.url))
    .sort(compareGalleryImages)
    .map((image, index) => {
      const displayCaption = getGalleryCaption(image);

      return {
        ...image,
        displayCaption,
        altText: image.caption ?? image.adminCaption ?? `Photo keepsake from ${image.contributorName}`,
        momentLabel: getGalleryMomentLabel(image, index),
        detailText: getGalleryDetailText(image),
      };
    });
}

export function groupGalleryImages(images: ArchiveMedia[]): EmotionalGalleryGroups {
  const allImages = prepareGalleryImages(images);
  const featuredImages = allImages
    .filter((image) => image.featured || image.galleryMode === "floating")
    .slice(0, 4);

  return {
    allImages,
    featuredImages,
    polaroidImages: allImages.filter((image) => image.galleryMode !== "film-strip" || allImages.length < 6),
    filmStripImages: allImages.filter((image) => image.galleryMode === "film-strip").length
      ? allImages.filter((image) => image.galleryMode === "film-strip")
      : allImages.slice(0, 12),
    timelineImages: allImages.filter((image) => image.galleryMode === "timeline" || image.memoryDate).length
      ? allImages.filter((image) => image.galleryMode === "timeline" || image.memoryDate)
      : allImages,
  };
}
