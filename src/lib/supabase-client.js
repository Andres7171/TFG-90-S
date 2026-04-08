import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'TU_URL_DE_SUPABASE'
const supabaseAnonKey = 'TU_LLAVE_ANONIMA'

export const supabase = createClient(supabaseUrl, supabaseAnonKey)