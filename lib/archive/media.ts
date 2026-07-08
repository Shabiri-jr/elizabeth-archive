import "server-only";

import { createServiceRoleClient } from "@/lib/supabase/server";

type ServiceClient = NonNullable<ReturnType<typeof createServiceRoleClient>>;

export async function createSignedArchiveMediaUrl(serviceClient: ServiceClient, bucket: string, storagePath: string) {
  const { data, error } = await serviceClient.storage.from(bucket).createSignedUrl(storagePath, 60 * 60);

  if (error) {
    return null;
  }

  return data.signedUrl;
}
