import type { SupabaseClient } from '@supabase/supabase-js'

/**
 * Resolve the signed-in user's tenant via the `memberships` table.
 * Returns null when there is no session or no membership (RLS makes other
 * tenants' rows invisible anyway; the tenant_id is used when writing).
 */
export async function resolveTenantId(client: SupabaseClient): Promise<string | null> {
  const { data: userData } = await client.auth.getUser()
  const user = userData.user
  if (!user) return null

  const { data, error } = await client
    .from('memberships')
    .select('tenant_id')
    .eq('user_id', user.id)
    .limit(1)
    .maybeSingle()

  if (error || !data) return null
  return (data as { tenant_id: string }).tenant_id
}
