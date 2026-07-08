"use client";

import { useActionState } from "react";
import { Button } from "@/components/ui/Button";
import { FormField } from "@/components/forms/FormField";
import { requestElizabethAccess, type ElizabethAccessState } from "@/app/elizabeth/login/actions";

const initialState: ElizabethAccessState = {
  status: "idle",
  message: "",
};

export function ElizabethAccessForm() {
  const [state, formAction, isPending] = useActionState(requestElizabethAccess, initialState);

  return (
    <form action={formAction} className="space-y-5">
      <FormField
        id="access-code"
        name="accessCode"
        label="Password/access code"
        placeholder="Enter your private code"
        type="password"
        autoComplete="current-password"
        required
      />
      {state.status === "error" ? (
        <p className="rounded-2xl border border-blush/55 bg-blush/16 px-4 py-3 text-sm leading-6 text-espresso/70">
          {state.message}
        </p>
      ) : null}
      <Button type="submit" size="lg" className="w-full sm:w-auto" disabled={isPending}>
        {isPending ? "Opening..." : "Open My Birthday Archive"}
      </Button>
    </form>
  );
}
