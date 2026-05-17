import { useState, useEffect } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { X, ChevronDown, MessageCircle, User } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { getMyOrders } from '../services/orderService'
import '../styles/ProfileSidebar.css'

export function ProfileSidebar({ open, onClose }) {
  const { user, profile, logout } = useAuth()
  const navigate = useNavigate()
  const [orders, setOrders]         = useState([])
  const [loadingOrders, setLoadingOrders] = useState(false)
  const [expandedId, setExpandedId] = useState(null)

  useEffect(() => {
    if (!open || !user) return
    setLoadingOrders(true)
    getMyOrders(user.id)
      .then(setOrders)
      .catch(() => setOrders([]))
      .finally(() => setLoadingOrders(false))
  }, [open, user])

  const handleLogout = async () => {
    await logout()
    onClose()
    navigate('/')
  }

  const handleHelp = () => {
    onClose()
    navigate('/atencion-cliente')
  }

  const formatDate = (iso) =>
    new Date(iso).toLocaleDateString('es-ES', { day: '2-digit', month: 'short', year: 'numeric' })

  const memberSince = profile?.created_at
    ? new Date(profile.created_at).toLocaleDateString('es-ES', { month: 'long', year: 'numeric' })
    : null

  const displayName = profile?.name
    ? `${profile.name}${profile.surname ? ' ' + profile.surname : ''}`
    : user?.email

  return (
    <AnimatePresence>
      {open && (
        <>
          <motion.div
            className="profile-overlay"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
          />
          <motion.div
            className="profile-sidebar"
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'tween', duration: 0.28 }}
          >
            <div className="profile-header">
              <h2 className="profile-title">MI PERFIL</h2>
              <button className="profile-close-btn" onClick={onClose}>
                <X size={22} />
              </button>
            </div>

            <div className="profile-body">
              <div className="profile-avatar">
                <User size={30} color="#000" />
              </div>
              <p className="profile-name">{displayName}</p>
              <p className="profile-email">{user?.email}</p>
              {memberSince && (
                <p className="profile-since">Miembro desde {memberSince}</p>
              )}

              <button className="profile-help-btn" onClick={handleHelp}>
                <MessageCircle size={16} />
                ¿Tienes algún problema? Contacta con nosotros
              </button>

              <hr className="profile-divider" />

              <p className="profile-section-title">MIS PEDIDOS</p>

              {loadingOrders ? (
                <p className="order-empty">Cargando pedidos...</p>
              ) : orders.length === 0 ? (
                <p className="order-empty">Aún no has realizado ningún pedido.</p>
              ) : (
                orders.map((order) => (
                  <div key={order.id} className="order-card">
                    <div
                      className="order-card-header"
                      onClick={() => setExpandedId(expandedId === order.id ? null : order.id)}
                    >
                      <div>
                        <p className="order-date mb-0">{formatDate(order.created_at)}</p>
                        <p className="order-status mb-0">{order.status}</p>
                      </div>
                      <div className="d-flex align-items-center gap-2">
                        <span className="order-total">{Number(order.total).toFixed(2)} €</span>
                        <ChevronDown
                          size={16}
                          className={`order-chevron ${expandedId === order.id ? 'open' : ''}`}
                        />
                      </div>
                    </div>

                    {expandedId === order.id && (
                      <div className="order-lines">
                        {order.lines.map((line) => (
                          <div key={line.id} className="order-line-item">
                            <span className="order-line-name">
                              {line.product_name_snapshot}
                              {line.variant_size_snapshot && (
                                <span style={{ color: '#888' }}> · {line.variant_size_snapshot}</span>
                              )}
                              <span style={{ color: '#555' }}> x{line.quantity}</span>
                            </span>
                            <span className="order-line-price">
                              {(line.unit_price * line.quantity).toFixed(2)} €
                            </span>
                          </div>
                        ))}
                        <div style={{ fontSize: '0.78rem', color: '#555', marginTop: '0.5rem' }}>
                          Enviado a: {order.mailing_address}
                        </div>
                      </div>
                    )}
                  </div>
                ))
              )}
            </div>

            <div className="profile-footer">
              <button className="profile-logout-btn" onClick={handleLogout}>
                CERRAR SESIÓN
              </button>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}
