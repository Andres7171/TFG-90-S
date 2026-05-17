import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { ChevronLeft } from 'lucide-react'
import {
  getProductByIdAdmin,
  updateProduct,
  updateVariant,
  addVariant,
  deleteVariant,
} from '../../services/adminService'
import { AdminLayout } from './AdminLayout'
import { toast } from 'sonner'

const CATEGORIES = ['camisetas', 'pantalones', 'vestidos', 'accesorios', 'calzado', 'general']

export function AdminProductoEdit() {
  const { id } = useParams()
  const navigate = useNavigate()

  const [loading, setLoading]   = useState(true)
  const [saving, setSaving] = useState(false)
  const [error, setError]   = useState(null)

  const [fields, setFields] = useState({
    name: '', price: '', description: '', image_url: '',
    category: 'general', clothing_type: '', decade: '', active: true,
  })

  const [variants, setVariants] = useState([])
  const [toDelete, setToDelete] = useState([])
  const [newVariant, setNewVariant] = useState({ size: '', stock: '' })

  useEffect(() => {
    getProductByIdAdmin(id)
      .then((data) => {
        setFields({
          name:         data.name         ?? '',
          price:        data.price        ?? '',
          description:  data.description  ?? '',
          image_url:    data.image_url    ?? '',
          category:     data.category     ?? 'general',
          clothing_type: data.clothing_type ?? '',
          decade:       data.decade       ?? '',
          active:       data.active       ?? true,
        })
        setVariants(data.variants ?? [])
      })
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false))
  }, [id])

  const handleField = (e) => {
    const { name, value, type, checked } = e.target
    setFields((prev) => ({ ...prev, [name]: type === 'checkbox' ? checked : value }))
  }

  const handleVariantChange = (variantId, field, value) => {
    setVariants((prev) =>
      prev.map((v) => v.id === variantId ? { ...v, [field]: value } : v)
    )
  }

  const markForDeletion = (variantId) => {
    setVariants((prev) => prev.filter((v) => v.id !== variantId))
    setToDelete((prev) => [...prev, variantId])
  }

  const handleSave = async () => {
    setSaving(true)
    setError(null)
    try {
      await updateProduct(id, {
        name:         fields.name,
        price:        Number(fields.price),
        description:  fields.description,
        image_url:    fields.image_url || null,
        category:     fields.category,
        clothing_type: fields.clothing_type || null,
        decade:       fields.decade ? Number(fields.decade) : null,
        active:       fields.active,
      })

      await Promise.all(
        variants.map((v) =>
          updateVariant(v.id, { size: v.size, stock: Number(v.stock) })
        )
      )

      await Promise.all(toDelete.map((vid) => deleteVariant(vid)))
      setToDelete([])

      if (newVariant.size.trim()) {
        await addVariant(id, newVariant.size.trim(), newVariant.stock || 0)
        setNewVariant({ size: '', stock: '' })
        const updated = await getProductByIdAdmin(id)
        setVariants(updated.variants ?? [])
      }

      toast.success('Producto guardado correctamente')
    } catch (err) {
      setError(err.message)
    } finally {
      setSaving(false)
    }
  }

  if (loading)
    return (
      <AdminLayout>
        <p className="admin-loading">Cargando producto...</p>
      </AdminLayout>
    )

  return (
    <AdminLayout>
      <div className="admin-form-page">
        <button className="admin-back-btn" onClick={() => navigate(-1)}>
          <ChevronLeft size={15} /> Volver
        </button>

        <h2 className="admin-page-title" style={{ marginBottom: '1.75rem' }}>
          Editar Producto
        </h2>

        {error && <p className="admin-error" style={{ marginBottom: '1rem' }}>{error}</p>}

        <div className="admin-form-grid">

          <div className="admin-form-group">
            <label className="admin-label">Nombre</label>
            <input className="admin-input" name="name" value={fields.name} onChange={handleField} />
          </div>

          <div className="admin-form-group">
            <label className="admin-label">Precio (€)</label>
            <input className="admin-input" type="number" name="price" value={fields.price} onChange={handleField} min="0" step="0.01" />
          </div>

          <div className="admin-form-group">
            <label className="admin-label">Categoría</label>
            <select className="admin-select" name="category" value={fields.category} onChange={handleField}>
              {CATEGORIES.map((c) => (
                <option key={c} value={c}>{c}</option>
              ))}
            </select>
          </div>

          <div className="admin-form-group">
            <label className="admin-label">Tipo de ropa</label>
            <input className="admin-input" name="clothing_type" value={fields.clothing_type} onChange={handleField} placeholder="ej. camiseta, sudadera..." />
          </div>

          <div className="admin-form-group">
            <label className="admin-label">Década</label>
            <input className="admin-input" type="number" name="decade" value={fields.decade} onChange={handleField} placeholder="ej. 1990" />
          </div>

          <div className="admin-form-group">
            <label className="admin-label">URL de imagen</label>
            <input className="admin-input" name="image_url" value={fields.image_url} onChange={handleField} placeholder="https://..." />
          </div>

          <div className="admin-form-group full-width">
            <label className="admin-label">Descripción</label>
            <textarea className="admin-textarea" name="description" value={fields.description} onChange={handleField} />
          </div>

          <div className="admin-form-group">
            <label className="admin-label">Estado</label>
            <div className="admin-toggle-row">
              <input
                type="checkbox"
                className="admin-toggle"
                name="active"
                checked={fields.active}
                onChange={handleField}
              />
              <span className="admin-toggle-label">{fields.active ? 'Activo' : 'Inactivo'}</span>
            </div>
          </div>

        </div>

        <p className="admin-section-title">Tallas y Stock</p>

        {variants.length > 0 ? (
          <table className="admin-variants-table">
            <thead>
              <tr>
                <th style={{ width: '45%' }}>Talla</th>
                <th style={{ width: '35%' }}>Stock</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {variants.map((v) => (
                <tr key={v.id}>
                  <td>
                    <input
                      className="admin-variant-input"
                      value={v.size}
                      onChange={(e) => handleVariantChange(v.id, 'size', e.target.value)}
                    />
                  </td>
                  <td>
                    <input
                      className="admin-variant-input"
                      type="number"
                      min="0"
                      value={v.stock}
                      onChange={(e) => handleVariantChange(v.id, 'stock', e.target.value)}
                    />
                  </td>
                  <td>
                    <button className="admin-delete-variant-btn" onClick={() => markForDeletion(v.id)}>
                      Eliminar
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <p style={{ color: '#555', fontSize: '0.85rem', marginBottom: '1rem' }}>
            Sin variantes. Añade una abajo.
          </p>
        )}

        <div className="admin-add-variant-row">
          <input
            className="admin-variant-input"
            style={{ width: '140px' }}
            placeholder="Talla (ej. M)"
            value={newVariant.size}
            onChange={(e) => setNewVariant((p) => ({ ...p, size: e.target.value }))}
          />
          <input
            className="admin-variant-input"
            style={{ width: '100px' }}
            type="number"
            min="0"
            placeholder="Stock"
            value={newVariant.stock}
            onChange={(e) => setNewVariant((p) => ({ ...p, stock: e.target.value }))}
          />
          <span style={{ fontSize: '0.78rem', color: '#666' }}>
            (se añade al guardar)
          </span>
        </div>

        <button className="admin-save-btn" onClick={handleSave} disabled={saving}>
          {saving ? 'GUARDANDO...' : 'GUARDAR CAMBIOS'}
        </button>
      </div>
    </AdminLayout>
  )
}
