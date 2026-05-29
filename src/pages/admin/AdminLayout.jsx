import { NavLink, useNavigate } from 'react-router-dom'
import { LogOut } from 'lucide-react'
import { useAuth } from '../../context/AuthContext'
import '../../styles/Admin.css'

const ADMIN_LINKS = [
  { label: 'Dashboard', to: '/admin/dashboard' },
  { label: 'Todos los Productos', to: '/admin/productos' },
  { label: "90's Type Shit", to: '/admin/90s' },
  { label: 'Marcas', to: '/admin/marcas' },
  { label: 'Colaboradores', to: '/admin/colaboradores' },
  { label: 'Pedidos', to: '/admin/pedidos' },
]

export function AdminLayout({ children }) {
  const { profile, logout } = useAuth()
  const navigate = useNavigate()

  const handleLogout = async () => {
    await logout()
    navigate('/login')
  }

  return (
    <div className="admin-wrapper">
      <header className="admin-header">
        <div className="container-fluid">
          <div className="row align-items-center">

            <div className="col-auto d-flex align-items-center">
              <span className="admin-logo">90'S TYPE SHIT</span>
              <span className="admin-badge">MODO ADMINISTRADOR</span>
            </div>

            <div className="col d-flex justify-content-center">
              <nav className="d-flex gap-4">
                {ADMIN_LINKS.map(({ label, to }) => (
                  <NavLink
                    key={to}
                    to={to}
                    className={({ isActive }) =>
                      `admin-nav-link ${isActive ? 'admin-nav-active' : ''}`
                    }
                  >
                    {label}
                  </NavLink>
                ))}
              </nav>
            </div>

            <div className="col-auto d-flex align-items-center gap-3">
              <span className="admin-user-name">{profile?.name}</span>
              <button className="admin-back-store-btn" onClick={() => navigate('/')}>
                Volver a la tienda
              </button>
              <button className="admin-logout-btn" onClick={handleLogout}>
                <LogOut size={14} /> Salir
              </button>
            </div>

          </div>
        </div>
      </header>

      <main className="admin-main">
        {children}
      </main>
    </div>
  )
}