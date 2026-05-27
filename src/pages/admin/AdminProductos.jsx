import { useState, useEffect, useMemo } from 'react'
import { useNavigate } from 'react-router-dom'
import { getAllProducts, deleteProduct, toggleProductActive } from '../../services/adminService'
import { AdminLayout } from './AdminLayout'
import { toast } from 'sonner'
import Swal from 'sweetalert2'

const CATEGORIES = ['Todos', 'camisetas', 'pantalones', 'vestidos', 'accesorios', 'calzado', 'general']
const DECADES = ['Todos', '80', '90']
const STATUSES = ['Todos', 'Activo', 'Inactivo']

export function AdminProductos({ soloPropia = false }) {
  const [products, setProducts] = useState([])
  const [search, setSearch]     = useState('')
  const [category, setCategory] = useState('Todos')
  const [decade, setDecade] = useState('Todos')
  const [brand, setBrand] = useState('Todos')
  const [status, setStatus] = useState('Todos')
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const navigate = useNavigate()

  const basePath = soloPropia ? '/admin/90s' : '/admin/productos'
  const placeholder = soloPropia
    ? 'https://placehold.co/52x52/1a1a1a/FFD700?text=90S'
    : 'https://placehold.co/52x52/1a1a1a/FFD700?text=RW'

  const handleDelete = async (id, name) => {
    const result = await Swal.fire({
      title: `¿Eliminar "${name}"?`,
      text: 'Esta acción no se puede deshacer.',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Sí, eliminar',
      cancelButtonText: 'Cancelar',
      confirmButtonColor: '#ef4444',
      background: '#111',
      color: '#e0e0e0',
    })
    if (!result.isConfirmed) return
    try {
      await deleteProduct(id)
      setProducts((prev) => prev.filter((p) => p.id !== id))
      toast.success(`"${name}" eliminado`)
    } catch (err) {
      toast.error(err.message)
    }
  }

  const handleToggleActive = async (product) => {
    const action = product.active ? 'desactivar' : 'activar'
    const result = await Swal.fire({
      title: `¿${action.charAt(0).toUpperCase() + action.slice(1)} "${product.name}"?`,
      text: product.active
        ? 'Dejará de ser visible en el catálogo.'
        : 'Volverá a ser visible en el catálogo.',
      icon: 'question',
      showCancelButton: true,
      confirmButtonText: `Sí, ${action}`,
      cancelButtonText: 'Cancelar',
      confirmButtonColor: product.active ? '#ef4444' : '#22c55e',
      background: '#111',
      color: '#e0e0e0',
    })
    if (!result.isConfirmed) return
    try {
      await toggleProductActive(product.id, product.active)
      setProducts((prev) =>
        prev.map(p => p.id === product.id ? { ...p, active: !p.active } : p)
      )
      toast.success(`Producto ${product.active ? 'desactivado' : 'activado'}.`)
    } catch (err) {
      toast.error(err.message)
    }
  }

  useEffect(() => {
    getAllProducts()
      .then((data) =>
        soloPropia
          ? setProducts(data.filter((p) => p.brand?.type === 'Propia'))
          : setProducts(data)
      )
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false))
  }, [soloPropia])

  const brands = useMemo(() => {
    const unique = [...new Set(products.map(p => p.brand?.name).filter(Boolean))].sort()
    return ['Todos', ...unique]
  }, [products])

  const filtered = useMemo(() => {
    return products.filter(p => {
      if (search && !p.name.toLowerCase().includes(search.toLowerCase()) &&
          !(p.brand?.name ?? '').toLowerCase().includes(search.toLowerCase())) return false
      if (category !== 'Todos' && p.category !== category) return false
      if (decade !== 'Todos' && p.decade !== parseInt(decade)) return false
      if (brand !== 'Todos' && p.brand?.name !== brand) return false
      if (status === 'Activo' && !p.active) return false
      if (status === 'Inactivo' && p.active) return false
      return true
    })
  }, [products, search, category, decade, brand, status])

  const hasActiveFilters =
    search !== '' || category !== 'Todos' || decade !== 'Todos' || brand !== 'Todos' || status !== 'Todos'

  const resetFilters = () => {
    setSearch('')
    setCategory('Todos')
    setDecade('Todos')
    setBrand('Todos')
    setStatus('Todos')
  }

  return (
    <AdminLayout>
      <div className="admin-page-header">
        <h2 className="admin-page-title">
          {soloPropia ? "90'S Type Shit — Productos Propios" : 'Todos los Productos'}
        </h2>
        <button className="admin-add-btn" onClick={() => navigate(`${basePath}/nuevo`)}>
          + Añadir
        </button>
      </div>

      <div style={{ marginBottom: '0.75rem' }}>
        <input
          className="admin-search"
          type="text"
          placeholder={soloPropia ? 'Buscar por nombre...' : 'Buscar por nombre o marca...'}
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          style={{ width: '100%' }}
        />
      </div>

      <div className="store-filters" style={{ marginBottom: '1rem' }}>
        <div className="filter-group">
          <span className="filter-label">CATEGORÍA</span>
          {CATEGORIES.map(c => (
            <button key={c} className={`filter-btn ${category === c ? 'active' : ''}`}
              onClick={() => setCategory(c)}>
              {c === 'Todos' ? 'Todas' : c.charAt(0).toUpperCase() + c.slice(1)}
            </button>
          ))}
        </div>
        <div className="filter-group">
          <span className="filter-label">DÉCADA</span>
          {DECADES.map(d => (
            <button key={d} className={`filter-btn ${decade === d ? 'active' : ''}`}
              onClick={() => setDecade(d)}>
              {d === 'Todos' ? 'Todas' : `Años ${d}`}
            </button>
          ))}
        </div>
        {!soloPropia && (
          <div className="filter-group">
            <span className="filter-label">MARCA</span>
            {brands.map(b => (
              <button key={b} className={`filter-btn ${brand === b ? 'active' : ''}`}
                onClick={() => setBrand(b)}>
                {b === 'Todos' ? 'Todas' : b}
              </button>
            ))}
          </div>
        )}
        <div className="filter-group">
          <span className="filter-label">ESTADO</span>
          {STATUSES.map(s => (
            <button key={s} className={`filter-btn ${status === s ? 'active' : ''}`}
              onClick={() => setStatus(s)}>
              {s}
            </button>
          ))}
        </div>
        {hasActiveFilters && (
          <button className="filter-reset" onClick={resetFilters}>Limpiar filtros</button>
        )}
      </div>

      <p style={{ color: '#666', fontSize: '0.8rem', marginBottom: '0.75rem' }}>
        {filtered.length} de {products.length} productos
      </p>

      {loading && <p className="admin-loading">Cargando...</p>}
      {error   && <p className="admin-error">{error}</p>}

      {!loading && !error && (
        <div className="admin-table-wrap">
          <table className="admin-table">
            <thead>
              <tr>
                <th>Imagen</th>
                <th>Nombre</th>
                {!soloPropia && <th>Marca</th>}
                <th>Precio</th>
                <th>Categoría</th>
                <th>{soloPropia ? 'Tallas / Stock' : 'Stock total'}</th>
                <th>Estado</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((p) => (
                <tr key={p.id} className={`admin-table-row${!p.active ? ' row-inactive' : ''}`}>
                  <td>
                    <img src={p.image_url || placeholder} alt={p.name}
                      className="admin-table-img"
                      onError={(e) => { e.target.src = placeholder }} />
                  </td>
                  <td className="admin-table-name">{p.name}</td>
                  {!soloPropia && <td className="admin-table-cell">{p.brand?.name || '—'}</td>}
                  <td className="admin-table-cell">{p.price} €</td>
                  <td className="admin-table-cell">{p.category}</td>
                  <td className="admin-table-cell">
                    {soloPropia ? (
                      <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
                        {p.variants?.map((v) => (
                          <span key={v.id} style={{
                            fontSize: '0.7rem', border: '1px solid #333',
                            borderRadius: '3px', padding: '1px 6px',
                            color: v.stock === 0 ? '#555' : '#ccc',
                          }}>{v.size}: {v.stock}</span>
                        ))}
                      </div>
                    ) : (
                      p.variants?.reduce((s, v) => s + v.stock, 0) ?? 0
                    )}
                  </td>
                  <td>
                    <button
                      className={`admin-status-toggle ${p.active ? 'active' : 'inactive'}`}
                      onClick={() => handleToggleActive(p)}
                    >
                      {p.active ? 'Activo' : 'Inactivo'}
                    </button>
                  </td>
                  <td>
                    <div className="d-flex gap-2">
                      <button className="admin-edit-btn"
                        onClick={() => navigate(`${basePath}/${p.id}`)}>Editar</button>
                      <button className="admin-delete-btn"
                        onClick={() => handleDelete(p.id, p.name)}>Eliminar</button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {filtered.length === 0 && (
            <p style={{ color: '#555', textAlign: 'center', padding: '2rem', fontSize: '0.85rem' }}>
              {hasActiveFilters
                ? 'No hay productos que coincidan con los filtros.'
                : soloPropia ? 'No se encontraron productos propios.' : 'No se encontraron productos.'}
            </p>
          )}
        </div>
      )}
    </AdminLayout>
  )
}