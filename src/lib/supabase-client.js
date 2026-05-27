import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY

if (!globalThis.__supabase_client__) {
  globalThis.__supabase_client__ = createClient(supabaseUrl, supabaseAnonKey, {
    auth: {
      lock: async (_name, _timeout, fn) => fn()
    }
  })
}

export const supabase = globalThis.__supabase_client__