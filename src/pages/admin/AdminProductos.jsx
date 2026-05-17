import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { getAllProducts, deleteProduct } from '../../services/adminService'
import { AdminLayout } from './AdminLayout'
import { toast } from 'sonner'
import Swal from 'sweetalert2'

export function AdminProductos() {
  const [products, setProducts] = useState([])
  const [search, setSearch]     = useState('')
  const [loading, setLoading]   = useState(true)
  const [error, setError]       = useState(null)
  const navigate = useNavigate()

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

  useEffect(() => {
    getAllProducts()
      .then(setProducts)
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false))
  }, [])

  const filtered = products.filter((p) =>
    p.name.toLowerCase().includes(search.toLowerCase()) ||
    (p.brand?.name ?? '').toLowerCase().includes(search.toLowerCase())
  )

  return (
    <AdminLayout>
      <div className="admin-page-header">
        <h2 className="admin-page-title">Todos los Productos</h2>
        <div className="d-flex gap-2 align-items-center">
          <input
            className="admin-search"
            type="text"
            placeholder="Buscar por nombre o marca..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
          <button className="admin-add-btn" onClick={() => navigate('/admin/productos/nuevo')}>
            + Añadir
          </button>
        </div>
      </div>

      {loading && <p className="admin-loading">Cargando...</p>}
      {error   && <p className="admin-error">{error}</p>}

      {!loading && !error && (
        <div className="admin-table-wrap">
          <table className="admin-table">
            <thead>
              <tr>
                <th>Imagen</th>
                <th>Nombre</th>
                <th>Marca</th>
                <th>Precio</th>
                <th>Categoría</th>
                <th>Stock total</th>
                <th>Estado</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((p) => (
                <tr key={p.id} className={`admin-table-row${p.brand?.active === false ? ' brand-inactive' : ''}`}>
                  <td>
                    <img
                      src={p.image_url || 'https://placehold.co/52x52/1a1a1a/FFD700?text=RW'}
                      alt={p.name}
                      className="admin-table-img"
                      onError={(e) => { e.target.src = 'https://placehold.co/52x52/1a1a1a/FFD700?text=RW' }}
                    />
                  </td>
                  <td className="admin-table-name">{p.name}</td>
                  <td className="admin-table-cell">{p.brand?.name || '—'}</td>
                  <td className="admin-table-cell">{p.price} €</td>
                  <td className="admin-table-cell">{p.category}</td>
                  <td className="admin-table-cell">
                    {p.variants?.reduce((s, v) => s + v.stock, 0) ?? 0}
                  </td>
                  <td>
                    <span className={`admin-status-badge ${p.active ? 'active' : 'inactive'}`}>
                      {p.active ? 'Activo' : 'Inactivo'}
                    </span>
                    {p.brand?.active === false && (
                      <span className="admin-brand-off-badge">Marca inactiva</span>
                    )}
                  </td>
                  <td>
                    <div className="d-flex gap-2">
                      <button
                        className="admin-edit-btn"
                        onClick={() => navigate(`/admin/productos/${p.id}`)}
                      >
                        Editar
                      </button>
                      <button
                        className="admin-delete-btn"
                        onClick={() => handleDelete(p.id, p.name)}
                      >
                        Eliminar
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {filtered.length === 0 && (
            <p style={{ color: '#555', textAlign: 'center', padding: '2rem', fontSize: '0.85rem' }}>
              No se encontraron productos.
            </p>
          )}
        </div>
      )}
    </AdminLayout>
  )
}
