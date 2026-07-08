import type { GalleryMode } from "@/lib/types";

type GalleryModeSelectorProps = {
  defaultValue: GalleryMode | null;
};

const modes = [
  { value: "", label: "Auto" },
  { value: "polaroid", label: "Polaroid wall" },
  { value: "film-strip", label: "Film strip" },
  { value: "timeline", label: "Timeline" },
  { value: "floating", label: "Floating memory" },
] as const;

export function GalleryModeSelector({ defaultValue }: GalleryModeSelectorProps) {
  return (
    <label className="space-y-2">
      <span className="text-sm font-bold text-espresso">Gallery mode</span>
      <select
        name="galleryMode"
        defaultValue={defaultValue ?? ""}
        className="min-h-12 w-full rounded-2xl border border-lilac-border/45 bg-ivory/70 px-4 text-sm font-semibold text-espresso outline-none focus:border-deep-lilac/45 focus:ring-4 focus:ring-lilac-primary/16"
      >
        {modes.map((mode) => (
          <option key={mode.value} value={mode.value}>
            {mode.label}
          </option>
        ))}
      </select>
    </label>
  );
}
