import { supabase } from '../lib/supabase-client'

export async function getCartItems(userId) {
  const { data: cart } = await supabase
    .from('cart')
    .select('id')
    .eq('user_id', userId)
    .maybeSingle()

  if (!cart) return []

  const { data, error } = await supabase
    .from('cart_item')
    .select(`
      id,
      quantity,
      variant:variant_id (
        id, size, stock,
        product:product_id (id, name, price, image_url)
      )
    `)
    .eq('cart_id', cart.id)

  if (error) throw error
  return data || []
}

export async function addItemToCart(userId, variantId) {
  let { data: cart } = await supabase
    .from('cart')
    .select('id')
    .eq('user_id', userId)
    .maybeSingle()

  if (!cart) {
    const { data: newCart, error: cartError } = await supabase
      .from('cart')
      .insert({ user_id: userId })
      .select('id')
      .single()
    if (cartError) throw cartError
    cart = newCart
  }

  const { data: existing } = await supabase
    .from('cart_item')
    .select('id, quantity')
    .eq('cart_id', cart.id)
    .eq('variant_id', variantId)
    .maybeSingle()

  if (existing) {
    const { error } = await supabase
      .from('cart_item')
      .update({ quantity: existing.quantity + 1 })
      .eq('id', existing.id)
    if (error) throw error
  } else {
    const { error } = await supabase
      .from('cart_item')
      .insert({ cart_id: cart.id, variant_id: variantId, quantity: 1 })
    if (error) throw error
  }
}

export async function removeCartItem(itemId) {
  const { error } = await supabase
    .from('cart_item')
    .delete()
    .eq('id', itemId)
  if (error) throw error
}

export async function updateCartItemQty(itemId, quantity) {
  if (quantity < 1) return removeCartItem(itemId)
  const { error } = await supabase
    .from('cart_item')
    .update({ quantity })
    .eq('id', itemId)
  if (error) throw error
}

export async function checkoutCart(shippingAddress) {
  const { data, error } = await supabase.rpc('checkout_cart', {
    shipping_address: shippingAddress
  })
  if (error) throw error
  return data
}
