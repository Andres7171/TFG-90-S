import { useState } from 'react'
import { PaymentElement, useStripe, useElements } from '@stripe/react-stripe-js'
import '../styles/Payment.css'

export function CheckoutForm({ onSuccess, onCancel }) {
  const stripe = useStripe()
  const elements = useElements()

  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!stripe || !elements) return

    setLoading(true)
    setError(null)

    const { error: stripeError, paymentIntent } = await stripe.confirmPayment({
      elements,
      redirect: 'if_required'
    })

    if (stripeError) {
      setError(stripeError.message)
      setLoading(false)
      return
    }

    if (paymentIntent?.status === 'succeeded') {
      onSuccess(paymentIntent)
    }

    setLoading(false)
  }

  return (
    <form onSubmit={handleSubmit} className="payment-form">
      <div className="payment-stripe-element">
        <PaymentElement />
      </div>

      {error && <p className="payment-error-text">{error}</p>}

      <div className="payment-actions">
        <button
          type="submit"
          className="payment-pay-btn"
          disabled={!stripe || loading}
        >
          {loading ? 'PROCESANDO...' : 'PAGAR AHORA'}
        </button>
        <button
          type="button"
          className="payment-cancel-btn"
          onClick={onCancel}
          disabled={loading}
        >
          CANCELAR
        </button>
      </div>

      <p className="payment-test-note">
        Modo test — usa la tarjeta <strong>4242 4242 4242 4242</strong>,
        cualquier fecha futura y cualquier CVC.
      </p>
    </form>
  )
}