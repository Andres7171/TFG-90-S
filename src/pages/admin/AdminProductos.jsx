import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { getAllProducts, deleteProduct } from '../../services/adminService'
import { AdminLayout } from './AdminLayout'
import { toast } from 'sonner'
import Swal from 'sweetalert2'

export function AdminProductos({ soloPropia = false }) {
  const [products, setProducts] = useState([])
  const [search, setSearch]     = useState('')
  const [loading, setLoading]   = useState(true)
  const [error, setError]       = useState(null)
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

  const filtered = products.filter((p) => {
    const q = search.toLowerCase()
    return (
      p.name.toLowerCase().includes(q) ||
      (!soloPropia && (p.brand?.name ?? '').toLowerCase().includes(q))
    )
  })

  return (
    <AdminLayout>
      <div className="admin-page-header">
        <h2 className="admin-page-title">
          {soloPropia ? "90'S Type Shit — Productos Propios" : 'Todos los Productos'}
        </h2>
        <div className="d-flex gap-2 align-items-center">
          <input
            className="admin-search"
            type="text"
            placeholder={soloPropia ? 'Buscar por nombre...' : 'Buscar por nombre o marca...'}
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
          <button className="admin-add-btn" onClick={() => navigate(`${basePath}/nuevo`)}>
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
                <tr key={p.id} className={`admin-table-row${p.brand?.active === false ? ' brand-inactive' : ''}`}>
                  <td>
                    <img
                      src={p.image_url || placeholder}
                      alt={p.name}
                      className="admin-table-img"
                      onError={(e) => { e.target.src = placeholder }}
                    />
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
                            fontSize: '0.7rem',
                            border: '1px solid #333',
                            borderRadius: '3px',
                            padding: '1px 6px',
                            color: v.stock === 0 ? '#555' : '#ccc',
                          }}>
                            {v.size}: {v.stock}
                          </span>
                        ))}
                      </div>
                    ) : (
                      p.variants?.reduce((s, v) => s + v.stock, 0) ?? 0
                    )}
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
                        onClick={() => navigate(`${basePath}/${p.id}`)}
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
              {soloPropia ? 'No se encontraron productos propios.' : 'No se encontraron productos.'}
            </p>
          )}
        </div>
      )}
    </AdminLayout>
  )
}