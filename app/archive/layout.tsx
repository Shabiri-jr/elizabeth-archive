import type { ReactNode } from "react";
import { ArchiveMusicProvider } from "@/components/archive/music/ArchiveMusicProvider";
import { getActiveMusicTrack } from "@/lib/music";

export default async function ArchiveLayout({ children }: { children: ReactNode }) {
  const musicTrack = await getActiveMusicTrack();

  return <ArchiveMusicProvider track={musicTrack}>{children}</ArchiveMusicProvider>;
}
