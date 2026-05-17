import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://jmcfmlfnfsbnlbvcqksc.supabase.co'
const supabaseAnonKey = 'sb_publishable_q16BP1lVDIgYLSLgefubew_hSUPFp56'

if (!globalThis.__supabase_public__) {
  globalThis.__supabase_public__ = createClient(supabaseUrl, supabaseAnonKey, {
    auth: {
      persistSession: false,
      autoRefreshToken: false,
      detectSessionInUrl: false,
      storageKey: 'sb-public-anon',
    }
  })
}

export const supabasePublic = globalThis.__supabase_public__
