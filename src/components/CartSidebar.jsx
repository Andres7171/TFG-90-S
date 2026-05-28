import { useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { X } from 'lucide-react'
import { useCart } from '../context/CartContext'
import { useAuth } from '../context/AuthContext'
import { PaymentModal } from './PaymentModal'
import '../styles/Cart.css'

export function CartSidebar() {
  const { items, cartOpen, setCartOpen, removeItem, updateQty, checkout, totalPrice } = useCart()
  const { profile } = useAuth()
  const [address, setAddress]       = useState('')
  const [checkingOut, setCheckingOut] = useState(false)
  const [showAddress, setShowAddress] = useState(false)
  const [success, setSuccess]       = useState(false)
  const [error, setError]           = useState(null)

  // Stripe payment modal
  const [paymentData, setPaymentData] = useState(null)

  const handleCheckout = async () => {
    if (!showAddress) {
      if (!address && profile?.address) setAddress(profile.address)
      setShowAddress(true)
      return
    }
    if (!address.trim()) { setError('Introduce una dirección de envío'); return }
    setCheckingOut(true)
    setError(null)
    try {
      const orderId = await checkout(address.trim())
      setPaymentData({ orderId, total: totalPrice })
      setShowAddress(false)
    } catch (err) {
      setError(err.message)
    } finally {
      setCheckingOut(false)
    }
  }

  const handlePaymentSuccess = () => {
    setPaymentData(null)
    setSuccess(true)
    setAddress('')
  }

  const handlePaymentCancel = () => {
    setPaymentData(null)
    setError('Pago cancelado. El pedido se ha creado pero no se ha pagado.')
  }

  const handleClose = () => {
    setCartOpen(false)
    setShowAddress(false)
    setAddress('')
    setError(null)
    setPaymentData(null)
    if (success) setSuccess(false)
  }

  return (
    <>
      {paymentData && (
        <PaymentModal
          orderId={paymentData.orderId}
          total={paymentData.total}
          onSuccess={handlePaymentSuccess}
          onCancel={handlePaymentCancel}
        />
      )}

      <AnimatePresence>
        {cartOpen && (
          <>
            <motion.div
              className="cart-overlay"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={handleClose}
            />
            <motion.div
              className="cart-sidebar"
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'tween', duration: 0.28 }}
            >
              <div className="cart-header">
                <h2 className="cart-title">CARRITO</h2>
                <button className="cart-close-btn" onClick={handleClose}>
                  <X size={22} />
                </button>
              </div>

              {success ? (
                <div className="cart-success">
                  <p className="cart-success-text">¡Pedido realizado y pagado con éxito!</p>
                  <button className="cart-checkout-btn" onClick={handleClose}>
                    CERRAR
                  </button>
                </div>
              ) : (
                <>
                  <div className="cart-items-list">
                    {items.length === 0 ? (
                      <p className="cart-empty">Tu carrito está vacío.</p>
                    ) : (
                      items.map((item) => {
                        const product = item.variant?.product
                        return (
                          <div key={item.id} className="cart-item">
                            <img
                              src={product?.image_url || 'https://placehold.co/72x90/1a1a1a/FFD700?text=RW'}
                              alt={product?.name}
                              className="cart-item-img"
                              onError={(e) => { e.target.src = 'https://placehold.co/72x90/1a1a1a/FFD700?text=RW' }}
                            />
                            <div className="cart-item-info">
                              <p className="cart-item-name">{product?.name}</p>
                              <p className="cart-item-size">Talla: {item.variant?.size}</p>
                              <p className="cart-item-price">{product?.price} €</p>
                              <div className="cart-qty-controls">
                                <button className="cart-qty-btn" onClick={() => updateQty(item.id, item.quantity - 1)}>−</button>
                                <span className="cart-qty-num">{item.quantity}</span>
                                <button className="cart-qty-btn" onClick={() => updateQty(item.id, item.quantity + 1)}>+</button>
                              </div>
                              <button className="cart-remove-btn" onClick={() => removeItem(item.id)}>
                                Eliminar
                              </button>
                            </div>
                          </div>
                        )
                      })
                    )}
                  </div>

                  {items.length > 0 && (
                    <div className="cart-footer">
                      <div className="cart-total">
                        <span>Total</span>
                        <span className="cart-total-price">{totalPrice.toFixed(2)} €</span>
                      </div>
                      {showAddress && (
                        <input
                          className="cart-address-input"
                          placeholder="Dirección de envío completa"
                          value={address}
                          onChange={(e) => setAddress(e.target.value)}
                        />
                      )}
                      {error && <p style={{ color: '#e74c3c', fontSize: '0.8rem', marginBottom: '0.5rem' }}>{error}</p>}
                      <button
                        className="cart-checkout-btn"
                        onClick={handleCheckout}
                        disabled={checkingOut}
                      >
                        {checkingOut ? 'PROCESANDO...' : showAddress ? 'PROCEDER AL PAGO' : 'FINALIZAR COMPRA'}
                      </button>
                    </div>
                  )}
                </>
              )}
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  )
}