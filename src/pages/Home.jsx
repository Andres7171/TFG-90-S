import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { getActiveProducts } from '../services/productService'
import '../styles/Home.css'

export function Home() {
  const [products, setProducts] = useState([])
  const [search, setSearch]     = useState('')
  const [loading, setLoading]   = useState(true)
  const [error, setError]       = useState(null)
  const navigate = useNavigate()

  useEffect(() => {
    getActiveProducts()
      .then((data) => setProducts(data))
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false))
  }, [])

  const filtered = products.filter((p) =>
    p.name.toLowerCase().includes(search.toLowerCase())
  )

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

        <div className="mb-4">
          <input
            type="text"
            className="form-control home-search"
            placeholder="Buscar productos..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>

        <h2 className="home-title mb-4">PRODUCTOS</h2>

        {filtered.length === 0 && (
          <p className="text-secondary">No se encontraron productos.</p>
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
