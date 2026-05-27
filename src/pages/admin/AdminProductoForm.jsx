import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { ChevronLeft, Plus, Trash2 } from 'lucide-react'
import {
  getAllBrands,
  getProductByIdAdmin,
  createProduct,
  updateProduct,
  updateVariant,
  addVariant,
  deleteVariant,
} from '../../services/adminService'
import { AdminLayout } from './AdminLayout'
import { toast } from 'sonner'

const CATEGORIES = ['camisetas', 'pantalones', 'vestidos', 'accesorios', 'calzado', 'general']

export function AdminProductoForm({ soloPropia = false }) {
  const { id } = useParams()
  const isEditing = !!id
  const navigate = useNavigate()

  const [brands, setBrands] = useState([])
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState(null)

  const [fields, setFields] = useState({
    name: '', price: '', description: '', image_url: '',
    category: 'general', clothing_type: '', decade: '',
    brand_id: '', active: true,
  })

  const [variants, setVariants] = useState([])
  const [toDelete, setToDelete] = useState([])
  const [newVariant, setNewVariant] = useState({ size: '', stock: '' })

  useEffect(() => {
    const load = async () => {
      try {
        // Cargar marcas siempre
        const allBrands = await getAllBrands()
        const filtered = soloPropia
          ? allBrands.filter((b) => b.type === 'Propia')
          : allBrands
        setBrands(filtered)

        if (isEditing) {
          const data = await getProductByIdAdmin(id)
          setFields({
            name: data.name ?? '',
            price: data.price ?? '',
            description: data.description ?? '',
            image_url: data.image_url ?? '',
            category: data.category ?? 'general',
            clothing_type: data.clothing_type  ?? '',
            decade: data.decade ?? '',
            active: data.active ?? true,
            brand_id: '',
          })
          setVariants(data.variants ?? [])
        } else {
          // Preseleccionar primera marca
          if (filtered.length > 0)
            setFields((prev) => ({ ...prev, brand_id: filtered[0].id }))
          setVariants([{ size: '', stock: '' }])
        }
      } catch (err) {
        setError(err.message)
      } finally {
        setLoading(false)
      }
    }
    load()
  }, [id, isEditing, soloPropia])

  const handleField = (e) => {
    const { name, value, type, checked } = e.target
    setFields((prev) => ({ ...prev, [name]: type === 'checkbox' ? checked : value }))
  }

  /* Variantes en modo crear */
  const addVariantRow = () =>
    setVariants((prev) => [...prev, { size: '', stock: '' }])

  const removeVariantRow = (i) =>
    setVariants((prev) => prev.filter((_, idx) => idx !== i))

  const updateVariantRow = (i, field, value) =>
    setVariants((prev) => prev.map((v, idx) => idx === i ? { ...v, [field]: value } : v))

  /* Variantes en modo editar */
  const handleVariantChange = (variantId, field, value) => {
    setVariants((prev) =>
      prev.map((v) => v.id === variantId ? { ...v, [field]: value } : v)
    )
  }

  const markForDeletion = (variantId) => {
    setVariants((prev) => prev.filter((v) => v.id !== variantId))
    setToDelete((prev) => [...prev, variantId])
  }

  /* Guardar */
  const handleSave = async () => {
    if (!fields.name.trim()) { setError('El nombre es obligatorio.'); return }
    if (!fields.price) { setError('El precio es obligatorio.'); return }
    if (!isEditing && !fields.brand_id) { setError('Selecciona una marca.'); return }

    setSaving(true)
    setError(null)
    try {
      if (isEditing) {
        await updateProduct(id, {
          name: fields.name,
          price: Number(fields.price),
          description: fields.description,
          image_url: fields.image_url || null,
          category: fields.category,
          clothing_type: fields.clothing_type || null,
          decade: fields.decade ? Number(fields.decade) : null,
          active: fields.active,
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
      } else {
        const newId = await createProduct(
          {
            name: fields.name.trim(),
            price: Number(fields.price),
            description: fields.description || null,
            image_url: fields.image_url   || null,
            category: fields.category,
            clothing_type: fields.clothing_type || null,
            decade: fields.decade ? Number(fields.decade) : null,
            brand_id: fields.brand_id,
            active: fields.active,
          },
          variants
        )
        toast.success('Producto creado correctamente')
        navigate(`/admin/productos/${newId}`, { replace: true })
      }
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
          {isEditing ? 'Editar Producto' : 'Nuevo Producto'}
        </h2>

        {error && <p className="admin-error" style={{ marginBottom: '1rem' }}>{error}</p>}

        <div className="admin-form-grid">

          <div className="admin-form-group">
            <label className="admin-label">Nombre {!isEditing && '*'}</label>
            <input className="admin-input" name="name" value={fields.name} onChange={handleField} />
          </div>

          <div className="admin-form-group">
            <label className="admin-label">Precio (€) {!isEditing && '*'}</label>
            <input className="admin-input" type="number" name="price" value={fields.price}
              onChange={handleField} min="0" step="0.01" />
          </div>

          {!isEditing && (
            <div className="admin-form-group">
              <label className="admin-label">Marca *</label>
              <select className="admin-select" name="brand_id" value={fields.brand_id} onChange={handleField}>
                {brands.map((b) => (
                  <option key={b.id} value={b.id}>{b.name}</option>
                ))}
              </select>
            </div>
          )}

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

        {isEditing ? (
          /* Variantes modo edición */
          <>
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
          </>
        ) : (
          /* Variantes modo creación */
          <>
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
          </>
        )}

        <br />
        <button className="admin-save-btn" onClick={handleSave} disabled={saving}>
          {saving ? 'GUARDANDO...' : isEditing ? 'GUARDAR CAMBIOS' : 'CREAR PRODUCTO'}
        </button>
      </div>
    </AdminLayout>
  )
}