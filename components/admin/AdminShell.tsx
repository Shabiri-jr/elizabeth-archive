import type { ReactNode } from "react";
import { AdminNav } from "@/components/admin/AdminNav";
import { PageIntro } from "@/components/ui/PageIntro";
import { SectionShell } from "@/components/ui/SectionShell";

type AdminShellProps = {
  eyebrow: string;
  title: string;
  description: string;
  actions?: ReactNode;
  children: ReactNode;
};

export function AdminShell({ eyebrow, title, description, actions, children }: AdminShellProps) {
  return (
    <>
      <SectionShell className="pb-6 pt-12 sm:pt-16">
        <div className="space-y-8">
          <div className="grid gap-6 lg:grid-cols-[1fr_auto] lg:items-end">
            <PageIntro eyebrow={eyebrow} title={title} description={description} />
            {actions ? <div className="lg:pb-2">{actions}</div> : null}
          </div>
          <AdminNav />
        </div>
      </SectionShell>
      {children}
    </>
  );
}
