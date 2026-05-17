import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { getAllCollaborators, deleteBrand } from '../../services/adminService'
import { AdminLayout } from './AdminLayout'
import { toast } from 'sonner'
import Swal from 'sweetalert2'

export function AdminColaboradores() {
  const [brands, setBrands]   = useState([])
  const [search, setSearch]   = useState('')
  const [loading, setLoading] = useState(true)
  const [error, setError]     = useState(null)
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
      await deleteBrand(id)
      setBrands((prev) => prev.filter((b) => b.id !== id))
      toast.success(`"${name}" eliminado`)
    } catch (err) {
      toast.error(err.message)
    }
  }

  useEffect(() => {
    getAllCollaborators()
      .then(setBrands)
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false))
  }, [])

  const filtered = brands.filter((b) =>
    b.name.toLowerCase().includes(search.toLowerCase()) ||
    b.type.toLowerCase().includes(search.toLowerCase())
  )

  return (
    <AdminLayout>
      <div className="admin-page-header">
        <h2 className="admin-page-title">Colaboradores</h2>
        <div className="d-flex gap-2 align-items-center">
          <input
            className="admin-search"
            type="text"
            placeholder="Buscar por nombre o tipo..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
          <button className="admin-add-btn" onClick={() => navigate('/admin/colaboradores/nuevo')}>
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
                      src={b.image_url || 'https://placehold.co/52x52/1a1a1a/FFD700?text=B'}
                      alt={b.name}
                      className="admin-table-img"
                      onError={(e) => { e.target.src = 'https://placehold.co/52x52/1a1a1a/FFD700?text=B' }}
                    />
                  </td>
                  <td className="admin-table-name">{b.name}</td>
                  <td className="admin-table-cell">{b.type}</td>
                  <td className="admin-table-cell">{b.email || '—'}</td>
                  <td className="admin-table-cell">
                    {b.web_url
                      ? <a href={b.web_url} target="_blank" rel="noopener noreferrer"
                           style={{ color: '#FFD700', fontSize: '0.78rem' }}>Ver web</a>
                      : '—'
                    }
                  </td>
                  <td>
                    <span className={`admin-status-badge ${b.active ? 'active' : 'inactive'}`}>
                      {b.active ? 'Activo' : 'Inactivo'}
                    </span>
                  </td>
                  <td>
                    <div className="d-flex gap-2">
                      <button
                        className="admin-edit-btn"
                        onClick={() => navigate(`/admin/colaboradores/${b.id}`)}
                      >
                        Editar
                      </button>
                      <button
                        className="admin-delete-btn"
                        onClick={() => handleDelete(b.id, b.name)}
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
              No se encontraron colaboradores.
            </p>
          )}
        </div>
      )}
    </AdminLayout>
  )
}
