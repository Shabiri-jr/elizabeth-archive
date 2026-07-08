import { createBrowserClient } from "@supabase/ssr";
import type { SupabaseClient } from "@supabase/supabase-js";
import type { Database } from "@/lib/types";
import { getSupabasePublicConfig, isSupabaseConfigured } from "@/lib/supabase/config";

let browserClient: SupabaseClient<Database> | null = null;

export { isSupabaseConfigured };

export function createClient() {
  const config = getSupabasePublicConfig();

  if (!config) {
    throw new Error("Supabase public environment variables are not configured.");
  }

  browserClient ??= createBrowserClient<Database>(config.url, config.anonKey);
  return browserClient;
}
