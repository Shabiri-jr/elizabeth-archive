import type { Metadata } from "next";
import { ReminderMessageGenerator } from "@/components/admin/ReminderMessageGenerator";
import { AdminShell } from "@/components/admin/AdminShell";
import { SectionShell } from "@/components/ui/SectionShell";
import { SoftCard } from "@/components/ui/SoftCard";
import { getContributors } from "@/lib/admin/queries";
import { getSiteOrigin } from "@/lib/launch";

export const metadata: Metadata = {
  title: "Reminders | Admin | A Story Called Elizabeth",
};

export const dynamic = "force-dynamic";

export default async function AdminRemindersPage() {
  const [contributors, siteOrigin] = await Promise.all([getContributors(), getSiteOrigin()]);

  return (
    <AdminShell
      eyebrow="Gentle follow-up"
      title="Reminder messages"
      description="Generate warm copy-paste reminders for people who have not submitted yet. This page does not send messages automatically."
    >
      <SectionShell className="pt-0">
        <div className="grid gap-6 lg:grid-cols-[0.78fr_1.22fr]">
          <SoftCard>
            <p className="text-sm font-bold uppercase tracking-[0.18em] text-[#6c5392]">Reminder etiquette</p>
            <h2 className="mt-3 font-serif text-3xl font-semibold text-espresso">Keep it light and private.</h2>
            <p className="mt-3 text-sm leading-7 text-espresso/58">
              The best reminders are clear, kind, and short. Ask for a wish, memory, prayer, photo, voice note, or
              video, and remind them not to mention the surprise to Elizabeth before August 19.
            </p>
          </SoftCard>
          <ReminderMessageGenerator contributors={contributors} siteOrigin={siteOrigin} />
        </div>
      </SectionShell>
    </AdminShell>
  );
}

