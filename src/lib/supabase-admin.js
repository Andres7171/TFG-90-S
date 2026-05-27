import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY

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
