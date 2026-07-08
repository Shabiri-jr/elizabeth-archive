"use client";

import { createContext, useCallback, useContext, useMemo, useState, type ReactNode } from "react";
import { toggleElizabethFavourite } from "@/app/archive/actions";
import type { FavouriteItemType } from "@/lib/types";

type ToastState = {
  message: string;
  detail?: string;
};

type ArchiveInteractionsContextValue = {
  favouriteKeys: Set<string>;
  toggleFavourite: (itemType: FavouriteItemType, itemId: string) => Promise<void>;
  isFavourite: (itemType: FavouriteItemType, itemId: string) => boolean;
  showToast: (message: string, detail?: string) => void;
  unlockEasterEgg: (key: string, message: string) => void;
  discoveredCount: number;
  replayTrailer: () => void;
};

const ArchiveInteractionsContext = createContext<ArchiveInteractionsContextValue | null>(null);
const EASTER_EGG_STORAGE_KEY = "elizabeth-easter-eggs-unlocked";

function readUnlockedKeys() {
  if (typeof window === "undefined") return new Set<string>();

  try {
    const stored = window.localStorage.getItem(EASTER_EGG_STORAGE_KEY);
    const parsed = stored ? (JSON.parse(stored) as unknown) : [];
    return new Set(Array.isArray(parsed) ? parsed.filter((item): item is string => typeof item === "string") : []);
  } catch {
    return new Set<string>();
  }
}

function writeUnlockedKeys(keys: Set<string>) {
  try {
    window.localStorage.setItem(EASTER_EGG_STORAGE_KEY, JSON.stringify(Array.from(keys)));
  } catch {
    // Discovery count can remain in memory when browser storage is unavailable.
  }
}

type ArchiveInteractionsProviderProps = {
  initialFavouriteKeys: string[];
  children: ReactNode;
};

export function ArchiveInteractionsProvider({ initialFavouriteKeys, children }: ArchiveInteractionsProviderProps) {
  const [favouriteKeys, setFavouriteKeys] = useState(() => new Set(initialFavouriteKeys));
  const [toast, setToast] = useState<ToastState | null>(null);
  const [unlockedKeys, setUnlockedKeys] = useState(readUnlockedKeys);

  const showToast = useCallback((message: string, detail?: string) => {
    setToast({ message, detail });
    window.setTimeout(() => setToast(null), 3200);
  }, []);

  const isFavourite = useCallback(
    (itemType: FavouriteItemType, itemId: string) => favouriteKeys.has(`${itemType}:${itemId}`),
    [favouriteKeys],
  );

  const toggleFavourite = useCallback(
    async (itemType: FavouriteItemType, itemId: string) => {
      const key = `${itemType}:${itemId}`;
      const shouldSave = !favouriteKeys.has(key);

      setFavouriteKeys((current) => {
        const next = new Set(current);
        if (shouldSave) {
          next.add(key);
        } else {
          next.delete(key);
        }
        return next;
      });

      const result = await toggleElizabethFavourite({ itemType, itemId, shouldSave });

      if (!result.ok) {
        setFavouriteKeys((current) => {
          const next = new Set(current);
          if (shouldSave) {
            next.delete(key);
          } else {
            next.add(key);
          }
          return next;
        });
      }

      showToast(result.message);
    },
    [favouriteKeys, showToast],
  );

  const unlockEasterEgg = useCallback(
    (key: string, message: string) => {
      if (unlockedKeys.has(key)) {
        showToast(message, `${unlockedKeys.size} hidden notes discovered`);
        return;
      }

      const next = new Set(unlockedKeys);
      next.add(key);
      writeUnlockedKeys(next);
      setUnlockedKeys(next);
      showToast(message, `${next.size} hidden notes discovered`);
    },
    [showToast, unlockedKeys],
  );

  const replayTrailer = useCallback(() => {
    window.dispatchEvent(new CustomEvent("elizabeth:replay-trailer"));
  }, []);

  const value = useMemo<ArchiveInteractionsContextValue>(
    () => ({
      favouriteKeys,
      toggleFavourite,
      isFavourite,
      showToast,
      unlockEasterEgg,
      discoveredCount: unlockedKeys.size,
      replayTrailer,
    }),
    [favouriteKeys, isFavourite, replayTrailer, showToast, toggleFavourite, unlockEasterEgg, unlockedKeys.size],
  );

  return (
    <ArchiveInteractionsContext.Provider value={value}>
      {children}
      {toast ? (
        <div
          role="status"
          aria-live="polite"
          className="fixed bottom-5 left-1/2 z-50 w-[min(92vw,26rem)] -translate-x-1/2 rounded-[1.35rem] border border-lilac-border/75 bg-porcelain/96 p-4 text-center shadow-[var(--shadow-beautiful-md)]"
        >
          <p className="font-serif text-xl font-semibold text-espresso">{toast.message}</p>
          {toast.detail ? <p className="mt-1 text-xs font-bold uppercase tracking-[0.16em] text-deep-lilac/70">{toast.detail}</p> : null}
        </div>
      ) : null}
    </ArchiveInteractionsContext.Provider>
  );
}

export function useArchiveInteractions() {
  const context = useContext(ArchiveInteractionsContext);

  if (!context) {
    throw new Error("useArchiveInteractions must be used inside ArchiveInteractionsProvider.");
  }

  return context;
}
