import { supabase } from '../lib/supabase-client'
import { supabaseAdmin } from '../lib/supabase-admin'

export async function getAllProducts() {
  const { data, error } = await supabaseAdmin
    .from('product')
    .select(`
      id, name, price, image_url, category, clothing_type, decade, active, description,
      brand:brand_id (id, name, type, active),
      variants:product_variant (id, size, stock)
    `)
    .order('created_at', { ascending: false })
  if (error) throw error
  return data
}

export async function getProductByIdAdmin(id) {
  const { data, error } = await supabaseAdmin
    .from('product')
    .select(`
      *,
      brand:brand_id (id, name, type, active),
      variants:product_variant (id, size, stock)
    `)
    .eq('id', id)
    .single()
  if (error) throw error
  return data
}

export async function updateProduct(id, fields) {
  const { error } = await supabase
    .from('product')
    .update(fields)
    .eq('id', id)
  if (error) throw error
}

export async function createProduct(fields, variants) {
  const { data, error } = await supabase
    .from('product')
    .insert(fields)
    .select('id')
    .single()
  if (error) throw error

  const validVariants = variants.filter((v) => v.size.trim())
  if (validVariants.length > 0) {
    const { error: varError } = await supabase
      .from('product_variant')
      .insert(validVariants.map((v) => ({
        product_id: data.id,
        size: v.size.trim(),
        stock: Number(v.stock) || 0,
      })))
    if (varError) throw varError
  }

  return data.id
}

export async function updateVariant(id, fields) {
  const { error } = await supabase
    .from('product_variant')
    .update(fields)
    .eq('id', id)
  if (error) throw error
}

export async function addVariant(productId, size, stock) {
  const { error } = await supabase
    .from('product_variant')
    .insert({ product_id: productId, size, stock: Number(stock) })
  if (error) throw error
}

export async function deleteVariant(id) {
  const { error } = await supabase
    .from('product_variant')
    .delete()
    .eq('id', id)
  if (error) throw error
}

export async function getAllCollaborators() {
  const { data, error } = await supabaseAdmin
    .from('brand')
    .select('*')
    .in('type', ['Freelancer', 'Empresa'])
    .order('name')
  if (error) throw error
  return data
}

export async function getCollaboratorByIdAdmin(id) {
  const { data, error } = await supabaseAdmin
    .from('brand')
    .select('*')
    .eq('id', id)
    .single()
  if (error) throw error
  return data
}

export async function getAllBrands() {
  const { data, error } = await supabaseAdmin
    .from('brand')
    .select('id, name, type')
    .order('name')
  if (error) throw error
  return data
}

export async function getAllBrandsAdmin() {
  const { data, error } = await supabaseAdmin
    .from('brand')
    .select('*')
    .order('name')
  if (error) throw error
  return data
}

export async function getAllOrders() {
  const { data, error } = await supabaseAdmin
    .from('order')
    .select(`
      id, status, total, mailing_address, created_at,
      user:user_id (id, name, surname),
      lines:order_line (id, quantity, unit_price, product_name_snapshot, variant_size_snapshot)
    `)
    .order('created_at', { ascending: false })
  if (error) throw error
  return data || []
}

export async function getOrderByIdAdmin(id) {
  const { data, error } = await supabaseAdmin
    .from('order')
    .select(`
      id, status, total, mailing_address, created_at,
      user:user_id (id, name, surname),
      lines:order_line (id, quantity, unit_price, product_name_snapshot, variant_size_snapshot)
    `)
    .eq('id', id)
    .single()
  if (error) throw error
  return data
}

export async function updateOrder(id, fields) {
  const { error } = await supabase
    .from('order')
    .update(fields)
    .eq('id', id)
  if (error) throw error
}

export async function deleteProduct(id) {
  const { error } = await supabase.from('product').delete().eq('id', id)
  if (error) throw error
}

export async function createCollaborator(fields) {
  const { data, error } = await supabase
    .from('brand')
    .insert(fields)
    .select('id')
    .single()
  if (error) throw error
  return data.id
}

export async function deleteBrand(id) {
  const { error } = await supabase.from('brand').delete().eq('id', id)
  if (error) throw error
}

export async function updateCollaborator(id, fields) {
  const { error } = await supabase
    .from('brand')
    .update(fields)
    .eq('id', id)
  if (error) throw error
}
