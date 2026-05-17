import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { getAllOrders } from '../../services/adminService'
import { AdminLayout } from './AdminLayout'

const STATUSES = [
  { value: '',          label: 'Todos'     },
  { value: 'pending',   label: 'Pendiente' },
  { value: 'paid',      label: 'Pagado'    },
  { value: 'shipped',   label: 'Enviado'   },
  { value: 'delivered', label: 'Entregado' },
  { value: 'cancelled', label: 'Cancelado' },
]

const STATUS_LABEL = {
  pending:   'Pendiente',
  paid:      'Pagado',
  shipped:   'Enviado',
  delivered: 'Entregado',
  cancelled: 'Cancelado',
}

const shortId   = (id)  => id.slice(-8).toUpperCase()
const formatDate = (iso) => new Date(iso).toLocaleDateString('es-ES', {
  day: '2-digit', month: '2-digit', year: 'numeric',
})

export function AdminPedidos() {
  const [orders, setOrders]           = useState([])
  const [search, setSearch]           = useState('')
  const [statusFilter, setStatusFilter] = useState('')
  const [loading, setLoading]         = useState(true)
  const [error, setError]             = useState(null)
  const navigate = useNavigate()

  useEffect(() => {
    getAllOrders()
      .then(setOrders)
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false))
  }, [])

  const filtered = orders.filter((o) => {
    const fullName = `${o.user?.name ?? ''} ${o.user?.surname ?? ''}`.toLowerCase()
    const matchSearch = !search ||
      fullName.includes(search.toLowerCase()) ||
      o.id.toLowerCase().includes(search.toLowerCase())
    const matchStatus = !statusFilter || o.status === statusFilter
    return matchSearch && matchStatus
  })

  return (
    <AdminLayout>
      <div className="admin-page-header">
        <h2 className="admin-page-title">Pedidos</h2>
        <div className="d-flex gap-2 align-items-center">
          <input
            className="admin-search"
            type="text"
            placeholder="Buscar por cliente o referencia..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
          <select
            className="admin-select"
            style={{ width: 'auto' }}
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
          >
            {STATUSES.map((s) => (
              <option key={s.value} value={s.value}>{s.label}</option>
            ))}
          </select>
        </div>
      </div>

      {loading && <p className="admin-loading">Cargando...</p>}
      {error   && <p className="admin-error">{error}</p>}

      {!loading && !error && (
        <div className="admin-table-wrap">
          <table className="admin-table">
            <thead>
              <tr>
                <th>Referencia</th>
                <th>Cliente</th>
                <th>Fecha</th>
                <th>Total</th>
                <th>Estado</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((o) => (
                <tr key={o.id} className="admin-table-row">
                  <td className="admin-table-cell" style={{ fontFamily: 'monospace', fontSize: '0.78rem', letterSpacing: '0.5px' }}>
                    #{shortId(o.id)}
                  </td>
                  <td className="admin-table-name">
                    {o.user ? `${o.user.name} ${o.user.surname ?? ''}`.trim() : '—'}
                  </td>
                  <td className="admin-table-cell">{formatDate(o.created_at)}</td>
                  <td className="admin-table-cell">{Number(o.total).toFixed(2)} €</td>
                  <td>
                    <span className={`admin-status-badge order-${o.status}`}>
                      {STATUS_LABEL[o.status] ?? o.status}
                    </span>
                  </td>
                  <td>
                    <button
                      className="admin-edit-btn"
                      onClick={() => navigate(`/admin/pedidos/${o.id}`)}
                    >
                      Ver / Editar
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {filtered.length === 0 && (
            <p style={{ color: '#555', textAlign: 'center', padding: '2rem', fontSize: '0.85rem' }}>
              No se encontraron pedidos.
            </p>
          )}
        </div>
      )}
    </AdminLayout>
  )
}
