import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import '../styles/Auth.css'

export function Register() {
  const { register, loginWithGoogle } = useAuth()
  const navigate = useNavigate()

  const [form, setForm] = useState({
    name: '', surname: '', email: '', password: '', confirm: '',
  })
  const [error, setError] = useState(null)
  const [loading, setLoading] = useState(false)

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value })

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError(null)

    if (form.password !== form.confirm) {
      setError('Las contraseñas no coinciden')
      return
    }

    setLoading(true)
    try {
      await register(form.email, form.password, form.name, form.surname)
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
        <h2 className="auth-title">CREAR CUENTA</h2>

        {error && <div className="alert alert-danger py-2">{error}</div>}

        <form onSubmit={handleSubmit}>
          <div className="row g-2 mb-3">
            <div className="col-6">
              <label className="form-label">Nombre</label>
              <input
                name="name"
                className="form-control auth-input"
                value={form.name}
                onChange={handleChange}
                required
              />
            </div>
            <div className="col-6">
              <label className="form-label">Apellido</label>
              <input
                name="surname"
                className="form-control auth-input"
                value={form.surname}
                onChange={handleChange}
                required
              />
            </div>
          </div>

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

          <div className="mb-3">
            <label className="form-label">Confirmar contraseña</label>
            <input
              type="password"
              name="confirm"
              className="form-control auth-input"
              value={form.confirm}
              onChange={handleChange}
              required
            />
          </div>

          <button type="submit" className="btn auth-btn w-100 mt-2" disabled={loading}>
            {loading ? 'Creando cuenta...' : 'REGISTRARSE'}
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
          ¿Ya tienes cuenta? <Link to="/login">Inicia sesión</Link>
        </p>
      </div>
    </div>
  )
}
