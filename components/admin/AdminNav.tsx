"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  BookOpenText,
  Download,
  Images,
  LayoutDashboard,
  Link2,
  Music2,
  MessageCircleHeart,
  Rocket,
  Send,
  Settings2,
} from "lucide-react";
import { cn } from "@/lib/utils";

const adminNavItems = [
  { href: "/admin", label: "Overview", icon: LayoutDashboard },
  { href: "/admin/submissions", label: "Submissions", icon: MessageCircleHeart },
  { href: "/admin/media", label: "Media", icon: Images },
  { href: "/admin/gallery", label: "Gallery", icon: Images },
  { href: "/admin/music", label: "Music", icon: Music2 },
  { href: "/admin/contributors", label: "Contributors", icon: Link2 },
  { href: "/admin/chapters", label: "Chapters", icon: BookOpenText },
  { href: "/admin/open-when", label: "Open When", icon: BookOpenText },
  { href: "/admin/settings", label: "Settings", icon: Settings2 },
  { href: "/admin/launch", label: "Launch", icon: Rocket },
  { href: "/admin/export", label: "Export", icon: Download },
  { href: "/admin/reminders", label: "Reminders", icon: Send },
] as const;

export function AdminNav() {
  const pathname = usePathname();

  return (
    <nav aria-label="Admin sections" className="-mx-4 overflow-x-auto px-4 sm:mx-0 sm:px-0">
      <div className="flex min-w-max gap-2 rounded-full border border-lilac-border/65 bg-porcelain/62 p-1.5 shadow-[var(--shadow-beautiful-sm)]">
        {adminNavItems.map((item) => {
          const isActive = pathname === item.href;
          const Icon = item.icon;

          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "inline-flex min-h-10 items-center gap-2 rounded-full px-3.5 py-2 text-sm font-bold transition-[background,color,transform] duration-300 ease-[var(--ease-weighted)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-deep-lilac/45",
                isActive
                  ? "bg-deep-lilac text-ivory shadow-[var(--shadow-beautiful-sm)]"
                  : "text-espresso/64 hover:-translate-y-0.5 hover:bg-pale-lilac/70 hover:text-espresso",
              )}
            >
              <Icon aria-hidden="true" className="size-4" strokeWidth={1.5} />
              {item.label}
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
