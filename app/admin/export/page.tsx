import type { Metadata } from "next";
import { Archive, Download, ShieldCheck } from "lucide-react";
import { AdminShell } from "@/components/admin/AdminShell";
import { SectionShell } from "@/components/ui/SectionShell";
import { SoftCard } from "@/components/ui/SoftCard";
import { requireAdminProfile } from "@/lib/admin/permissions";

export const metadata: Metadata = {
  title: "Export | Admin | A Story Called Elizabeth",
};

export const dynamic = "force-dynamic";

const exports = [
  {
    href: "/api/admin/export?type=approved",
    title: "Export Approved Archive JSON",
    body: "Approved messages, approved media metadata, visible chapters, and archive settings.",
    icon: Archive,
  },
  {
    href: "/api/admin/export?type=all",
    title: "Export All Submissions JSON",
    body: "All submissions and media metadata for admin backup. Private tokens, admin notes, secrets, and auth data are excluded.",
    icon: Download,
  },
  {
    href: "/api/admin/export?type=launch",
    title: "Export Launch Backup",
    body: "A launch-day backup focused on approved archive content and visible chapter copy.",
    icon: ShieldCheck,
  },
];

export default async function AdminExportPage() {
  await requireAdminProfile();

  return (
    <AdminShell
      eyebrow="Preserve the gift"
      title="Export backup"
      description="Download safe JSON backups so Elizabeth's birthday story is not dependent on one browser session or one launch moment."
    >
      <SectionShell className="pt-0">
        <div className="grid gap-6 lg:grid-cols-3">
          {exports.map((item) => {
            const Icon = item.icon;

            return (
              <SoftCard key={item.href}>
                <span className="flex size-12 items-center justify-center rounded-full bg-pale-lilac text-[#6c5392]">
                  <Icon aria-hidden="true" className="size-6" strokeWidth={1.35} />
                </span>
                <h2 className="mt-5 font-serif text-3xl font-semibold leading-tight text-espresso">{item.title}</h2>
                <p className="mt-3 text-sm leading-7 text-espresso/58">{item.body}</p>
                <a
                  href={item.href}
                  className="mt-6 inline-flex min-h-11 items-center rounded-full bg-deep-lilac px-5 text-sm font-bold text-ivory shadow-[var(--shadow-beautiful-sm)] transition-[background,transform] duration-300 ease-[var(--ease-weighted)] hover:-translate-y-0.5 hover:bg-[#6c5392] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-deep-lilac/45"
                >
                  Download JSON
                </a>
              </SoftCard>
            );
          })}
        </div>

        <SoftCard className="mt-8">
          <p className="text-sm font-bold uppercase tracking-[0.18em] text-[#6c5392]">Export safety</p>
          <p className="mt-3 max-w-3xl text-sm leading-7 text-espresso/58">
            These exports are admin-only and exclude contributor private tokens, admin notes, environment secrets, and
            Supabase Auth data. Store the files somewhere private.
          </p>
        </SoftCard>
      </SectionShell>
    </AdminShell>
  );
}

