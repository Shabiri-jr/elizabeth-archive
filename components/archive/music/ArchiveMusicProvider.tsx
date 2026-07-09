"use client";

import { useCallback, useEffect, useMemo, useRef, useState, type ReactNode } from "react";
import { Music2 } from "lucide-react";
import { usePathname } from "next/navigation";
import { ArchiveMusicPlayer } from "@/components/archive/music/ArchiveMusicPlayer";
import type { ArchiveMusicTrack } from "@/lib/music";

type ArchiveMusicProviderProps = {
  track: ArchiveMusicTrack | null;
  children: ReactNode;
};

type MusicChoice = "play" | "quiet" | null;

const MUSIC_CHOICE_KEY = "elizabeth-archive-music-choice";
const MUSIC_VOLUME_KEY = "elizabeth-archive-music-volume";
const MUSIC_MUTED_KEY = "elizabeth-archive-music-muted";

function clampVolume(value: number) {
  if (!Number.isFinite(value)) return 0.25;
  return Math.min(1, Math.max(0, value));
}

function isMusicRoute(pathname: string) {
  return pathname.startsWith("/archive") && pathname !== "/archive/locked" && pathname !== "/archive/keepsake";
}

function readStoredChoice(): MusicChoice {
  try {
    const value = localStorage.getItem(MUSIC_CHOICE_KEY);
    return value === "play" || value === "quiet" ? value : null;
  } catch {
    return null;
  }
}

function readStoredVolume(defaultVolume: number) {
  try {
    const value = localStorage.getItem(MUSIC_VOLUME_KEY);
    return value === null ? defaultVolume : clampVolume(Number(value));
  } catch {
    return defaultVolume;
  }
}

function readStoredMuted() {
  try {
    return localStorage.getItem(MUSIC_MUTED_KEY) === "true";
  } catch {
    return false;
  }
}

export function ArchiveMusicProvider({ track, children }: ArchiveMusicProviderProps) {
  const pathname = usePathname();
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [hydrated, setHydrated] = useState(false);
  const [choice, setChoice] = useState<MusicChoice>(null);
  const [volume, setVolume] = useState(() => clampVolume(track?.defaultVolume ?? 0.25));
  const [muted, setMuted] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [playbackMessage, setPlaybackMessage] = useState("");
  const musicRoute = isMusicRoute(pathname);

  const shouldShowPrompt = useMemo(
    () => hydrated && Boolean(track?.promptEnabled) && musicRoute && choice === null,
    [choice, hydrated, musicRoute, track?.promptEnabled],
  );

  useEffect(() => {
    if (!track) return;

    const timer = window.setTimeout(() => {
      setChoice(readStoredChoice());
      setVolume(readStoredVolume(clampVolume(track.defaultVolume)));
      setMuted(readStoredMuted());
      setHydrated(true);
    }, 0);

    return () => window.clearTimeout(timer);
  }, [track]);

  useEffect(() => {
    if (!audioRef.current) return;
    audioRef.current.volume = volume;
    audioRef.current.muted = muted;
  }, [muted, volume]);

  useEffect(() => {
    if (!musicRoute && audioRef.current) {
      audioRef.current.pause();
      setIsPlaying(false);
    }
  }, [musicRoute]);

  useEffect(() => {
    if (!track && audioRef.current) {
      audioRef.current.pause();
      setIsPlaying(false);
    }
  }, [track]);

  const persistChoice = useCallback((nextChoice: Exclude<MusicChoice, null>) => {
    setChoice(nextChoice);
    try {
      localStorage.setItem(MUSIC_CHOICE_KEY, nextChoice);
    } catch {
      // Non-sensitive preference storage can fail in private browsing.
    }
  }, []);

  const playMusic = useCallback(async () => {
    const audio = audioRef.current;
    if (!audio) return;

    persistChoice("play");
    setPlaybackMessage("");

    try {
      await audio.play();
      setIsPlaying(true);
    } catch {
      setIsPlaying(false);
      setPlaybackMessage("Tap play when you are ready for music.");
    }
  }, [persistChoice]);

  const continueQuietly = useCallback(() => {
    persistChoice("quiet");
    audioRef.current?.pause();
    setIsPlaying(false);
    setPlaybackMessage("");
  }, [persistChoice]);

  const togglePlayback = useCallback(() => {
    if (isPlaying) {
      audioRef.current?.pause();
      setIsPlaying(false);
      return;
    }

    void playMusic();
  }, [isPlaying, playMusic]);

  const updateVolume = useCallback((nextVolume: number) => {
    const safeVolume = clampVolume(nextVolume);
    setVolume(safeVolume);
    try {
      localStorage.setItem(MUSIC_VOLUME_KEY, String(safeVolume));
    } catch {
      // Preference only.
    }
  }, []);

  const toggleMuted = useCallback(() => {
    setMuted((current) => {
      const nextMuted = !current;
      try {
        localStorage.setItem(MUSIC_MUTED_KEY, String(nextMuted));
      } catch {
        // Preference only.
      }
      return nextMuted;
    });
  }, []);

  return (
    <>
      {children}
      {track ? (
        <audio
          ref={audioRef}
          src={track.url}
          preload="none"
          loop
          onPlay={() => setIsPlaying(true)}
          onPause={() => setIsPlaying(false)}
        />
      ) : null}

      {shouldShowPrompt ? (
        <div
          role="dialog"
          aria-modal="true"
          aria-labelledby="music-permission-title"
          className="fixed inset-0 z-[55] flex items-center justify-center bg-warm-black/45 px-4 backdrop-blur-sm print-hide"
        >
          <div className="w-full max-w-lg rounded-[2rem] border border-lilac-border/70 bg-porcelain p-6 text-center shadow-[var(--shadow-beautiful-lg)] sm:p-8">
            <div className="mx-auto flex size-14 items-center justify-center rounded-full bg-pale-lilac text-deep-lilac">
              <Music2 aria-hidden="true" className="size-6" strokeWidth={1.5} />
            </div>
            <h2 id="music-permission-title" className="mt-5 font-serif text-3xl font-semibold text-espresso">
              Would you like music with your story?
            </h2>
            <p className="mt-3 text-sm leading-7 text-espresso/62">
              A soft background track can play while you move through the archive. You can pause it anytime.
            </p>
            <div className="mt-7 grid gap-3 sm:grid-cols-2">
              <button
                type="button"
                onClick={() => void playMusic()}
                className="min-h-12 rounded-full bg-deep-lilac px-5 text-sm font-bold text-ivory shadow-[var(--shadow-beautiful-sm)] transition-[background,transform] duration-300 hover:-translate-y-0.5 hover:bg-[#6c5392] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-deep-lilac/45"
              >
                Play music
              </button>
              <button
                type="button"
                onClick={continueQuietly}
                className="min-h-12 rounded-full border border-lilac-border/70 bg-ivory px-5 text-sm font-bold text-espresso shadow-[var(--shadow-beautiful-sm)] transition-[background,transform] duration-300 hover:-translate-y-0.5 hover:bg-pale-lilac focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-deep-lilac/45"
              >
                Continue quietly
              </button>
            </div>
          </div>
        </div>
      ) : null}

      {track && musicRoute && hydrated ? (
        <ArchiveMusicPlayer
          track={track}
          isPlaying={isPlaying}
          volume={volume}
          muted={muted}
          playbackMessage={playbackMessage}
          onTogglePlayback={togglePlayback}
          onToggleMuted={toggleMuted}
          onVolumeChange={updateVolume}
        />
      ) : null}
    </>
  );
}
