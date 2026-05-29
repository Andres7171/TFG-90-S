import { useState } from 'react'
import emailjs from '@emailjs/browser'
import '../styles/AtencionCliente.css'

const EMAILJS_SERVICE_ID = import.meta.env.VITE_EMAILJS_SERVICE_ID
const EMAILJS_TEMPLATE_ID = import.meta.env.VITE_EMAILJS_CONTACT_TEMPLATE_ID
const EMAILJS_PUBLIC_KEY = import.meta.env.VITE_EMAILJS_PUBLIC_KEY


export function AtencionCliente() {
  const [form, setForm] = useState({ name: '', email: '', message: '' })
  const [submitted, setSubmitted] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value })

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError(null)
    try {
      await emailjs.send(
        EMAILJS_SERVICE_ID,
        EMAILJS_TEMPLATE_ID,
        { from_name: form.name, from_email: form.email, message: form.message },
        EMAILJS_PUBLIC_KEY
      )
      setSubmitted(true)
    } catch (err) {
  console.error('EmailJS error:', err)
  setError('Error al enviar el mensaje. Inténtalo de nuevo.')
} finally {
      setLoading(false)
    }
  }

  const handleReset = () => {
    setSubmitted(false)
    setForm({ name: '', email: '', message: '' })
  }

  return (
    <div className="atencion-page">
      <div className="container py-5">
        <h1 className="atencion-title mb-2">ATENCIÓN AL CLIENTE</h1>
        <p className="atencion-subtitle mb-4">
          ¿Tienes alguna duda o problema? Escríbenos y te respondemos lo antes posible.
        </p>

        {submitted ? (
          <div className="atencion-success">
            <p className="atencion-success-text">
              Mensaje enviado. Nos pondremos en contacto contigo pronto.
            </p>
            <button className="btn atencion-btn mt-3" onClick={handleReset}>
              ENVIAR OTRO
            </button>
          </div>
        ) : (
          <div className="atencion-card p-4">
            <form onSubmit={handleSubmit}>
              <div className="mb-3">
                <label className="form-label atencion-label">Nombre</label>
                <input
                  name="name"
                  className="form-control atencion-input"
                  value={form.name}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="mb-3">
                <label className="form-label atencion-label">Email</label>
                <input
                  type="email"
                  name="email"
                  className="form-control atencion-input"
                  value={form.email}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="mb-4">
                <label className="form-label atencion-label">Describe tu problema o duda</label>
                <textarea
                  name="message"
                  className="form-control atencion-input"
                  rows={5}
                  value={form.message}
                  onChange={handleChange}
                  required
                />
              </div>

              {error && <div className="alert alert-danger py-2 mb-3">{error}</div>}

              <button type="submit" className="btn atencion-btn w-100" disabled={loading}>
                {loading ? 'ENVIANDO...' : 'ENVIAR'}
              </button>
            </form>
          </div>
        )}
      </div>
    </div>
  )
}
