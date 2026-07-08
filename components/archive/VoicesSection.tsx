import { ArchiveEmptyState } from "@/components/archive/ArchiveEmptyState";
import { VideoMessageCard } from "@/components/archive/VideoMessageCard";
import { VoiceNoteCard } from "@/components/archive/VoiceNoteCard";
import type { ArchiveMedia } from "@/lib/archive/queries";

type VoicesSectionProps = {
  audio: ArchiveMedia[];
  videos: ArchiveMedia[];
};

export function VoicesSection({ audio, videos }: VoicesSectionProps) {
  if (!audio.length && !videos.length) {
    return (
      <ArchiveEmptyState
        title="Some voices are too special to rush."
        body="Approved voice notes and videos will appear here when they are ready."
      />
    );
  }

  return (
    <div className="grid gap-5 lg:grid-cols-2">
      {audio.map((item) => (
        <VoiceNoteCard key={item.id} audio={item} />
      ))}
      {videos.map((item) => (
        <VideoMessageCard key={item.id} video={item} />
      ))}
    </div>
  );
}
