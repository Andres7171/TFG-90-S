import { useState, useEffect, useMemo } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { getActiveProducts } from '../services/productService'
import '../styles/NinetyS.css'

const CATEGORIES = ['Todos', 'camisetas', 'pantalones', 'vestidos', 'accesorios', 'calzado']
const DECADES = ['Todos', '80', '90']

export function NinetyS() {
  const [products, setProducts] = useState([])
  const [search, setSearch] = useState('')
  const [category, setCategory] = useState('Todos')
  const [decade, setDecade] = useState('Todos')
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const navigate = useNavigate()

  useEffect(() => {
    getActiveProducts()
      .then((data) => setProducts(data.filter((p) => p.brand?.type === 'Propia')))
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false))
  }, [])

  const filtered = useMemo(() => {
    return products.filter(p => {
      if (search && !p.name.toLowerCase().includes(search.toLowerCase())) return false
      if (category !== 'Todos' && p.category !== category) return false
      if (decade !== 'Todos' && p.decade !== parseInt(decade)) return false
      return true
    })
  }, [products, search, category, decade])

  const hasActiveFilters =
    search !== '' || category !== 'Todos' || decade !== 'Todos'

  const resetFilters = () => {
    setSearch('')
    setCategory('Todos')
    setDecade('Todos')
  }

  if (loading)
    return (
      <div className="ninetys-page d-flex justify-content-center align-items-center min-vh-100">
        <p className="text-warning">Cargando...</p>
      </div>
    )

  if (error)
    return (
      <div className="ninetys-page d-flex justify-content-center align-items-center min-vh-100">
        <p className="text-danger">{error}</p>
      </div>
    )

  return (
    <div className="ninetys-page">
      <div className="container py-5">

        <h1 className="ninetys-title mb-2">90'S TYPE SHIT</h1>
        <p className="ninetys-subtitle mb-4">Nuestras piezas. Stock limitado.</p>

        <div className="mb-4">
          <input
            type="text"
            className="form-control ninetys-search"
            placeholder="Buscar..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>

        <div className="store-filters">
          <div className="filter-group">
            <span className="filter-label">CATEGORÍA</span>
            {CATEGORIES.map(c => (
              <button
                key={c}
                className={`filter-btn ${category === c ? 'active' : ''}`}
                onClick={() => setCategory(c)}
              >
                {c === 'Todos' ? 'Todas' : c.charAt(0).toUpperCase() + c.slice(1)}
              </button>
            ))}
          </div>

          <div className="filter-group">
            <span className="filter-label">DÉCADA</span>
            {DECADES.map(d => (
              <button
                key={d}
                className={`filter-btn ${decade === d ? 'active' : ''}`}
                onClick={() => setDecade(d)}
              >
                {d === 'Todos' ? 'Todas' : `Años ${d}`}
              </button>
            ))}
          </div>

          {hasActiveFilters && (
            <button className="filter-reset" onClick={resetFilters}>
              Limpiar filtros
            </button>
          )}
        </div>

        <p className="text-secondary mb-3" style={{ fontSize: '0.82rem' }}>
          {filtered.length} de {products.length} productos
        </p>

        {filtered.length === 0 && (
          <p className="text-secondary">
            {hasActiveFilters
              ? 'No hay productos que coincidan con los filtros.'
              : 'No se encontraron productos.'}
          </p>
        )}

        <div className="row g-4">
          {filtered.map((product, i) => (
            <div key={product.id} className="col-12 col-md-6 col-lg-4">
              <motion.div
                className="ninetys-card"
                onClick={() => navigate(`/producto/${product.id}`)}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.3, delay: i * 0.06 }}
              >
                <img
                  src={product.image_url || 'https://placehold.co/600x700/1a1a1a/FFD700?text=90S'}
                  alt={product.name}
                  className="ninetys-card-img"
                  onError={(e) => { e.target.src = 'https://placehold.co/600x700/1a1a1a/FFD700?text=90S' }}
                />
                <div className="ninetys-card-body">
                  <p className="ninetys-card-name">{product.name}</p>
                  {product.brand && (
                    <p className="ninetys-card-brand">{product.brand.name}</p>
                  )}
                  <p className="ninetys-card-price">{product.price} €</p>
                  <div className="ninetys-sizes">
                    {product.variants.map((v) => (
                      <span
                        key={v.id}
                        className={`ninetys-size-tag ${v.stock === 0 ? 'out' : ''}`}
                      >
                        {v.size}
                      </span>
                    ))}
                  </div>
                  <button className="ninetys-ver-btn mt-3">VER Y AÑADIR</button>
                </div>
              </motion.div>
            </div>
          ))}
        </div>

      </div>
    </div>
  )
}