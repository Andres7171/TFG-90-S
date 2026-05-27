import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { getAllBrandsAdmin, toggleBrandActive } from '../../services/adminService'
import { AdminLayout } from './AdminLayout'
import { toast } from 'sonner'
import Swal from 'sweetalert2'

export function AdminMarcas() {
  const [brands, setBrands] = useState([])
  const [search, setSearch] = useState('')
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const navigate = useNavigate()

  useEffect(() => {
    getAllBrandsAdmin()
      .then(setBrands)
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false))
  }, [])

  const handleToggleActive = async (brand) => {
    const action = brand.active ? 'desactivar' : 'activar'
    const result = await Swal.fire({
      title: `¿${action.charAt(0).toUpperCase() + action.slice(1)} "${brand.name}"?`,
      text: brand.active
        ? 'Sus productos dejarán de ser visibles en el catálogo.'
        : 'Sus productos volverán a ser visibles en el catálogo.',
      icon: 'question',
      showCancelButton: true,
      confirmButtonText: `Sí, ${action}`,
      cancelButtonText: 'Cancelar',
      confirmButtonColor: brand.active ? '#ef4444' : '#22c55e',
      background: '#111',
      color: '#e0e0e0',
    })
    if (!result.isConfirmed) return
    try {
      await toggleBrandActive(brand.id, brand.active)
      setBrands((prev) =>
        prev.map(b => b.id === brand.id ? { ...b, active: !b.active } : b)
      )
      toast.success(`Marca ${brand.active ? 'desactivada' : 'activada'}.`)
    } catch (err) {
      toast.error(err.message)
    }
  }

  const filtered = brands.filter((b) =>
    b.name.toLowerCase().includes(search.toLowerCase()) ||
    b.type.toLowerCase().includes(search.toLowerCase())
  )

  return (
    <AdminLayout>
      <div className="admin-page-header">
        <h2 className="admin-page-title">Marcas</h2>
        <div className="d-flex gap-2 align-items-center">
          <input
            className="admin-search"
            type="text"
            placeholder="Buscar por nombre o tipo..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
          <button className="admin-add-btn" onClick={() => navigate('/admin/marcas/nuevo')}>
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
                <th>Tipo</th>
                <th>Email</th>
                <th>Contacto</th>
                <th>Web</th>
                <th>Estado</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((b) => (
                <tr key={b.id} className="admin-table-row">
                  <td>
                    <img
                      src={b.image_url || 'https://placehold.co/52x52/1a1a1a/FFD700?text=M'}
                      alt={b.name}
                      className="admin-table-img"
                      onError={(e) => { e.target.src = 'https://placehold.co/52x52/1a1a1a/FFD700?text=M' }}
                    />
                  </td>
                  <td className="admin-table-name">{b.name}</td>
                  <td className="admin-table-cell">
                    <span style={{
                      fontSize: '0.72rem',
                      border: '1px solid #333',
                      borderRadius: '3px',
                      padding: '1px 7px',
                      color: b.type === 'Propia' ? '#FFD700' : '#aaa',
                    }}>
                      {b.type}
                    </span>
                  </td>
                  <td className="admin-table-cell">{b.email    || '—'}</td>
                  <td className="admin-table-cell">{b.contact  || '—'}</td>
                  <td className="admin-table-cell">
                    {b.web_url
                      ? <a href={b.web_url} target="_blank" rel="noopener noreferrer"
                           style={{ color: '#FFD700', fontSize: '0.78rem' }}>Ver web</a>
                      : '—'
                    }
                  </td>
                  <td>
                    <button
                      className={`admin-status-toggle ${b.active ? 'active' : 'inactive'}`}
                      onClick={() => handleToggleActive(b)}
                    >
                      {b.active ? 'Activo' : 'Inactivo'}
                    </button>
                  </td>
                  <td>
                    <button
                      className="admin-edit-btn"
                      onClick={() => navigate(`/admin/marcas/${b.id}`)}
                    >
                      Editar
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {filtered.length === 0 && (
            <p style={{ color: '#555', textAlign: 'center', padding: '2rem', fontSize: '0.85rem' }}>
              No se encontraron marcas.
            </p>
          )}
        </div>
      )}
    </AdminLayout>
  )
}