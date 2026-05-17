import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://jmcfmlfnfsbnlbvcqksc.supabase.co'
const supabaseAnonKey = 'sb_publishable_q16BP1lVDIgYLSLgefubew_hSUPFp56'

if (!globalThis.__supabase_client__) {
  globalThis.__supabase_client__ = createClient(supabaseUrl, supabaseAnonKey, {
    auth: {
      lock: async (_name, _timeout, fn) => fn()
    }
  })
}

export const supabase = globalThis.__supabase_client__