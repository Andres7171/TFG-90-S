import { useState, useEffect, useMemo } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { getActiveProducts } from '../services/productService'
import '../styles/Home.css'

const CATEGORIES = ['Todos', 'camisetas', 'pantalones', 'vestidos', 'accesorios', 'calzado']
const DECADES = ['Todos', '80', '90']

export function Home() {
  const [products, setProducts] = useState([])
  const [search, setSearch] = useState('')
  const [category, setCategory] = useState('Todos')
  const [decade, setDecade] = useState('Todos')
  const [brand, setBrand] = useState('Todos')
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const navigate = useNavigate()

  useEffect(() => {
    getActiveProducts()
      .then(setProducts)
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false))
  }, [])

  const brands = useMemo(() => {
    const unique = [...new Set(products.map(p => p.brand?.name).filter(Boolean))].sort()
    return ['Todos', ...unique]
  }, [products])

  const filtered = useMemo(() => {
    return products.filter(p => {
      if (search && !p.name.toLowerCase().includes(search.toLowerCase())) return false
      if (category !== 'Todos' && p.category !== category) return false
      if (decade !== 'Todos' && p.decade !== parseInt(decade)) return false
      if (brand !== 'Todos' && p.brand?.name !== brand) return false
      return true
    })
  }, [products, search, category, decade, brand])

  const hasActiveFilters =
    search !== '' || category !== 'Todos' || decade !== 'Todos' || brand !== 'Todos'

  const resetFilters = () => {
    setSearch('')
    setCategory('Todos')
    setDecade('Todos')
    setBrand('Todos')
  }

  if (loading)
    return (
      <div className="home-page d-flex justify-content-center align-items-center min-vh-100">
        <p className="text-warning">Cargando productos...</p>
      </div>
    )

  if (error)
    return (
      <div className="home-page d-flex justify-content-center align-items-center min-vh-100">
        <p className="text-danger">{error}</p>
      </div>
    )

  return (
    <div className="home-page">
      <div className="container py-4">

        <h2 className="home-title mb-4">PRODUCTOS</h2>

        <div className="mb-4">
          <input
            type="text"
            className="form-control home-search"
            placeholder="Buscar productos..."
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

          <div className="filter-group">
            <span className="filter-label">MARCA</span>
            {brands.map(b => (
              <button
                key={b}
                className={`filter-btn ${brand === b ? 'active' : ''}`}
                onClick={() => setBrand(b)}
              >
                {b === 'Todos' ? 'Todas' : b}
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

        <div className="row g-3">
          {filtered.map((product, i) => (
            <div key={product.id} className="col-6 col-md-4 col-lg-3">
              <motion.div
                className="card product-card h-100"
                onClick={() => navigate(`/producto/${product.id}`)}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.3, delay: i * 0.05 }}
              >
                <img
                  src={product.image_url || 'https://placehold.co/400x500/1a1a1a/FFD700?text=RW'}
                  alt={product.name}
                  className="product-card-img"
                  onError={(e) => { e.target.src = 'https://placehold.co/400x500/1a1a1a/FFD700?text=RW' }}
                />
                <div className="card-body d-flex flex-column gap-1">
                  <p className="product-name mb-0">{product.name}</p>
                  {product.brand && (
                    <p className="product-brand mb-0">{product.brand.name}</p>
                  )}
                  <p className="product-price mb-0">{product.price} €</p>
                </div>
              </motion.div>
            </div>
          ))}
        </div>

      </div>
    </div>
  )
}