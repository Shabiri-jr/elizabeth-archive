"use client";

import Image from "next/image";
import { Download, Printer } from "lucide-react";
import { CopyTextButton } from "@/components/admin/CopyTextButton";

type LaunchQrCardProps = {
  inviteUrl: string;
  qrSvg: string;
};

export function LaunchQrCard({ inviteUrl, qrSvg }: LaunchQrCardProps) {
  const svgDataUri = `data:image/svg+xml;charset=utf-8,${encodeURIComponent(qrSvg)}`;

  return (
    <div className="rounded-[2rem] bg-warm-black/[0.035] p-1.5 ring-1 ring-espresso/7 shadow-[var(--shadow-beautiful-lg)]">
      <div className="relative overflow-hidden rounded-[calc(2rem-0.375rem)] border border-porcelain/80 bg-porcelain/82 p-5 sm:p-7">
        <div
          aria-hidden="true"
          className="absolute -right-16 -top-16 size-44 rounded-full bg-lilac-primary/18 blur-3xl"
        />
        <div className="relative grid gap-6 lg:grid-cols-[0.82fr_1.18fr] lg:items-center">
          <div className="rounded-[1.5rem] bg-ivory p-4 shadow-[var(--shadow-beautiful-md)]">
            <Image
              src={svgDataUri}
              alt="QR code for Elizabeth's final invitation link"
              width={720}
              height={720}
              unoptimized
              className="mx-auto h-auto w-full max-w-72"
            />
          </div>
          <div>
            <p className="text-sm font-bold uppercase tracking-[0.18em] text-[#6c5392]">Elizabeth invite</p>
            <h2 className="mt-3 font-serif text-3xl font-semibold leading-tight text-espresso">
              Print this beside the physical gift.
            </h2>
            <p className="mt-4 rounded-2xl border border-lilac-border/55 bg-pale-lilac/28 p-4 font-serif text-2xl leading-tight text-espresso">
              Elizabeth, scan this when you are ready to open your birthday story.
            </p>
            <p className="mt-4 break-all text-sm leading-7 text-espresso/60">{inviteUrl}</p>
            <div className="mt-5 flex flex-col gap-3 sm:flex-row sm:flex-wrap">
              <CopyTextButton value={inviteUrl} label="Copy Elizabeth Link" />
              <a
                href={svgDataUri}
                download="elizabeth-birthday-story-qr.svg"
                className="inline-flex min-h-11 items-center gap-2 rounded-full bg-pale-lilac px-4 py-2 text-sm font-bold text-[#6c5392] shadow-[var(--shadow-beautiful-sm)] ring-1 ring-lilac-border/65 transition-[background,transform] duration-300 ease-[var(--ease-weighted)] hover:-translate-y-0.5 hover:bg-porcelain focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-deep-lilac/45"
              >
                <Download aria-hidden="true" className="size-4" />
                Download QR Code
              </a>
              <button
                type="button"
                onClick={() => window.print()}
                className="inline-flex min-h-11 items-center gap-2 rounded-full bg-deep-lilac px-4 py-2 text-sm font-bold text-ivory shadow-[var(--shadow-beautiful-sm)] transition-[background,transform] duration-300 ease-[var(--ease-weighted)] hover:-translate-y-0.5 hover:bg-[#6c5392] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-deep-lilac/45"
              >
                <Printer aria-hidden="true" className="size-4" />
                Print QR Card
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
