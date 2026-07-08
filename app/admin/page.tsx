import type { Metadata } from "next";
import {
  BookOpenText,
  CheckCircle2,
  Hourglass,
  Images,
  Link2,
  MessageCircleHeart,
  Settings2,
  UsersRound,
  XCircle,
} from "lucide-react";
import { ActivityLogList } from "@/components/admin/ActivityLogList";
import { AdminShell } from "@/components/admin/AdminShell";
import { AdminStatCard } from "@/components/admin/AdminStatCard";
import { StatusBadge } from "@/components/admin/StatusBadge";
import { Button } from "@/components/ui/Button";
import { SectionShell } from "@/components/ui/SectionShell";
import { SoftCard } from "@/components/ui/SoftCard";
import { getAdminOverview } from "@/lib/admin/queries";

export const metadata: Metadata = {
  title: "Admin Dashboard | A Story Called Elizabeth",
};

export const dynamic = "force-dynamic";

export default async function AdminPage() {
  const overview = await getAdminOverview();
  const stats = overview.stats;

  const statCards = [
    {
      title: "Total submissions",
      value: stats.totalSubmissions,
      description: "All birthday wishes received through private contributor links.",
      icon: MessageCircleHeart,
    },
    {
      title: "Pending submissions",
      value: stats.pendingSubmissions,
      description: "Messages waiting for review before they can join Elizabeth's archive.",
      icon: Hourglass,
    },
    {
      title: "Approved submissions",
      value: stats.approvedSubmissions,
      description: "Written keepsakes approved for later archive rendering.",
      icon: CheckCircle2,
    },
    {
      title: "Rejected submissions",
      value: stats.rejectedSubmissions,
      description: "Messages held back from the final story.",
      icon: XCircle,
    },
    {
      title: "Total media files",
      value: stats.totalMediaFiles,
      description: "Photos, voice notes, and videos submitted with messages.",
      icon: Images,
    },
    {
      title: "Pending media",
      value: stats.pendingMediaFiles,
      description: "Uploaded keepsakes still waiting for admin review.",
      icon: Images,
    },
    {
      title: "Contributor links",
      value: stats.totalContributorLinks,
      description: "Private invitation tokens created for contributors.",
      icon: Link2,
    },
    {
      title: "Used links",
      value: stats.usedContributorLinks,
      description: "Invite links that have reached their submission limit.",
      icon: UsersRound,
    },
    {
      title: "Archive status",
      value: stats.archiveLive,
      description: "Whether the archive is live when access rules allow it.",
      icon: BookOpenText,
    },
    {
      title: "Contributions",
      value: stats.contributionsOpen,
      description: "Whether private contributor submissions are currently open.",
      icon: Settings2,
    },
  ];

  return (
    <AdminShell
      eyebrow="Archive control room"
      title="Admin Dashboard"
      description="Review the state of Elizabeth's birthday archive, then move into the moderation rooms for messages, media, contributor links, chapters, and reveal settings."
    >
      <SectionShell className="pt-0">
        <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-5">
          {statCards.map((card) => (
            <AdminStatCard key={card.title} {...card} />
          ))}
        </div>

        <div className="mt-8 grid gap-6 lg:grid-cols-[1fr_0.92fr]">
          <SoftCard>
            <div className="flex flex-col gap-5 sm:flex-row sm:items-start sm:justify-between">
              <div>
                <div className="flex flex-wrap gap-2">
                  <StatusBadge status={overview.settings?.archive_live ? "live" : "locked"} label={stats.archiveLive} />
                  <StatusBadge
                    status={overview.settings?.contributions_open ? "open" : "closed"}
                    label={stats.contributionsOpen}
                  />
                </div>
                <h2 className="mt-5 font-serif text-3xl font-semibold text-espresso">
                  {overview.status === "connected" ? "Moderation is ready." : "Admin data is safely hidden."}
                </h2>
                <p className="mt-3 max-w-2xl text-sm leading-7 text-espresso/58">{overview.message}</p>
              </div>
              <Button href="/admin/submissions" size="lg">
                Review Submissions
              </Button>
            </div>
          </SoftCard>

          <SoftCard>
            <p className="text-sm font-bold uppercase tracking-[0.18em] text-deep-lilac/72">Next admin steps</p>
            <p className="mt-3 text-sm leading-7 text-espresso/58">
              Preview the archive before enabling Elizabeth access. Only approved messages and approved media appear in
              her final story.
            </p>
            <div className="mt-5 grid gap-3 sm:grid-cols-2">
              <Button href="/admin/media" variant="secondary" showArrow={false}>
                Media
              </Button>
              <Button href="/admin/gallery" variant="secondary" showArrow={false}>
                Gallery
              </Button>
              <Button href="/admin/music" variant="secondary" showArrow={false}>
                Music
              </Button>
              <Button href="/admin/contributors" variant="secondary" showArrow={false}>
                Contributors
              </Button>
              <Button href="/admin/chapters" variant="secondary" showArrow={false}>
                Chapters
              </Button>
              <Button href="/admin/open-when" variant="secondary" showArrow={false}>
                Open When
              </Button>
              <Button href="/admin/settings" variant="secondary" showArrow={false}>
                Settings
              </Button>
              <Button href="/archive/from-me" variant="secondary" showArrow={false}>
                From Me Room
              </Button>
              <Button href="/archive/preview" variant="secondary" showArrow={false}>
                Preview Archive
              </Button>
              <Button href="/admin/launch" variant="secondary" showArrow={false}>
                Launch Pack
              </Button>
              <Button href="/admin/export" variant="secondary" showArrow={false}>
                Export Backup
              </Button>
            </div>
          </SoftCard>
        </div>

        <div className="mt-8">
          <ActivityLogList logs={overview.recentActivity} />
        </div>
      </SectionShell>
    </AdminShell>
  );
}
