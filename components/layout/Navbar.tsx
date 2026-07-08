"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { LockKeyhole } from "lucide-react";
import { appTitle, navLinks } from "@/lib/constants";
import { cn } from "@/lib/utils";

export function Navbar() {
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);

  const isActive = (href: string) => (href === "/" ? pathname === href : pathname.startsWith(href));

  return (
    <header className="sticky top-0 z-30 px-4 pt-4 sm:pt-6">
      <nav
        aria-label="Primary navigation"
        className="mx-auto flex max-w-5xl items-center justify-between gap-3 rounded-full border border-lilac-border/55 bg-ivory/86 px-3 py-2 shadow-[0px_2px_3px_-1px_rgba(0,0,0,0.1),0px_1px_0px_0px_rgba(25,28,33,0.02),0px_0px_0px_1px_rgba(25,28,33,0.08)] backdrop-blur-xl sm:px-4"
      >
        <Link
          href="/"
          className="group inline-flex min-h-11 items-center gap-2 rounded-full px-2 text-sm font-semibold tracking-[0.02em] text-espresso outline-none transition-[color,transform] duration-500 ease-[var(--ease-weighted)] hover:text-deep-lilac focus-visible:ring-2 focus-visible:ring-deep-lilac/35"
        >
          <span className="flex size-8 items-center justify-center rounded-full bg-deep-lilac text-ivory transition-transform duration-500 ease-[var(--ease-weighted)] group-hover:scale-105">
            <LockKeyhole aria-hidden="true" className="size-3.5" strokeWidth={1.4} />
          </span>
          <span className="hidden font-serif text-base sm:inline">{appTitle}</span>
          <span className="font-serif text-base sm:hidden">Elizabeth</span>
        </Link>

        <div className="hidden items-center rounded-full bg-porcelain/70 p-1 ring-1 ring-espresso/5 md:flex">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              aria-current={isActive(link.href) ? "page" : undefined}
              className={cn(
                "rounded-full px-4 py-2 text-xs font-semibold uppercase tracking-[0.16em] transition-[background,color] duration-500 ease-[var(--ease-weighted)] hover:bg-pale-lilac hover:text-deep-lilac focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-deep-lilac/35",
                isActive(link.href)
                  ? "bg-pale-lilac text-[#6c5392]"
                  : "text-espresso/62",
              )}
            >
              {link.label}
            </Link>
          ))}
        </div>

        <Link
          href="/archive"
          className="hidden min-h-11 items-center rounded-full bg-deep-lilac px-4 text-xs font-semibold uppercase tracking-[0.16em] text-ivory shadow-[0px_2px_3px_-1px_rgba(0,0,0,0.1),0px_1px_0px_0px_rgba(25,28,33,0.02),0px_0px_0px_1px_rgba(25,28,33,0.08)] transition-[transform,background] duration-500 ease-[var(--ease-weighted)] hover:-translate-y-0.5 hover:bg-[#6c5392] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-deep-lilac/45 active:scale-[0.98] md:inline-flex"
        >
          Open Archive
        </Link>

        <button
          type="button"
          aria-expanded={isOpen}
          aria-controls="mobile-navigation"
          aria-label={isOpen ? "Close navigation menu" : "Open navigation menu"}
          onClick={() => setIsOpen((open) => !open)}
          className="inline-flex min-h-11 items-center gap-2 rounded-full border border-lilac-border/70 bg-pale-lilac/70 px-3 text-xs font-bold uppercase tracking-[0.16em] text-[#6c5392] transition-[transform,background] duration-500 ease-[var(--ease-weighted)] hover:-translate-y-0.5 hover:bg-pale-lilac focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-deep-lilac/35 active:scale-[0.98] md:hidden"
        >
          <span>Menu</span>
          <span className="relative size-4" aria-hidden="true">
            <span
              className={cn(
                "absolute left-0 top-1.5 h-px w-4 bg-current transition-transform duration-500 ease-[var(--ease-weighted)]",
                isOpen && "translate-y-1 rotate-45",
              )}
            />
            <span
              className={cn(
                "absolute bottom-1.5 left-0 h-px w-4 bg-current transition-transform duration-500 ease-[var(--ease-weighted)]",
                isOpen && "-translate-y-1 -rotate-45",
              )}
            />
          </span>
        </button>
      </nav>

      <div
        id="mobile-navigation"
        className={cn(
          "mx-auto mt-3 max-w-5xl overflow-hidden rounded-[1.75rem] border border-lilac-border/70 bg-ivory/92 p-2 shadow-[0px_0px_0px_1px_rgba(0,0,0,0.06),0px_1px_1px_-0.5px_rgba(0,0,0,0.06),0px_3px_3px_-1.5px_rgba(0,0,0,0.06),_0px_6px_6px_-3px_rgba(0,0,0,0.06),0px_12px_12px_-6px_rgba(0,0,0,0.06),0px_24px_24px_-12px_rgba(0,0,0,0.06)] backdrop-blur-xl transition-[opacity,transform] duration-500 ease-[var(--ease-weighted)] md:hidden",
          isOpen
            ? "pointer-events-auto translate-y-0 opacity-100"
            : "pointer-events-none -translate-y-2 opacity-0",
        )}
        hidden={!isOpen}
      >
        <div className="rounded-[calc(1.75rem-0.5rem)] bg-pale-lilac/58 p-3">
          <div className="grid gap-2">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setIsOpen(false)}
                aria-current={isActive(link.href) ? "page" : undefined}
                className={cn(
                  "flex min-h-12 items-center justify-between rounded-2xl px-4 text-sm font-bold text-espresso transition-[background,color,transform] duration-500 ease-[var(--ease-weighted)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-deep-lilac/35",
                  isActive(link.href)
                    ? "bg-porcelain text-[#6c5392] shadow-[0px_2px_3px_-1px_rgba(0,0,0,0.1),0px_1px_0px_0px_rgba(25,28,33,0.02),0px_0px_0px_1px_rgba(25,28,33,0.08)]"
                    : "hover:bg-porcelain/68",
                )}
              >
                <span>{link.label}</span>
                <span className="text-xs uppercase tracking-[0.2em] text-espresso/38">
                  {link.href === "/" ? "Home" : "Route"}
                </span>
              </Link>
            ))}
          </div>
          <Link
            href="/archive"
            onClick={() => setIsOpen(false)}
            className="mt-3 flex min-h-12 items-center justify-center rounded-2xl bg-deep-lilac px-4 text-sm font-bold text-ivory shadow-[0px_2px_3px_-1px_rgba(0,0,0,0.1),0px_1px_0px_0px_rgba(25,28,33,0.02),0px_0px_0px_1px_rgba(25,28,33,0.08)] transition-[transform,background] duration-500 ease-[var(--ease-weighted)] hover:-translate-y-0.5 hover:bg-[#6c5392] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-deep-lilac/35"
          >
            Open Archive
          </Link>
        </div>
      </div>
    </header>
  );
}
