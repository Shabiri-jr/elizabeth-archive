"use client";

import { useCallback, useEffect, useLayoutEffect, useRef, useState } from "react";
import { ChevronUp, GripHorizontal, Minimize2, Pause, Play, Volume2, VolumeX } from "lucide-react";
import { cn } from "@/lib/utils";
import type { ArchiveMusicTrack } from "@/lib/music";

const POSITION_KEY = "elizabeth-archive-music-position";
const MINIMIZED_KEY = "elizabeth-archive-music-minimized";

type Position = { x: number; y: number };

type ArchiveMusicPlayerProps = {
  track: ArchiveMusicTrack;
  isPlaying: boolean;
  volume: number;
  muted: boolean;
  playbackMessage: string;
  onTogglePlayback: () => void;
  onToggleMuted: () => void;
  onVolumeChange: (volume: number) => void;
};

function readStoredPosition(): Position | null {
  try {
    const raw = localStorage.getItem(POSITION_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw) as Position;
    if (typeof parsed.x === "number" && typeof parsed.y === "number") return parsed;
  } catch {
    // Preference only.
  }
  return null;
}

function writeStoredPosition(position: Position) {
  try {
    localStorage.setItem(POSITION_KEY, JSON.stringify(position));
  } catch {
    // Preference only.
  }
}

function readStoredMinimized() {
  try {
    return localStorage.getItem(MINIMIZED_KEY) === "true";
  } catch {
    return false;
  }
}

function writeStoredMinimized(minimized: boolean) {
  try {
    localStorage.setItem(MINIMIZED_KEY, String(minimized));
  } catch {
    // Preference only.
  }
}

function clampPosition(position: Position, panelWidth: number, panelHeight: number): Position {
  const maxX = Math.max(12, window.innerWidth - panelWidth - 12);
  const maxY = Math.max(12, window.innerHeight - panelHeight - 12);
  return {
    x: Math.min(maxX, Math.max(12, position.x)),
    y: Math.min(maxY, Math.max(12, position.y)),
  };
}

function getDefaultPosition(panelWidth: number, panelHeight: number): Position {
  return clampPosition(
    {
      x: window.innerWidth - panelWidth - 20,
      y: window.innerHeight - panelHeight - 20,
    },
    panelWidth,
    panelHeight,
  );
}

export function ArchiveMusicPlayer({
  track,
  isPlaying,
  volume,
  muted,
  playbackMessage,
  onTogglePlayback,
  onToggleMuted,
  onVolumeChange,
}: ArchiveMusicPlayerProps) {
  const panelRef = useRef<HTMLElement>(null);
  const positionRef = useRef<Position | null>(null);
  const dragOffsetRef = useRef({ x: 0, y: 0 });
  const [position, setPosition] = useState<Position | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [minimized, setMinimized] = useState(false);

  const syncPosition = useCallback((next: Position) => {
    const panel = panelRef.current;
    if (!panel) {
      setPosition(next);
      positionRef.current = next;
      return;
    }

    const clamped = clampPosition(next, panel.offsetWidth, panel.offsetHeight);
    setPosition(clamped);
    positionRef.current = clamped;
  }, []);

  useLayoutEffect(() => {
    const panel = panelRef.current;
    if (!panel) return;

    const stored = readStoredPosition();
    syncPosition(stored ?? getDefaultPosition(panel.offsetWidth, panel.offsetHeight));
    setMinimized(readStoredMinimized());
  }, [syncPosition]);

  useLayoutEffect(() => {
    if (!positionRef.current) return;
    syncPosition(positionRef.current);
  }, [minimized, syncPosition]);

  useEffect(() => {
    function handleResize() {
      if (!positionRef.current || !panelRef.current) return;
      syncPosition(positionRef.current);
    }

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, [syncPosition]);

  const handlePointerDown = useCallback(
    (event: React.PointerEvent<HTMLElement>) => {
      if ((event.target as HTMLElement).closest("[data-no-drag]")) return;
      if (!positionRef.current) return;

      event.preventDefault();
      dragOffsetRef.current = {
        x: event.clientX - positionRef.current.x,
        y: event.clientY - positionRef.current.y,
      };
      setIsDragging(true);
      event.currentTarget.setPointerCapture(event.pointerId);
    },
    [],
  );

  const handlePointerMove = useCallback(
    (event: React.PointerEvent<HTMLElement>) => {
      if (!isDragging) return;

      syncPosition({
        x: event.clientX - dragOffsetRef.current.x,
        y: event.clientY - dragOffsetRef.current.y,
      });
    },
    [isDragging, syncPosition],
  );

  const handlePointerUp = useCallback(
    (event: React.PointerEvent<HTMLElement>) => {
      if (!isDragging) return;

      setIsDragging(false);
      event.currentTarget.releasePointerCapture(event.pointerId);
      if (positionRef.current) writeStoredPosition(positionRef.current);
    },
    [isDragging],
  );

  const toggleMinimized = useCallback((nextMinimized: boolean) => {
    setMinimized(nextMinimized);
    writeStoredMinimized(nextMinimized);
  }, []);

  if (!position) {
    return (
      <aside
        ref={panelRef}
        aria-hidden="true"
        className={cn(
          "pointer-events-none fixed bottom-5 right-5 z-40 opacity-0 print-hide",
          minimized ? "size-14 rounded-full" : "w-[min(92vw,18rem)] rounded-[1.6rem]",
        )}
      />
    );
  }

  return (
    <aside
      ref={panelRef}
      aria-label="Background music player"
      className={cn(
        "fixed z-[45] overflow-hidden border border-lilac-border/75 bg-ivory/96 shadow-[var(--shadow-beautiful-lg)] backdrop-blur-xl print-hide",
        minimized ? "size-14 rounded-full" : "w-[min(92vw,18rem)] rounded-[1.6rem]",
        isDragging ? "cursor-grabbing select-none" : "cursor-default",
      )}
      style={{ left: position.x, top: position.y }}
      onPointerDown={minimized ? handlePointerDown : undefined}
      onPointerMove={minimized ? handlePointerMove : undefined}
      onPointerUp={minimized ? handlePointerUp : undefined}
      onPointerCancel={minimized ? handlePointerUp : undefined}
    >
      {minimized ? (
        <div className="relative flex size-14 items-center justify-center">
          {isPlaying ? (
            <span
              aria-hidden="true"
              className="absolute inset-1 rounded-full border border-deep-lilac/35 bg-pale-lilac/45"
            />
          ) : null}
          <button
            type="button"
            data-no-drag
            onClick={onTogglePlayback}
            className="relative z-10 flex size-10 items-center justify-center rounded-full bg-deep-lilac text-ivory shadow-[var(--shadow-beautiful-sm)] transition-[background,transform] duration-300 hover:-translate-y-0.5 hover:bg-[#6c5392] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-deep-lilac/45"
            aria-label={isPlaying ? "Pause background music" : "Play background music"}
          >
            {isPlaying ? <Pause aria-hidden="true" className="size-4" /> : <Play aria-hidden="true" className="size-4" />}
          </button>
          <button
            type="button"
            data-no-drag
            onClick={() => toggleMinimized(false)}
            className="absolute -right-1 -top-1 z-20 flex size-6 items-center justify-center rounded-full border border-lilac-border/70 bg-ivory text-espresso shadow-[var(--shadow-beautiful-sm)] transition-[background,transform] duration-300 hover:-translate-y-0.5 hover:bg-pale-lilac focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-deep-lilac/45"
            aria-label="Expand music player"
          >
            <ChevronUp aria-hidden="true" className="size-3.5" />
          </button>
        </div>
      ) : (
        <>
          <div className="flex items-center gap-2 border-b border-lilac-border/45 bg-pale-lilac/35 px-3 py-2">
            <button
              type="button"
              data-drag-handle
              onPointerDown={handlePointerDown}
              onPointerMove={handlePointerMove}
              onPointerUp={handlePointerUp}
              onPointerCancel={handlePointerUp}
              className={cn(
                "flex min-w-0 flex-1 items-center justify-center gap-2 rounded-xl px-2 py-1.5 text-espresso/52 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-deep-lilac/45",
                isDragging ? "cursor-grabbing bg-pale-lilac/70" : "cursor-grab hover:bg-pale-lilac/55",
              )}
              aria-label="Drag music player"
            >
              <GripHorizontal aria-hidden="true" className="size-4" />
              <span className="text-[0.68rem] font-bold uppercase tracking-[0.18em]">Drag to move</span>
            </button>
            <button
              type="button"
              data-no-drag
              onClick={() => toggleMinimized(true)}
              className="flex size-8 shrink-0 items-center justify-center rounded-full border border-lilac-border/60 bg-ivory text-espresso/58 shadow-[var(--shadow-beautiful-sm)] transition-[background,transform] duration-300 hover:-translate-y-0.5 hover:bg-pale-lilac focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-deep-lilac/45"
              aria-label="Minimize music player"
            >
              <Minimize2 aria-hidden="true" className="size-3.5" />
            </button>
          </div>

          <div className="space-y-4 p-4">
            <div className="flex items-start gap-3">
              <button
                type="button"
                onClick={onTogglePlayback}
                className="flex size-12 shrink-0 items-center justify-center rounded-full bg-deep-lilac text-ivory shadow-[var(--shadow-beautiful-sm)] transition-[background,transform] duration-300 hover:-translate-y-0.5 hover:bg-[#6c5392] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-deep-lilac/45"
                aria-label={isPlaying ? "Pause background music" : "Play background music"}
              >
                {isPlaying ? <Pause aria-hidden="true" className="size-5" /> : <Play aria-hidden="true" className="size-5" />}
              </button>

              <div className="min-w-0 flex-1 pt-0.5">
                <p className="text-[0.68rem] font-bold uppercase tracking-[0.18em] text-deep-lilac/72">Background music</p>
                <p className="mt-1 text-base font-bold leading-snug text-espresso">{track.title}</p>
                {track.description ? <p className="mt-1 text-sm leading-5 text-espresso/56">{track.description}</p> : null}
              </div>
            </div>

            <div className="rounded-[1.1rem] border border-lilac-border/55 bg-porcelain/80 p-3">
              <div className="flex items-center justify-between gap-3">
                <span className="text-[0.68rem] font-bold uppercase tracking-[0.16em] text-espresso/48">Volume</span>
                <button
                  type="button"
                  onClick={onToggleMuted}
                  className={cn(
                    "flex size-9 shrink-0 items-center justify-center rounded-full border shadow-[var(--shadow-beautiful-sm)] transition-[background,transform,color] duration-300 hover:-translate-y-0.5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-deep-lilac/45",
                    muted
                      ? "border-lilac-border bg-pale-lilac text-deep-lilac"
                      : "border-espresso/10 bg-ivory text-espresso/60",
                  )}
                  aria-label={muted ? "Unmute background music" : "Mute background music"}
                  aria-pressed={muted}
                >
                  {muted ? <VolumeX aria-hidden="true" className="size-4" /> : <Volume2 aria-hidden="true" className="size-4" />}
                </button>
              </div>

              <input
                type="range"
                min="0"
                max="1"
                step="0.01"
                value={volume}
                onChange={(event) => onVolumeChange(Number(event.target.value))}
                className="mt-3 h-2 w-full cursor-pointer appearance-none rounded-full bg-lilac-border/35 accent-deep-lilac [&::-webkit-slider-thumb]:size-4 [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-deep-lilac"
                aria-label="Background music volume"
              />
              <p className="mt-2 text-right text-xs font-bold uppercase tracking-[0.14em] text-espresso/46">
                {Math.round(volume * 100)}%
              </p>
            </div>

            {playbackMessage ? <p className="text-xs leading-5 text-espresso/52">{playbackMessage}</p> : null}
            <p className="sr-only" aria-live="polite">
              {playbackMessage}
            </p>
          </div>
        </>
      )}
    </aside>
  );
}
