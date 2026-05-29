import { ShoppingCart, User, Settings } from 'lucide-react'
import { motion } from 'framer-motion'
import { NavLink, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { useCart } from '../context/CartContext'
import { ProfileSidebar } from './ProfileSidebar'
import { useState } from 'react'
import '../styles/Header.css'

const NAV_LINKS = [
  { label: 'Inicio', to: '/', end: true },
  { label: "90's Type Shit", to: '/90s' },
  { label: 'Blog', to: '/blog' },
  { label: 'Eventos', to: '/eventos' },
  { label: 'Colaboradores', to: '/colaboradores' },
  { label: 'Atención al Cliente', to: '/atencion-cliente' },
]

export function Header() {
  const { user, isAdmin } = useAuth()
  const { totalItems, setCartOpen } = useCart()
  const navigate = useNavigate()
  const [profileOpen, setProfileOpen] = useState(false)

  const handleCartClick = () => {
    if (!user) { navigate('/login'); return }
    setCartOpen(true)
  }

  const handleUserClick = () => {
    if (!user) { navigate('/login'); return }
    setProfileOpen(true)
  }

  return (
    <>
    <ProfileSidebar open={profileOpen} onClose={() => setProfileOpen(false)} />
    <div className="contenedor">
      <motion.header
        initial={{ y: -50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        className="header border-bottom py-2 px-4"
      >
        <div className="container-fluid">
          <div className="row align-items-center">

            <div className="col-3">
              <h1 className="logo-text m-2">RETROWEAR</h1>
            </div>

            <div className="col-6">
              <nav className="d-flex align-items-center justify-content-center gap-3">
                {NAV_LINKS.map(({ label, to, end }) => (
                  <NavLink
                    key={to}
                    to={to}
                    end={end}
                    className={({ isActive }) =>
                      `nav-item-custom ${isActive ? 'nav-item-active' : ''}`
                    }
                  >
                    {label}
                  </NavLink>
                ))}
              </nav>
            </div>

            <div className="col-3 d-flex align-items-center justify-content-end gap-2">
              {isAdmin && (
                <button className="admin-panel-btn" onClick={() => navigate('/admin')} title="Panel administrador">
                  <Settings size={17} />
                </button>
              )}
              <button className="cart-btn-round" onClick={handleCartClick}>
                <ShoppingCart size={20} />
                {totalItems > 0 && (
                  <span className="cart-badge">{totalItems}</span>
                )}
              </button>
              <button className="user-btn-round" onClick={handleUserClick}>
                <User size={20} />
              </button>
            </div>

          </div>
        </div>
      </motion.header>
    </div>
    </>
  )
}
