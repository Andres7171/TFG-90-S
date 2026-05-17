import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { ChevronLeft, Plus, Trash2 } from 'lucide-react'
import { getAllBrands, createProduct } from '../../services/adminService'
import { AdminLayout } from './AdminLayout'
import { toast } from 'sonner'

const CATEGORIES = ['camisetas', 'pantalones', 'vestidos', 'accesorios', 'calzado', 'general']

export function AdminProductoCreate({ soloPropia = false }) {
  const navigate = useNavigate()

  const [brands, setBrands]   = useState([])
  const [saving, setSaving]   = useState(false)
  const [error, setError]     = useState(null)

  const [fields, setFields] = useState({
    name: '', price: '', description: '', image_url: '',
    category: 'general', clothing_type: '', decade: '',
    brand_id: '', active: true,
  })

  const [variants, setVariants] = useState([{ size: '', stock: '' }])

  useEffect(() => {
    getAllBrands().then((data) => {
      const filtered = soloPropia
        ? data.filter((b) => b.type === 'Propia')
        : data
      setBrands(filtered)
      if (filtered.length > 0)
        setFields((prev) => ({ ...prev, brand_id: filtered[0].id }))
    })
  }, [soloPropia])

  const handleField = (e) => {
    const { name, value, type, checked } = e.target
    setFields((prev) => ({ ...prev, [name]: type === 'checkbox' ? checked : value }))
  }

  const addVariantRow = () =>
    setVariants((prev) => [...prev, { size: '', stock: '' }])

  const removeVariantRow = (i) =>
    setVariants((prev) => prev.filter((_, idx) => idx !== i))

  const updateVariantRow = (i, field, value) =>
    setVariants((prev) => prev.map((v, idx) => idx === i ? { ...v, [field]: value } : v))

  const handleSave = async () => {
    if (!fields.name.trim()) { setError('El nombre es obligatorio.'); return }
    if (!fields.price)       { setError('El precio es obligatorio.'); return }
    if (!fields.brand_id)    { setError('Selecciona una marca.'); return }

    setSaving(true)
    setError(null)
    try {
      const newId = await createProduct(
        {
          name:         fields.name.trim(),
          price:        Number(fields.price),
          description:  fields.description || null,
          image_url:    fields.image_url   || null,
          category:     fields.category,
          clothing_type: fields.clothing_type || null,
          decade:       fields.decade ? Number(fields.decade) : null,
          brand_id:     fields.brand_id,
          active:       fields.active,
        },
        variants
      )
      toast.success('Producto creado correctamente')
      navigate(`/admin/productos/${newId}`, { replace: true })
    } catch (err) {
      setError(err.message)
      setSaving(false)
    }
  }

  return (
    <AdminLayout>
      <div className="admin-form-page">
        <button className="admin-back-btn" onClick={() => navigate(-1)}>
          <ChevronLeft size={15} /> Volver
        </button>

        <h2 className="admin-page-title" style={{ marginBottom: '1.75rem' }}>
          Nuevo Producto
        </h2>

        {error && <p className="admin-error" style={{ marginBottom: '1rem' }}>{error}</p>}

        <div className="admin-form-grid">

          <div className="admin-form-group">
            <label className="admin-label">Nombre *</label>
            <input className="admin-input" name="name" value={fields.name} onChange={handleField} />
          </div>

          <div className="admin-form-group">
            <label className="admin-label">Precio (€) *</label>
            <input className="admin-input" type="number" name="price" value={fields.price}
              onChange={handleField} min="0" step="0.01" />
          </div>

          <div className="admin-form-group">
            <label className="admin-label">Marca *</label>
            <select className="admin-select" name="brand_id" value={fields.brand_id} onChange={handleField}>
              {brands.map((b) => (
                <option key={b.id} value={b.id}>{b.name}</option>
              ))}
            </select>
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
            <input className="admin-input" name="clothing_type" value={fields.clothing_type}
              onChange={handleField} placeholder="ej. camiseta, sudadera..." />
          </div>

          <div className="admin-form-group">
            <label className="admin-label">Década</label>
            <input className="admin-input" type="number" name="decade" value={fields.decade}
              onChange={handleField} placeholder="ej. 1990" />
          </div>

          <div className="admin-form-group full-width">
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

        <p className="admin-section-title">Tallas y Stock</p>

        <table className="admin-variants-table">
          <thead>
            <tr>
              <th style={{ width: '45%' }}>Talla</th>
              <th style={{ width: '35%' }}>Stock</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {variants.map((v, i) => (
              <tr key={i}>
                <td>
                  <input
                    className="admin-variant-input"
                    placeholder="ej. M, L, 42..."
                    value={v.size}
                    onChange={(e) => updateVariantRow(i, 'size', e.target.value)}
                  />
                </td>
                <td>
                  <input
                    className="admin-variant-input"
                    type="number"
                    min="0"
                    placeholder="0"
                    value={v.stock}
                    onChange={(e) => updateVariantRow(i, 'stock', e.target.value)}
                  />
                </td>
                <td>
                  {variants.length > 1 && (
                    <button className="admin-delete-variant-btn" onClick={() => removeVariantRow(i)}>
                      <Trash2 size={13} />
                    </button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        <button className="admin-add-variant-btn" onClick={addVariantRow}
          style={{ marginTop: '0.5rem', display: 'inline-flex', alignItems: 'center', gap: '5px' }}>
          <Plus size={13} /> Añadir talla
        </button>

        <br />
        <button className="admin-save-btn" onClick={handleSave} disabled={saving}>
          {saving ? 'GUARDANDO...' : 'CREAR PRODUCTO'}
        </button>
      </div>
    </AdminLayout>
  )
}
