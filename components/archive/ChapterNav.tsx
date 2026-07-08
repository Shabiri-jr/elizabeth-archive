"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { cn } from "@/lib/utils";

export type ChapterNavItem = {
  id: string;
  label: string;
  title: string;
};

type ChapterNavProps = {
  items: ChapterNavItem[];
};

export function ChapterNav({ items }: ChapterNavProps) {
  const [activeId, setActiveId] = useState(items[0]?.id ?? "");

  useEffect(() => {
    const sections = items
      .map((item) => document.getElementById(item.id))
      .filter((section): section is HTMLElement => Boolean(section));

    if (!sections.length || !("IntersectionObserver" in window)) return;

    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((entry) => entry.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];

        if (visible?.target.id) {
          setActiveId(visible.target.id);
        }
      },
      { threshold: [0.18, 0.32, 0.5], rootMargin: "-20% 0px -55% 0px" },
    );

    sections.forEach((section) => observer.observe(section));
    return () => observer.disconnect();
  }, [items]);

  return (
    <div className="pointer-events-none sticky top-24 z-20 hidden px-4 lg:block">
      <nav
        aria-label="Archive chapters"
        className="pointer-events-auto ml-auto mr-6 w-64 rounded-[1.5rem] bg-warm-black/[0.035] p-1.5 ring-1 ring-espresso/7 shadow-[var(--shadow-beautiful-md)]"
      >
        <div className="rounded-[calc(1.5rem-0.375rem)] border border-porcelain/80 bg-porcelain/82 p-3">
          <p className="px-3 pb-2 text-[0.65rem] font-bold uppercase tracking-[0.22em] text-deep-lilac/70">
            Chapter index
          </p>
          <div className="grid gap-1">
            {items.map((item) => (
              <Link
                key={item.id}
                href={`#${item.id}`}
                className={cn(
                  "rounded-2xl px-3 py-2 text-sm font-semibold transition-[background,color,transform] duration-500 ease-[var(--ease-weighted)] hover:-translate-y-0.5 hover:bg-pale-lilac",
                  activeId === item.id ? "bg-pale-lilac text-deep-lilac" : "text-espresso/58",
                )}
              >
                <span className="block text-[0.62rem] uppercase tracking-[0.18em] opacity-70">{item.label}</span>
                <span className="mt-1 block leading-5">{item.title}</span>
              </Link>
            ))}
          </div>
        </div>
      </nav>
    </div>
  );
}
