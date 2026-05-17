import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://jmcfmlfnfsbnlbvcqksc.supabase.co'
const supabaseAnonKey = 'sb_publishable_q16BP1lVDIgYLSLgefubew_hSUPFp56'

if (!globalThis.__supabase_admin__) {
  globalThis.__supabase_admin__ = createClient(supabaseUrl, supabaseAnonKey, {
    auth: {
      persistSession: true,
      autoRefreshToken: false,
      detectSessionInUrl: false,
      storageKey: 'sb-admin-session',
      lock: async (_name, _timeout, fn) => fn(),
    }
  })
}

export const supabaseAdmin = globalThis.__supabase_admin__
