import type { Metadata } from "next";
import { Rocket } from "lucide-react";
import { AdminShell } from "@/components/admin/AdminShell";
import { LaunchChecklist, type LaunchChecklistItem } from "@/components/admin/LaunchChecklist";
import { LaunchQrCard } from "@/components/admin/LaunchQrCard";
import { StatusBadge } from "@/components/admin/StatusBadge";
import { Button } from "@/components/ui/Button";
import { SectionShell } from "@/components/ui/SectionShell";
import { SoftCard } from "@/components/ui/SoftCard";
import { getLaunchDashboardData } from "@/lib/admin/launch";
import { createInviteQrSvg, getElizabethInviteUrl } from "@/lib/launch";

export const metadata: Metadata = {
  title: "Launch | Admin | A Story Called Elizabeth",
};

export const dynamic = "force-dynamic";

export default async function AdminLaunchPage() {
  const [launchData, inviteUrl] = await Promise.all([getLaunchDashboardData(), getElizabethInviteUrl()]);
  const qrSvg = await createInviteQrSvg(inviteUrl);
  const settings = launchData.settings;

  const checklistItems: LaunchChecklistItem[] = [
    {
      id: "supabase-production",
      label: "Supabase production environment connected",
      hint: launchData.status === "connected" ? "Live admin data loaded from Supabase." : "Service role data is not available yet.",
      checkedByDefault: launchData.status === "connected",
    },
    { id: "admin-tested", label: "Admin account tested", hint: "You are viewing this page through the admin route." },
    { id: "access-code", label: "Elizabeth access code set", hint: "Confirm the production env value before launch." },
    {
      id: "archive-live",
      label: "Archive live enabled",
      hint: "Turn this on only after previewing the final archive.",
      checkedByDefault: Boolean(settings?.archive_live),
    },
    {
      id: "elizabeth-access",
      label: "Elizabeth access enabled",
      hint: "Allows the private access-code session to open the archive.",
      checkedByDefault: Boolean(settings?.elizabeth_access_enabled),
    },
    {
      id: "contributions-closed",
      label: "Contributions closed if ready",
      hint: "Close contributions when you are done collecting wishes.",
      checkedByDefault: settings ? !settings.contributions_open : false,
    },
    {
      id: "pending-submissions-reviewed",
      label: "All pending submissions reviewed",
      hint: `${launchData.pendingSubmissions} pending submission${launchData.pendingSubmissions === 1 ? "" : "s"} remain.`,
      checkedByDefault: launchData.pendingSubmissions === 0,
    },
    {
      id: "pending-media-reviewed",
      label: "All pending media reviewed",
      hint: `${launchData.pendingMedia} pending media file${launchData.pendingMedia === 1 ? "" : "s"} remain.`,
      checkedByDefault: launchData.pendingMedia === 0,
    },
    { id: "final-letter-edited", label: "Final letter edited", hint: "Check the From Me chapter before reveal." },
    { id: "mobile-preview", label: "Archive preview checked on mobile", hint: "Use the admin preview before sending the link." },
    { id: "invite-link-copied", label: "Invite link copied", hint: "Send Elizabeth the /for-elizabeth link, not the raw archive route." },
    { id: "qr-tested", label: "QR code tested", hint: "Scan the QR code with your phone before printing." },
    { id: "backup-exported", label: "Backup/export completed", hint: "Save a launch backup JSON before August 19." },
  ];

  return (
    <AdminShell
      eyebrow="Birthday delivery"
      title="Launch"
      description="Prepare the final private link, QR card, and last safety checks before Elizabeth opens her birthday story."
    >
      <SectionShell className="pt-0">
        <div className="grid gap-6 lg:grid-cols-[0.95fr_1.05fr]">
          <div className="space-y-6">
            <SoftCard>
              <div className="flex items-start gap-4">
                <span className="flex size-12 shrink-0 items-center justify-center rounded-full bg-pale-lilac text-[#6c5392]">
                  <Rocket aria-hidden="true" className="size-6" strokeWidth={1.35} />
                </span>
                <div>
                  <p className="text-sm font-bold uppercase tracking-[0.18em] text-[#6c5392]">Final delivery room</p>
                  <h2 className="mt-3 font-serif text-3xl font-semibold text-espresso">Send the invitation, not the archive.</h2>
                  <p className="mt-3 text-sm leading-7 text-espresso/58">
                    Elizabeth should receive the calm invite page first, then enter her private access code from there.
                  </p>
                  <div className="mt-5 flex flex-wrap gap-2">
                    <StatusBadge status={settings?.archive_live ? "live" : "locked"} label={settings?.archive_live ? "Archive live" : "Archive locked"} />
                    <StatusBadge
                      status={settings?.elizabeth_access_enabled ? "open" : "closed"}
                      label={settings?.elizabeth_access_enabled ? "Elizabeth access on" : "Elizabeth access off"}
                    />
                    <StatusBadge
                      status={settings?.contributions_open ? "open" : "closed"}
                      label={settings?.contributions_open ? "Contributions open" : "Contributions closed"}
                    />
                  </div>
                  <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:flex-wrap">
                    <Button href="/archive/preview" variant="secondary">
                      Preview Archive
                    </Button>
                    <Button href="/admin/export" variant="ghost">
                      Export Backup
                    </Button>
                  </div>
                </div>
              </div>
            </SoftCard>
            <LaunchChecklist items={checklistItems} />
          </div>
          <LaunchQrCard inviteUrl={inviteUrl} qrSvg={qrSvg} />
        </div>
      </SectionShell>
    </AdminShell>
  );
}

