"use client";

import { useMemo, useState } from "react";
import { CopyTextButton } from "@/components/admin/CopyTextButton";
import type { AdminContributor } from "@/lib/admin/queries";

type ReminderTone = "soft" | "family" | "friend" | "urgent";

type ReminderMessageGeneratorProps = {
  contributors: AdminContributor[];
  siteOrigin: string;
};

const toneLabels: Record<ReminderTone, string> = {
  soft: "Soft reminder",
  family: "Family respectful",
  friend: "Friend casual",
  urgent: "Urgent final call",
};

function isExpired(value: string | null) {
  return value ? new Date(value).getTime() < Date.now() : false;
}

function contributorLink(token: string, siteOrigin: string) {
  return new URL(`/contribute/${encodeURIComponent(token)}`, siteOrigin).toString();
}

function messageForTone(tone: ReminderTone, link: string) {
  if (tone === "family") {
    return `Hello, just a respectful reminder about Elizabeth's private birthday archive. Please use your private link to leave a short wish, memory, prayer, or photo before the deadline: ${link}\n\nWe are keeping it as a surprise for August 19, so please do not mention it to her yet. Thank you for helping make this special.`;
  }

  if (tone === "friend") {
    return `Hi, quick reminder about Elizabeth's birthday archive. Please use your private link to leave her a short wish, memory, prayer, photo, voice note, or video: ${link}\n\nIt does not have to be perfect. Just make it sound like you. Please keep the surprise quiet until August 19.`;
  }

  if (tone === "urgent") {
    return `Hi, final reminder for Elizabeth's birthday archive. Please send your wish, memory, prayer, or photo today using your private link: ${link}\n\nWe are preparing the surprise for August 19, so please keep it quiet. Thank you.`;
  }

  return `Hi, just a gentle reminder about Elizabeth's birthday archive. Please use your private link to leave a short wish, memory, prayer, or photo before the deadline: ${link}\n\nWe are keeping it as a surprise for August 19, so please do not mention it to her yet.`;
}

export function ReminderMessageGenerator({ contributors, siteOrigin }: ReminderMessageGeneratorProps) {
  const pendingContributors = contributors.filter(
    (contributor) => !contributor.is_used && !isExpired(contributor.expires_at) && contributor.submissionCount === 0,
  );
  const [tone, setTone] = useState<ReminderTone>("soft");
  const [token, setToken] = useState(pendingContributors[0]?.token ?? contributors[0]?.token ?? "");
  const selectedContributor = contributors.find((contributor) => contributor.token === token);
  const link = token ? contributorLink(token, siteOrigin) : new URL("/contribute/private-link", siteOrigin).toString();
  const message = useMemo(() => messageForTone(tone, link), [tone, link]);

  return (
    <div className="rounded-[1.75rem] bg-warm-black/[0.035] p-1.5 ring-1 ring-espresso/7 shadow-[var(--shadow-beautiful-md)]">
      <div className="rounded-[calc(1.75rem-0.375rem)] border border-porcelain/80 bg-porcelain/76 p-5 sm:p-6">
        <div className="grid gap-4 md:grid-cols-2">
          <label className="space-y-2">
            <span className="text-sm font-bold text-espresso">Tone</span>
            <select
              value={tone}
              onChange={(event) => setTone(event.currentTarget.value as ReminderTone)}
              className="min-h-12 w-full rounded-2xl border border-lilac-border/45 bg-ivory/70 px-4 text-sm font-semibold text-espresso outline-none focus:border-deep-lilac/45 focus:ring-4 focus:ring-lilac-primary/16"
            >
              {(Object.keys(toneLabels) as ReminderTone[]).map((key) => (
                <option key={key} value={key}>
                  {toneLabels[key]}
                </option>
              ))}
            </select>
          </label>

          <label className="space-y-2">
            <span className="text-sm font-bold text-espresso">Contributor link</span>
            <select
              value={token}
              onChange={(event) => setToken(event.currentTarget.value)}
              className="min-h-12 w-full rounded-2xl border border-lilac-border/45 bg-ivory/70 px-4 text-sm font-semibold text-espresso outline-none focus:border-deep-lilac/45 focus:ring-4 focus:ring-lilac-primary/16"
            >
              {contributors.length ? (
                contributors.map((contributor) => (
                  <option key={contributor.id} value={contributor.token}>
                    {contributor.name ?? "Unnamed"} - {contributor.submissionCount} submitted
                  </option>
                ))
              ) : (
                <option value="">No contributor links yet</option>
              )}
            </select>
          </label>
        </div>

        <div className="mt-5 rounded-2xl border border-lilac-border/55 bg-ivory/62 p-4">
          <p className="text-xs font-bold uppercase tracking-[0.18em] text-[#6c5392]">
            {selectedContributor?.name ?? "Reminder draft"}
          </p>
          <textarea
            readOnly
            value={message}
            className="mt-3 min-h-56 w-full resize-y rounded-2xl border border-transparent bg-transparent text-sm leading-7 text-espresso outline-none"
            aria-label="Generated reminder message"
          />
        </div>

        <div className="mt-5 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <p className="text-sm leading-7 text-espresso/58">
            {pendingContributors.length} contributor link{pendingContributors.length === 1 ? "" : "s"} appear unused and
            unexpired.
          </p>
          <CopyTextButton value={message} label="Copy Reminder" copiedLabel="Reminder Copied" />
        </div>
      </div>
    </div>
  );
}
