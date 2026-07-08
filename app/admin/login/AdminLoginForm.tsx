"use client";

import { useState, useTransition } from "react";
import type { FormEvent } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/Button";
import { FormField } from "@/components/forms/FormField";
import { createClient } from "@/lib/supabase/client";

type AdminLoginFormProps = {
  initialError?: string;
};

export function AdminLoginForm({ initialError }: AdminLoginFormProps) {
  const router = useRouter();
  const [error, setError] = useState(initialError ?? "");
  const [isPending, startTransition] = useTransition();

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");

    const formData = new FormData(event.currentTarget);
    const email = String(formData.get("email") ?? "").trim();
    const password = String(formData.get("password") ?? "");

    startTransition(async () => {
      try {
        const supabase = createClient();
        const { error: signInError } = await supabase.auth.signInWithPassword({
          email,
          password,
        });

        if (signInError) {
          setError(signInError.message);
          return;
        }

        router.replace("/admin");
        router.refresh();
      } catch {
        setError("Supabase is not configured yet. Add the environment variables before logging in.");
      }
    });
  }

  return (
    <form className="space-y-5" onSubmit={handleSubmit}>
      <FormField
        id="admin-email"
        name="email"
        label="Admin email"
        type="email"
        placeholder="admin@example.com"
        autoComplete="email"
        required
      />
      <FormField
        id="admin-password"
        name="password"
        label="Password"
        type="password"
        placeholder="Enter your admin password"
        autoComplete="current-password"
        required
      />
      {error ? (
        <p className="rounded-2xl border border-blush/55 bg-blush/16 px-4 py-3 text-sm leading-6 text-espresso/70">
          {error}
        </p>
      ) : null}
      <Button type="submit" size="lg" className="w-full sm:w-auto" disabled={isPending}>
        {isPending ? "Opening dashboard..." : "Open Admin Dashboard"}
      </Button>
    </form>
  );
}
