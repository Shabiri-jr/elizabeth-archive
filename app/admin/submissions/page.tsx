import type { Metadata } from "next";
import { AdminShell } from "@/components/admin/AdminShell";
import { SubmissionTable } from "@/components/admin/SubmissionTable";
import { SectionShell } from "@/components/ui/SectionShell";
import { SoftCard } from "@/components/ui/SoftCard";
import { getSubmissions } from "@/lib/admin/queries";
import type { SubmissionStatus } from "@/lib/types";

type SubmissionsPageProps = {
  searchParams?: Promise<{
    status?: string;
    search?: string;
    sort?: string;
  }>;
};

export const metadata: Metadata = {
  title: "Submissions | Admin | A Story Called Elizabeth",
};

export const dynamic = "force-dynamic";

function parseStatus(value?: string): SubmissionStatus | "all" {
  return value === "pending" || value === "approved" || value === "rejected" ? value : "all";
}

function parseSort(value?: string): "newest" | "oldest" {
  return value === "oldest" ? "oldest" : "newest";
}

export default async function AdminSubmissionsPage({ searchParams }: SubmissionsPageProps) {
  const params = searchParams ? await searchParams : {};
  const filters = {
    status: parseStatus(params.status),
    search: params.search?.trim() ?? "",
    sort: parseSort(params.sort),
  };
  const submissions = await getSubmissions(filters);

  return (
    <AdminShell
      eyebrow="Moderation queue"
      title="Submissions"
      description="Read each message with care, add private notes, and decide what should later become part of Elizabeth's birthday archive."
    >
      <SectionShell className="pt-0">
        <div className="space-y-6">
          <SoftCard>
            <p className="text-sm font-bold uppercase tracking-[0.18em] text-deep-lilac/72">Moderation note</p>
            <p className="mt-3 max-w-3xl text-sm leading-7 text-espresso/58">
              Only approved messages appear in Elizabeth&apos;s archive. Rejected messages stay out of the final story,
              and private admin notes are never shown to Elizabeth.
            </p>
          </SoftCard>
          <SubmissionTable submissions={submissions} filters={filters} />
        </div>
      </SectionShell>
    </AdminShell>
  );
}
