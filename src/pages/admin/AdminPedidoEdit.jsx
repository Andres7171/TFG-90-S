import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { ChevronLeft } from 'lucide-react'
import { getOrderByIdAdmin, updateOrder } from '../../services/adminService'
import { AdminLayout } from './AdminLayout'
import { toast } from 'sonner'

const STATUSES = [
  { value: 'pending',   label: 'Pendiente' },
  { value: 'paid',      label: 'Pagado'    },
  { value: 'shipped',   label: 'Enviado'   },
  { value: 'delivered', label: 'Entregado' },
  { value: 'cancelled', label: 'Cancelado' },
]

const shortId    = (id)  => id.slice(-8).toUpperCase()
const formatDate = (iso) => new Date(iso).toLocaleDateString('es-ES', {
  day: '2-digit', month: '2-digit', year: 'numeric',
  hour: '2-digit', minute: '2-digit',
})

export function AdminPedidoEdit() {
  const { id } = useParams()
  const navigate = useNavigate()

  const [order,   setOrder]   = useState(null)
  const [loading, setLoading] = useState(true)
  const [saving,  setSaving]  = useState(false)
  const [error,   setError]   = useState(null)
  const [status,  setStatus]  = useState('')
  const [address, setAddress] = useState('')

  useEffect(() => {
    getOrderByIdAdmin(id)
      .then((data) => {
        setOrder(data)
        setStatus(data.status)
        setAddress(data.mailing_address)
      })
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false))
  }, [id])

  const handleSave = async () => {
    setSaving(true)
    setError(null)
    try {
      await updateOrder(id, { status, mailing_address: address })
      setOrder((prev) => ({ ...prev, status, mailing_address: address }))
      toast.success('Pedido actualizado correctamente')
    } catch (err) {
      setError(err.message)
    } finally {
      setSaving(false)
    }
  }

  if (loading)
    return <AdminLayout><p className="admin-loading">Cargando pedido...</p></AdminLayout>

  if (!order)
    return <AdminLayout><p className="admin-error">Pedido no encontrado.</p></AdminLayout>

  const clientName = order.user
    ? `${order.user.name} ${order.user.surname ?? ''}`.trim()
    : 'Usuario eliminado'

  return (
    <AdminLayout>
      <div className="admin-form-page">
        <button className="admin-back-btn" onClick={() => navigate(-1)}>
          <ChevronLeft size={15} /> Volver
        </button>

        <h2 className="admin-page-title" style={{ marginBottom: '0.3rem' }}>
          Pedido #{shortId(order.id)}
        </h2>
        <p style={{ color: '#666', fontSize: '0.8rem', marginBottom: '1.75rem' }}>
          {clientName} &middot; {formatDate(order.created_at)}
        </p>

        {error && <p className="admin-error" style={{ marginBottom: '1rem' }}>{error}</p>}

        <div className="admin-form-grid">

          <div className="admin-form-group">
            <label className="admin-label">Estado</label>
            <select
              className="admin-select"
              value={status}
              onChange={(e) => setStatus(e.target.value)}
            >
              {STATUSES.map((s) => (
                <option key={s.value} value={s.value}>{s.label}</option>
              ))}
            </select>
          </div>

          <div className="admin-form-group">
            <label className="admin-label">Total</label>
            <input
              className="admin-input"
              value={`${Number(order.total).toFixed(2)} €`}
              disabled
              style={{ opacity: 0.45, cursor: 'not-allowed' }}
            />
          </div>

          <div className="admin-form-group full-width">
            <label className="admin-label">Dirección de envío</label>
            <input
              className="admin-input"
              value={address}
              onChange={(e) => setAddress(e.target.value)}
            />
          </div>

        </div>

        <h3 className="admin-section-title">Líneas del pedido</h3>
        <table className="admin-variants-table">
          <thead>
            <tr>
              <th>Producto</th>
              <th>Talla</th>
              <th>Cantidad</th>
              <th>Precio ud.</th>
              <th>Subtotal</th>
            </tr>
          </thead>
          <tbody>
            {order.lines?.map((line) => (
              <tr key={line.id}>
                <td style={{ color: '#ccc',   fontSize: '0.85rem', padding: '0.5rem 0.75rem' }}>
                  {line.product_name_snapshot}
                </td>
                <td style={{ color: '#aaa',   fontSize: '0.82rem', padding: '0.5rem 0.75rem' }}>
                  {line.variant_size_snapshot ?? '—'}
                </td>
                <td style={{ color: '#aaa',   fontSize: '0.82rem', padding: '0.5rem 0.75rem' }}>
                  {line.quantity}
                </td>
                <td style={{ color: '#aaa',   fontSize: '0.82rem', padding: '0.5rem 0.75rem' }}>
                  {Number(line.unit_price).toFixed(2)} €
                </td>
                <td style={{ color: '#FFD700', fontSize: '0.82rem', padding: '0.5rem 0.75rem', fontWeight: 600 }}>
                  {(Number(line.unit_price) * line.quantity).toFixed(2)} €
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        <button className="admin-save-btn" onClick={handleSave} disabled={saving}>
          {saving ? 'GUARDANDO...' : 'GUARDAR CAMBIOS'}
        </button>
      </div>
    </AdminLayout>
  )
}
