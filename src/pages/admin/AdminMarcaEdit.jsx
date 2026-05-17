import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { ChevronLeft } from 'lucide-react'
import { getCollaboratorByIdAdmin, updateCollaborator } from '../../services/adminService'
import { AdminLayout } from './AdminLayout'
import { toast } from 'sonner'

const TYPES = ['Propia', 'Freelancer', 'Empresa']

export function AdminMarcaEdit() {
  const { id } = useParams()
  const navigate = useNavigate()

  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [error, setError]   = useState(null)

  const [fields, setFields] = useState({
    name: '', type: 'Propia', description: '',
    email: '', contact: '', web_url: '', image_url: '', active: true,
  })

  useEffect(() => {
    getCollaboratorByIdAdmin(id)
      .then((data) => {
        setFields({
          name:        data.name        ?? '',
          type:        data.type        ?? 'Propia',
          description: data.description ?? '',
          email:       data.email       ?? '',
          contact:     data.contact     ?? '',
          web_url:     data.web_url     ?? '',
          image_url:   data.image_url   ?? '',
          active:      data.active      ?? true,
        })
      })
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false))
  }, [id])

  const handleField = (e) => {
    const { name, value, type, checked } = e.target
    setFields((prev) => ({ ...prev, [name]: type === 'checkbox' ? checked : value }))
  }

  const handleSave = async () => {
    setSaving(true)
    setError(null)
    try {
      await updateCollaborator(id, {
        name:        fields.name,
        type:        fields.type,
        description: fields.description,
        email:       fields.email     || null,
        contact:     fields.contact   || null,
        web_url:     fields.web_url   || null,
        image_url:   fields.image_url || null,
        active:      fields.active,
      })
      toast.success('Marca guardada correctamente')
    } catch (err) {
      setError(err.message)
    } finally {
      setSaving(false)
    }
  }

  if (loading)
    return (
      <AdminLayout>
        <p className="admin-loading">Cargando marca...</p>
      </AdminLayout>
    )

  return (
    <AdminLayout>
      <div className="admin-form-page">
        <button className="admin-back-btn" onClick={() => navigate(-1)}>
          <ChevronLeft size={15} /> Volver
        </button>

        <h2 className="admin-page-title" style={{ marginBottom: '1.75rem' }}>
          Editar Marca
        </h2>

        {error && <p className="admin-error" style={{ marginBottom: '1rem' }}>{error}</p>}

        <div className="admin-form-grid">

          <div className="admin-form-group">
            <label className="admin-label">Nombre</label>
            <input className="admin-input" name="name" value={fields.name} onChange={handleField} />
          </div>

          <div className="admin-form-group">
            <label className="admin-label">Tipo</label>
            <select className="admin-select" name="type" value={fields.type} onChange={handleField}>
              {TYPES.map((t) => (
                <option key={t} value={t}>{t}</option>
              ))}
            </select>
          </div>

          <div className="admin-form-group">
            <label className="admin-label">Email</label>
            <input className="admin-input" type="email" name="email" value={fields.email}
              onChange={handleField} placeholder="contacto@ejemplo.com" />
          </div>

          <div className="admin-form-group">
            <label className="admin-label">Contacto (teléfono u otro)</label>
            <input className="admin-input" name="contact" value={fields.contact}
              onChange={handleField} placeholder="+34 600 000 000" />
          </div>

          <div className="admin-form-group">
            <label className="admin-label">URL web</label>
            <input className="admin-input" name="web_url" value={fields.web_url}
              onChange={handleField} placeholder="https://..." />
          </div>

          <div className="admin-form-group">
            <label className="admin-label">URL de imagen</label>
            <input className="admin-input" name="image_url" value={fields.image_url}
              onChange={handleField} placeholder="https://..." />
          </div>

          <div className="admin-form-group full-width">
            <label className="admin-label">Descripción</label>
            <textarea className="admin-textarea" name="description" value={fields.description}
              onChange={handleField} />
          </div>

          <div className="admin-form-group">
            <label className="admin-label">Estado</label>
            <div className="admin-toggle-row">
              <input type="checkbox" className="admin-toggle" name="active"
                checked={fields.active} onChange={handleField} />
              <span className="admin-toggle-label">{fields.active ? 'Activo' : 'Inactivo'}</span>
            </div>
          </div>

        </div>

        <button className="admin-save-btn" onClick={handleSave} disabled={saving}>
          {saving ? 'GUARDANDO...' : 'GUARDAR CAMBIOS'}
        </button>
      </div>
    </AdminLayout>
  )
}
