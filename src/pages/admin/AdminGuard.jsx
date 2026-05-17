import { Navigate } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'

export function AdminGuard({ children }) {
  const { user, profile, loading } = useAuth()

  if (loading)
    return (
      <div className="d-flex justify-content-center align-items-center min-vh-100"
           style={{ background: '#0a0a0a' }}>
        <p style={{ color: '#FFD700', fontFamily: 'Impact, sans-serif', fontSize: '1.2rem' }}>
          Cargando...
        </p>
      </div>
    )

  if (!user || profile?.rol !== 'admin')
    return <Navigate to="/" replace />

  return children
}
