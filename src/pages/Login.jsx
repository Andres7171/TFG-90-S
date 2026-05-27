import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import '../styles/Auth.css'

export function Login() {
  const { login, loginWithGoogle } = useAuth()
  const navigate  = useNavigate()

  const [form, setForm] = useState({ email: '', password: '' })
  const [error, setError] = useState(null)
  const [loading, setLoading] = useState(false)

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value })

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError(null)
    try {
      await login(form.email, form.password)
      navigate('/')
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="auth-wrapper d-flex align-items-center justify-content-center min-vh-100">
      <div className="auth-card p-4">
        <Link to="/" className="auth-back-link">← Volver a la tienda</Link>
        <h2 className="auth-title">INICIAR SESIÓN</h2>

        {error && <div className="alert alert-danger py-2">{error}</div>}

        <form onSubmit={handleSubmit}>
          <div className="mb-3">
            <label className="form-label">Email</label>
            <input
              type="email"
              name="email"
              className="form-control auth-input"
              value={form.email}
              onChange={handleChange}
              required
            />
          </div>

          <div className="mb-3">
            <label className="form-label">Contraseña</label>
            <input
              type="password"
              name="password"
              className="form-control auth-input"
              value={form.password}
              onChange={handleChange}
              required
            />
          </div>

          <button type="submit" className="btn auth-btn w-100 mt-2" disabled={loading}>
            {loading ? 'Entrando...' : 'ENTRAR'}
          </button>
        </form>
        
        <div className="auth-divider">
          <span>o</span>
        </div>
 
        <button
          type="button"
          className="btn auth-google-btn w-100"
          onClick={loginWithGoogle}
        >
          CONTINUAR CON GOOGLE
        </button>


        <p className="text-center mt-3 auth-switch">
          ¿No tienes cuenta? <Link to="/register">Regístrate</Link>
        </p>
      </div>
    </div>
  )
}