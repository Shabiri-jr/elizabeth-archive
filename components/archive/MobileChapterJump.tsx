"use client";

import type { ChapterNavItem } from "@/components/archive/ChapterNav";

type MobileChapterJumpProps = {
  items: ChapterNavItem[];
};

export function MobileChapterJump({ items }: MobileChapterJumpProps) {
  return (
    <div className="sticky top-24 z-20 px-4 lg:hidden">
      <label className="block rounded-full border border-lilac-border/70 bg-porcelain/90 px-4 py-3 shadow-[var(--shadow-beautiful-sm)]">
        <span className="sr-only">Jump to chapter</span>
        <select
          defaultValue=""
          onChange={(event) => {
            const id = event.currentTarget.value;
            if (!id) return;
            document.getElementById(id)?.scrollIntoView({ behavior: "smooth", block: "start" });
            event.currentTarget.value = "";
          }}
          className="w-full bg-transparent text-sm font-bold text-deep-lilac outline-none"
        >
          <option value="">Jump to a chapter</option>
          {items.map((item) => (
            <option key={item.id} value={item.id}>
              {item.label} - {item.title}
            </option>
          ))}
        </select>
      </label>
    </div>
  );
}
