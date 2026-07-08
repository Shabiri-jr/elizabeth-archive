import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { AdminLoginForm } from "@/app/admin/login/AdminLoginForm";
import { PageIntro } from "@/components/ui/PageIntro";
import { SectionShell } from "@/components/ui/SectionShell";
import { SoftCard } from "@/components/ui/SoftCard";
import { getAdminAccess } from "@/lib/auth";

type AdminLoginPageProps = {
  searchParams?: Promise<{
    error?: string;
  }>;
};

export const metadata: Metadata = {
  title: "Admin Login | A Story Called Elizabeth",
};

export const dynamic = "force-dynamic";

export default async function AdminLoginPage({ searchParams }: AdminLoginPageProps) {
  const access = await getAdminAccess();

  if (access.status === "admin") {
    redirect("/admin");
  }

  const resolvedSearchParams = searchParams ? await searchParams : {};
  const initialError =
    resolvedSearchParams.error === "unauthorized"
      ? "This account is signed in, but it is not marked as an admin profile."
      : undefined;

  return (
    <SectionShell className="pt-16 sm:pt-24" narrow>
      <div className="grid gap-8 lg:grid-cols-[0.95fr_1.05fr] lg:items-center">
        <PageIntro
          eyebrow="Protected admin access"
          title="Enter the control room."
          description="Admin access is protected with Supabase Auth and a profile role check before the dashboard can load live counts."
        />

        <SoftCard className="motion-reveal [animation-delay:140ms]" innerClassName="relative overflow-hidden p-6 sm:p-8">
          <div
            aria-hidden="true"
            className="absolute -right-14 -top-16 size-40 rounded-full bg-lilac-primary/18 blur-3xl"
          />
          <div className="relative space-y-7">
            <div>
              <h2 className="font-serif text-3xl font-semibold text-espresso">Admin login</h2>
              <p className="mt-3 text-sm leading-7 text-espresso/60">
                Sign in with the admin account created in Supabase, then make sure the matching profile row has role
                admin.
              </p>
            </div>
            {access.status === "unconfigured" ? (
              <p className="rounded-2xl border border-lilac-border/70 bg-pale-lilac/46 px-4 py-3 text-sm leading-6 text-espresso/66">
                Supabase environment variables are missing, so this login form is waiting for configuration.
              </p>
            ) : null}
            <AdminLoginForm initialError={initialError} />
          </div>
        </SoftCard>
      </div>
    </SectionShell>
  );
}
