import { supabasePublic as supabase } from '../lib/supabase-public'

export async function getActiveProducts() {
  const { data, error } = await supabase
    .from('product')
    .select(`
      id, name, price, image_url, category, clothing_type, decade,
      brand:brand_id (id, name, web_url, type, active),
      variants:product_variant (id, size, stock)
    `)
    .eq('active', true)
    .order('created_at', { ascending: false })

  if (error) throw error
  return data.filter((p) => p.brand?.active === true)
}

export async function getProductById(id) {
  const { data, error } = await supabase
    .from('product')
    .select(`
      *,
      brand:brand_id (id, name, web_url, image_url, type),
      variants:product_variant (id, size, stock)
    `)
    .eq('id', id)
    .single()

  if (error) throw error
  return data
}
