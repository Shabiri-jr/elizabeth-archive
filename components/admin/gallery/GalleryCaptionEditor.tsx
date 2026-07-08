import type { AdminMediaAsset } from "@/lib/admin/queries";

type GalleryCaptionEditorProps = {
  media: AdminMediaAsset;
};

const inputClasses =
  "min-h-12 w-full rounded-2xl border border-lilac-border/45 bg-ivory/70 px-4 text-sm text-espresso outline-none focus:border-deep-lilac/45 focus:ring-4 focus:ring-lilac-primary/16";

export function GalleryCaptionEditor({ media }: GalleryCaptionEditorProps) {
  return (
    <div className="grid gap-3">
      <label className="space-y-2">
        <span className="text-sm font-bold text-espresso">Gallery caption</span>
        <textarea
          name="adminCaption"
          defaultValue={media.admin_caption ?? ""}
          rows={3}
          maxLength={500}
          placeholder={media.caption ?? "Add a warmer caption for Elizabeth's gallery."}
          className="min-h-28 w-full resize-y rounded-2xl border border-lilac-border/45 bg-ivory/70 px-4 py-3 text-sm leading-6 text-espresso outline-none focus:border-deep-lilac/45 focus:ring-4 focus:ring-lilac-primary/16"
        />
      </label>

      <div className="grid gap-3 sm:grid-cols-2">
        <label className="space-y-2">
          <span className="text-sm font-bold text-espresso">Moment label/date</span>
          <input
            name="memoryDate"
            defaultValue={media.memory_date ?? ""}
            maxLength={500}
            placeholder="Graduation era"
            className={inputClasses}
          />
        </label>
        <label className="space-y-2">
          <span className="text-sm font-bold text-espresso">Emotion tag</span>
          <input
            name="emotionTag"
            defaultValue={media.emotion_tag ?? ""}
            maxLength={500}
            placeholder="Soft memory"
            className={inputClasses}
          />
        </label>
      </div>
    </div>
  );
}
