"use client";

import { useEffect, useMemo, useState } from "react";
import { CheckCircle2 } from "lucide-react";
import { cn } from "@/lib/utils";

export type LaunchChecklistItem = {
  id: string;
  label: string;
  hint: string;
  checkedByDefault?: boolean;
};

type LaunchChecklistProps = {
  items: LaunchChecklistItem[];
};

const STORAGE_KEY = "elizabeth-launch-checklist-v1";

export function LaunchChecklist({ items }: LaunchChecklistProps) {
  const initialState = useMemo(
    () => Object.fromEntries(items.map((item) => [item.id, Boolean(item.checkedByDefault)])),
    [items],
  );
  const [checked, setChecked] = useState<Record<string, boolean>>(initialState);

  useEffect(() => {
    const timer = window.setTimeout(() => {
      try {
        const stored = localStorage.getItem(STORAGE_KEY);
        if (stored) {
          setChecked({ ...initialState, ...(JSON.parse(stored) as Record<string, boolean>) });
        }
      } catch {
        // The checklist still works for the current session if storage is unavailable.
      }
    }, 0);

    return () => window.clearTimeout(timer);
  }, [initialState]);

  function toggleItem(id: string) {
    setChecked((current) => {
      const next = { ...current, [id]: !current[id] };
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
      } catch {
        // Local checklist state can remain in memory if storage is unavailable.
      }
      return next;
    });
  }

  const completed = items.filter((item) => checked[item.id]).length;

  return (
    <div className="rounded-[1.75rem] bg-warm-black/[0.035] p-1.5 ring-1 ring-espresso/7 shadow-[var(--shadow-beautiful-md)]">
      <div className="rounded-[calc(1.75rem-0.375rem)] border border-porcelain/80 bg-porcelain/76 p-5 sm:p-6">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
          <div>
            <p className="text-sm font-bold uppercase tracking-[0.18em] text-[#6c5392]">Launch checklist</p>
            <h2 className="mt-2 font-serif text-3xl font-semibold text-espresso">Ready for August 19</h2>
          </div>
          <span className="inline-flex w-fit items-center gap-2 rounded-full bg-pale-lilac px-3 py-1 text-sm font-bold text-[#6c5392]">
            <CheckCircle2 aria-hidden="true" className="size-4" />
            {completed}/{items.length}
          </span>
        </div>

        <div className="mt-6 grid gap-3">
          {items.map((item) => (
            <label
              key={item.id}
              className={cn(
                "flex cursor-pointer items-start gap-3 rounded-2xl border p-4 transition-[background,border-color] duration-300 ease-[var(--ease-weighted)]",
                checked[item.id]
                  ? "border-lilac-border/70 bg-pale-lilac/36"
                  : "border-espresso/10 bg-ivory/48 hover:border-lilac-border/70",
              )}
            >
              <input
                type="checkbox"
                checked={Boolean(checked[item.id])}
                onChange={() => toggleItem(item.id)}
                className="mt-1 size-4 rounded border-lilac-border accent-deep-lilac"
              />
              <span>
                <span className="block text-sm font-bold text-espresso">{item.label}</span>
                <span className="mt-1 block text-sm leading-6 text-espresso/58">{item.hint}</span>
              </span>
            </label>
          ))}
        </div>
      </div>
    </div>
  );
}
