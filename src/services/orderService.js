import { supabase } from '../lib/supabase-client'

export async function getMyOrders(userId) {
  const { data, error } = await supabase
    .from('order')
    .select(`
      id, status, total, mailing_address, created_at,
      lines:order_line (
        id, quantity, unit_price, product_name_snapshot, variant_size_snapshot
      )
    `)
    .eq('user_id', userId)
    .order('created_at', { ascending: false })

  if (error) throw error
  return data || []
}
