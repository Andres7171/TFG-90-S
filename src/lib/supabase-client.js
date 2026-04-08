import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://jmcfmlfnfsbnlbvcqksc.supabase.co'
const supabaseAnonKey = 'sb_publishable_q16BP1lVDIgYLSLgefubew_hSUPFp56'

export const supabase = createClient(supabaseUrl, supabaseAnonKey)