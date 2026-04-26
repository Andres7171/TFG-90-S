import { createContext, useCallback, useContext, useEffect, useState } from 'react'
import {
  getCartItems, addItemToCart, removeCartItem, updateCartItemQty, checkoutCart
} from '../services/cartService'
import { useAuth } from './AuthContext'

const CartContext = createContext({})

export function CartProvider({ children }) {
  const { user } = useAuth()
  const [items, setItems]       = useState([])
  const [loading, setLoading]   = useState(false)
  const [cartOpen, setCartOpen] = useState(false)

  const fetchCart = useCallback(async () => {
    if (!user) { setItems([]); return }
    setLoading(true)
    try {
      const data = await getCartItems(user.id)
      setItems(data)
    } catch {
      setItems([])
    } finally {
      setLoading(false)
    }
  }, [user])

  useEffect(() => { fetchCart() }, [fetchCart])

  const addItem = async (variantId) => {
    await addItemToCart(user.id, variantId)
    await fetchCart()
  }

  const removeItem = async (itemId) => {
    await removeCartItem(itemId)
    await fetchCart()
  }

  const updateQty = async (itemId, quantity) => {
    await updateCartItemQty(itemId, quantity)
    await fetchCart()
  }

  const checkout = async (shippingAddress) => {
    await checkoutCart(shippingAddress)
    await fetchCart()
  }

  const totalItems = items.reduce((sum, i) => sum + i.quantity, 0)
  const totalPrice = items.reduce(
    (sum, i) => sum + i.quantity * (i.variant?.product?.price ?? 0), 0
  )

  return (
    <CartContext.Provider value={{
      items, loading, cartOpen, setCartOpen,
      addItem, removeItem, updateQty, checkout,
      totalItems, totalPrice, fetchCart
    }}>
      {children}
    </CartContext.Provider>
  )
}

export const useCart = () => useContext(CartContext)
