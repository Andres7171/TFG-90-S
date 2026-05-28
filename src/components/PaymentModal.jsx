import { useState, useEffect } from 'react'
import { supabase } from '../lib/supabase-client'
import { loadStripe } from '@stripe/stripe-js'
import { Elements } from '@stripe/react-stripe-js'
import { CheckoutForm } from './CheckoutForm'
import { X } from 'lucide-react'
import '../styles/Payment.css'

const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY)

export function PaymentModal({ orderId, total, onSuccess, onCancel }) {
  const [clientSecret, setClientSecret] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    createPaymentIntent()
  }, [orderId])

  const createPaymentIntent = async () => {
    setLoading(true)
    setError(null)

    try {
      const session = await supabase.auth.getSession()
      const token = session.data.session.access_token

      const response = await fetch(
        `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/create-payment-intent`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`,
            'apikey': import.meta.env.VITE_SUPABASE_ANON_KEY
          },
          body: JSON.stringify({ amount: total, orderId })
        }
      )

      const data = await response.json()
      if (data.error) throw new Error(data.error)

      setClientSecret(data.clientSecret)
    } catch (err) {
      setError(err.message || 'Error al iniciar el pago.')
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  const handlePaymentSuccess = async () => {
    try {
      const { error } = await supabase.rpc('confirm_order_payment', {
        p_order_id: orderId
      })
      if (error) throw error
      onSuccess?.(orderId)
    } catch (err) {
      console.error('Error al confirmar el pago:', err)
      setError('El pago se procesó pero no pudimos actualizar el estado. Contacta con soporte.')
    }
  }

  return (
    <div className="payment-overlay" onClick={onCancel}>
      <div className="payment-modal" onClick={e => e.stopPropagation()}>

        <div className="payment-modal-header">
          <h2 className="payment-modal-title">COMPLETAR PAGO</h2>
          <button className="payment-modal-close" onClick={onCancel}>
            <X size={18} />
          </button>
        </div>

        <div className="payment-modal-summary">
          <span className="payment-summary-label">Total a pagar</span>
          <span className="payment-summary-amount">{Number(total).toFixed(2)} €</span>
        </div>

        {loading && (
          <p className="payment-loading">Preparando pago...</p>
        )}

        {error && (
          <div className="payment-error-box">{error}</div>
        )}

        {!loading && !error && clientSecret && (
          <Elements
            stripe={stripePromise}
            options={{
              clientSecret,
              appearance: {
                theme: 'night',
                variables: {
                  colorPrimary: '#FFD700',
                  colorBackground: '#1a1a1a',
                  colorText: '#ffffff',
                  colorDanger: '#ff4d4d',
                  borderRadius: '0px',
                  fontFamily: 'system-ui, sans-serif'
                }
              }
            }}
          >
            <CheckoutForm
              onSuccess={handlePaymentSuccess}
              onCancel={onCancel}
            />
          </Elements>
        )}
      </div>
    </div>
  )
}