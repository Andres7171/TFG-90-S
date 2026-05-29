import { useState, useEffect, useMemo } from 'react'
import { useNavigate } from 'react-router-dom'
import { BarChart, Bar, PieChart, Pie, Cell, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts'
import { getAllOrders, getAllProducts, getAllBrandsAdmin } from '../../services/adminService'
import { AdminLayout } from './AdminLayout'
import { ShoppingBag, DollarSign, Package, Users } from 'lucide-react'
import '../../styles/Dashboard.css'

const STATUS_LABELS = {
  pending: 'Pendiente',
  paid: 'Pagado',
  shipped: 'Enviado',
  delivered: 'Entregado',
  cancelled: 'Cancelado',
}

const STATUS_COLORS = {
  pending: '#F59E0B',
  paid: '#4ade80',
  shipped: '#60a5fa',
  delivered: '#86efac',
  cancelled: '#f87171',
}

const PIE_COLORS = ['#FFD700', '#4ade80', '#60a5fa', '#f87171', '#a78bfa', '#fb923c']

export function AdminDashboard() {
  const [orders, setOrders] = useState([])
  const [products, setProducts] = useState([])
  const [brands, setBrands] = useState([])
  const [loading, setLoading] = useState(true)
  const navigate = useNavigate()

  useEffect(() => {
    Promise.all([getAllOrders(), getAllProducts(), getAllBrandsAdmin()])
      .then(([o, p, b]) => { setOrders(o); setProducts(p); setBrands(b) })
      .catch(() => {})
      .finally(() => setLoading(false))
  }, [])

  // KPIs
  const stats = useMemo(() => {
    const paidOrders = orders.filter(o => o.status === 'paid' || o.status === 'shipped' || o.status === 'delivered')
    const totalRevenue = paidOrders.reduce((sum, o) => sum + Number(o.total), 0)
    const totalStock = products.reduce((sum, p) =>
      sum + (p.variants?.reduce((s, v) => s + v.stock, 0) ?? 0), 0
    )

    return {
      totalOrders: orders.length,
      totalRevenue,
      totalProducts: products.length,
      totalBrands: brands.length,
      totalStock,
      paidOrders: paidOrders.length,
    }
  }, [orders, products, brands])

  const ordersByStatus = useMemo(() => {
    const counts = {}
    orders.forEach(o => { counts[o.status] = (counts[o.status] || 0) + 1 })
    return Object.entries(counts).map(([status, count]) => ({
      name: STATUS_LABELS[status] || status,
      value: count,
      color: STATUS_COLORS[status] || '#888',
    }))
  }, [orders])

  const topProducts = useMemo(() => {
    const sold = {}
    orders.forEach(o => {
      if (o.status === 'cancelled') return
      o.lines?.forEach(l => {
        const name = l.product_name_snapshot
        sold[name] = (sold[name] || 0) + l.quantity
      })
    })
    return Object.entries(sold)
      .map(([name, qty]) => ({ name: name.length > 20 ? name.slice(0, 20) + '…' : name, qty }))
      .sort((a, b) => b.qty - a.qty)
      .slice(0, 8)
  }, [orders])

  const productsByCategory = useMemo(() => {
    const counts = {}
    products.forEach(p => {
      const cat = p.category || 'general'
      counts[cat] = (counts[cat] || 0) + 1
    })
    return Object.entries(counts).map(([name, value]) => ({
      name: name.charAt(0).toUpperCase() + name.slice(1),
      value,
    }))
  }, [products])

  const revenueByMonth = useMemo(() => {
    const months = {}
    orders.forEach(o => {
      if (o.status === 'cancelled' || o.status === 'pending') return
      const date = new Date(o.created_at)
      const key = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`
      const label = date.toLocaleDateString('es-ES', { month: 'short', year: '2-digit' })
      if (!months[key]) months[key] = { key, name: label, total: 0 }
      months[key].total += Number(o.total)
    })
    return Object.values(months).sort((a, b) => a.key.localeCompare(b.key)).slice(-6)
  }, [orders])

  // Recent orders
  const recentOrders = useMemo(() => orders.slice(0, 5), [orders])

  const CustomTooltip = ({ active, payload }) => {
    if (!active || !payload?.length) return null
    return (
      <div className="dash-tooltip">
        <p className="dash-tooltip-label">{payload[0].payload.name}</p>
        <p className="dash-tooltip-value">
          {typeof payload[0].value === 'number' && payload[0].value % 1 !== 0
            ? `${payload[0].value.toFixed(2)} €`
            : payload[0].value
          }
        </p>
      </div>
    )
  }

  if (loading)
    return (
      <AdminLayout>
        <p className="admin-loading">Cargando dashboard...</p>
      </AdminLayout>
    )

  return (
    <AdminLayout>
      <h2 className="admin-page-title" style={{ marginBottom: '1.5rem' }}>DASHBOARD</h2>

      {/* KPI cards */}
      <div className="dash-kpis">
        <div className="dash-kpi">
          <div className="dash-kpi-icon" style={{ background: 'rgba(255,215,0,0.15)' }}>
            <DollarSign size={20} color="#FFD700" />
          </div>
          <div>
            <p className="dash-kpi-value">{stats.totalRevenue.toFixed(2)} €</p>
            <p className="dash-kpi-label">Ingresos totales</p>
          </div>
        </div>

        <div className="dash-kpi">
          <div className="dash-kpi-icon" style={{ background: 'rgba(74,222,128,0.15)' }}>
            <ShoppingBag size={20} color="#4ade80" />
          </div>
          <div>
            <p className="dash-kpi-value">{stats.totalOrders}</p>
            <p className="dash-kpi-label">Pedidos totales ({stats.paidOrders} pagados)</p>
          </div>
        </div>

        <div className="dash-kpi">
          <div className="dash-kpi-icon" style={{ background: 'rgba(96,165,250,0.15)' }}>
            <Package size={20} color="#60a5fa" />
          </div>
          <div>
            <p className="dash-kpi-value">{stats.totalProducts}</p>
            <p className="dash-kpi-label">Productos ({stats.totalStock} uds. en stock)</p>
          </div>
        </div>

        <div className="dash-kpi">
          <div className="dash-kpi-icon" style={{ background: 'rgba(167,139,250,0.15)' }}>
            <Users size={20} color="#a78bfa" />
          </div>
          <div>
            <p className="dash-kpi-value">{stats.totalBrands}</p>
            <p className="dash-kpi-label">Marcas</p>
          </div>
        </div>
      </div>

      {/* Charts row 1 */}
      <div className="dash-charts-row">
        <div className="dash-chart-card">
          <h3 className="dash-chart-title">Ingresos por mes</h3>
          {revenueByMonth.length > 0 ? (
            <ResponsiveContainer width="100%" height={220}>
              <BarChart data={revenueByMonth}>
                <XAxis dataKey="name" tick={{ fill: '#888', fontSize: 12 }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fill: '#888', fontSize: 11 }} axisLine={false} tickLine={false} />
                <Tooltip content={<CustomTooltip />} cursor={{ fill: 'rgba(255,215,0,0.05)' }} />
                <Bar dataKey="total" fill="#FFD700" radius={[3, 3, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          ) : (
            <p className="dash-chart-empty">Sin datos de ingresos.</p>
          )}
        </div>

        <div className="dash-chart-card">
          <h3 className="dash-chart-title">Pedidos por estado</h3>
          {ordersByStatus.length > 0 ? (
            <ResponsiveContainer width="100%" height={220}>
              <PieChart>
                <Pie
                  data={ordersByStatus}
                  dataKey="value"
                  nameKey="name"
                  cx="50%"
                  cy="50%"
                  innerRadius={50}
                  outerRadius={80}
                  paddingAngle={3}
                >
                  {ordersByStatus.map((entry, i) => (
                    <Cell key={i} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip content={<CustomTooltip />} />
              </PieChart>
            </ResponsiveContainer>
          ) : (
            <p className="dash-chart-empty">Sin pedidos.</p>
          )}
          <div className="dash-legend">
            {ordersByStatus.map((entry, i) => (
              <span key={i} className="dash-legend-item">
                <span className="dash-legend-dot" style={{ background: entry.color }} />
                {entry.name}: {entry.value}
              </span>
            ))}
          </div>
        </div>
      </div>

      {/* Charts row 2 */}
      <div className="dash-charts-row">
        <div className="dash-chart-card">
          <h3 className="dash-chart-title">Productos más vendidos</h3>
          {topProducts.length > 0 ? (
            <ResponsiveContainer width="100%" height={220}>
              <BarChart data={topProducts} layout="vertical">
                <XAxis type="number" tick={{ fill: '#888', fontSize: 11 }} axisLine={false} tickLine={false} />
                <YAxis type="category" dataKey="name" tick={{ fill: '#ccc', fontSize: 11 }} width={130} axisLine={false} tickLine={false} />
                <Tooltip content={<CustomTooltip />} cursor={{ fill: 'rgba(255,215,0,0.05)' }} />
                <Bar dataKey="qty" fill="#4ade80" radius={[0, 3, 3, 0]} />
              </BarChart>
            </ResponsiveContainer>
          ) : (
            <p className="dash-chart-empty">Sin ventas registradas.</p>
          )}
        </div>

        <div className="dash-chart-card">
          <h3 className="dash-chart-title">Productos por categoría</h3>
          {productsByCategory.length > 0 ? (
            <ResponsiveContainer width="100%" height={220}>
              <PieChart>
                <Pie
                  data={productsByCategory}
                  dataKey="value"
                  nameKey="name"
                  cx="50%"
                  cy="50%"
                  innerRadius={50}
                  outerRadius={80}
                  paddingAngle={3}
                >
                  {productsByCategory.map((_, i) => (
                    <Cell key={i} fill={PIE_COLORS[i % PIE_COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip content={<CustomTooltip />} />
              </PieChart>
            </ResponsiveContainer>
          ) : (
            <p className="dash-chart-empty">Sin productos.</p>
          )}
          <div className="dash-legend">
            {productsByCategory.map((entry, i) => (
              <span key={i} className="dash-legend-item">
                <span className="dash-legend-dot" style={{ background: PIE_COLORS[i % PIE_COLORS.length] }} />
                {entry.name}: {entry.value}
              </span>
            ))}
          </div>
        </div>
      </div>

      {/* Recent orders */}
      <div className="dash-recent">
        <h3 className="dash-chart-title">Últimos pedidos</h3>
        {recentOrders.length > 0 ? (
          <div className="admin-table-wrap">
            <table className="admin-table">
              <thead>
                <tr>
                  <th>Pedido</th>
                  <th>Cliente</th>
                  <th>Total</th>
                  <th>Estado</th>
                  <th>Fecha</th>
                </tr>
              </thead>
              <tbody>
                {recentOrders.map(o => (
                  <tr
                    key={o.id}
                    className="admin-table-row dash-order-row"
                    onClick={() => navigate(`/admin/pedidos/${o.id}`)}
                  >
                    <td className="admin-table-cell">#{o.id.slice(0, 8).toUpperCase()}</td>
                    <td className="admin-table-name">
                      {o.user?.name || 'Anónimo'}
                      {o.user?.surname ? ` ${o.user.surname}` : ''}
                    </td>
                    <td style={{ color: '#FFD700', fontWeight: 'bold' }}>{Number(o.total).toFixed(2)} €</td>
                    <td>
                      <span className={`admin-status-badge order-${o.status}`}>
                        {STATUS_LABELS[o.status] || o.status}
                      </span>
                    </td>
                    <td className="admin-table-cell">
                      {new Date(o.created_at).toLocaleDateString('es-ES', { day: '2-digit', month: 'short' })}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <p className="dash-chart-empty">Sin pedidos recientes.</p>
        )}
      </div>
    </AdminLayout>
  )
}