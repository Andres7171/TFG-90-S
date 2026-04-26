import { supabase } from '../lib/supabase-client'

export async function getActiveProducts() {
  const { data, error } = await supabase
    .from('product')
    .select(`
      id, name, price, image_url, category, clothing_type, decade,
      brand:brand_id (id, name, web_url),
      variants:product_variant (id, size, stock)
    `)
    .eq('active', true)
    .order('created_at', { ascending: false })

  if (error) throw error
  return data
}

export async function getProductById(id) {
  const { data, error } = await supabase
    .from('product')
    .select(`
      *,
      brand:brand_id (id, name, web_url, image_url),
      variants:product_variant (id, size, stock)
    `)
    .eq('id', id)
    .single()

  if (error) throw error
  return data
}
