import "server-only";

import { createServiceRoleClient } from "@/lib/supabase/server";
import type { Json } from "@/lib/types";

type ServiceClient = NonNullable<ReturnType<typeof createServiceRoleClient>>;

type LogInput = {
  adminId: string;
  action: string;
  targetTable?: string | null;
  targetId?: string | null;
  metadata?: Json | null;
};

export async function logAdminActivity(serviceClient: ServiceClient, input: LogInput) {
  const { error } = await serviceClient.from("admin_activity_logs").insert({
    admin_id: input.adminId,
    action: input.action,
    target_table: input.targetTable ?? null,
    target_id: input.targetId ?? null,
    metadata: input.metadata ?? null,
  });

  return { ok: !error, error: error?.message ?? null };
}
