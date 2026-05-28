import emailjs from '@emailjs/browser'

const SERVICE_ID = import.meta.env.VITE_EMAILJS_SERVICE_ID
const PUBLIC_KEY = import.meta.env.VITE_EMAILJS_PUBLIC_KEY
const RECEIPT_TEMPLATE_ID = import.meta.env.VITE_EMAILJS_RECEIPT_TEMPLATE_ID

// Enviar recibo por email vía EmailJS
export async function sendReceiptEmail(order, profile, userEmail) {
  const customerName = profile
    ? `${profile.name || ''}${profile.surname ? ' ' + profile.surname : ''}`.trim()
    : 'Cliente'

  const orderDate = new Date(order.created_at).toLocaleDateString('es-ES', {
    day: '2-digit', month: 'long', year: 'numeric', hour: '2-digit', minute: '2-digit'
  })

  const lines = (order.lines || []).map(l =>
    `${l.product_name_snapshot} (${l.variant_size_snapshot || '-'}) x${l.quantity} — ${(l.unit_price * l.quantity).toFixed(2)} €`
  ).join('\n')

  await emailjs.send(
    SERVICE_ID,
    RECEIPT_TEMPLATE_ID,
    {
      to_email: userEmail,
      customer_name: customerName,
      order_id: order.id.slice(0, 8).toUpperCase(),
      order_date: orderDate,
      order_lines: lines,
      order_total: Number(order.total).toFixed(2) + ' €',
      shipping_address: order.mailing_address
    },
    PUBLIC_KEY
  )
}