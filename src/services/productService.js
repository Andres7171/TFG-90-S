import { supabase } from '../lib/supabase-client'

export async function getActiveProducts() {
  const { data, error } = await supabase
    .from('product')
    .select('*')
    .eq('active', true)
    .order('creation_date', { ascending: false })

  if (error) throw error
  return data
}
