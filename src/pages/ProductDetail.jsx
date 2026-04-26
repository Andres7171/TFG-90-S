import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { ChevronLeft } from 'lucide-react'
import { getProductById } from '../services/productService'
import { useAuth } from '../context/AuthContext'
import { useCart } from '../context/CartContext'
import '../styles/ProductDetail.css'

export function ProductDetail() {
  const { id } = useParams()
  const navigate = useNavigate()
  const { user } = useAuth()
  const { addItem } = useCart()

  const [product, setProduct]       = useState(null)
  const [loading, setLoading]       = useState(true)
  const [error, setError]           = useState(null)
  const [selectedVariant, setSelectedVariant] = useState(null)
  const [adding, setAdding]         = useState(false)
  const [added, setAdded]           = useState(false)

  useEffect(() => {
    getProductById(id)
      .then((data) => setProduct(data))
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false))
  }, [id])

  const handleAddToCart = async () => {
    if (!user) { navigate('/login'); return }
    if (!selectedVariant) return
    setAdding(true)
    try {
      await addItem(selectedVariant.id)
      setAdded(true)
      setTimeout(() => setAdded(false), 2000)
    } catch (err) {
      console.error(err)
    } finally {
      setAdding(false)
    }
  }

  if (loading)
    return (
      <div className="product-detail-page d-flex justify-content-center align-items-center min-vh-100">
        <p className="text-warning">Cargando...</p>
      </div>
    )

  if (error || !product)
    return (
      <div className="product-detail-page d-flex justify-content-center align-items-center min-vh-100">
        <p className="text-danger">{error || 'Producto no encontrado'}</p>
      </div>
    )

  const hasVariants = product.variants && product.variants.length > 0

  return (
    <div className="product-detail-page">
      <div className="container py-5">
        <button className="product-detail-back" onClick={() => navigate(-1)}>
          <ChevronLeft size={16} /> Volver
        </button>

        <div className="row g-4">
          <div className="col-12 col-md-6">
            <motion.img
              src={product.image_url || 'https://placehold.co/600x750/1a1a1a/FFD700?text=RW'}
              alt={product.name}
              className="product-detail-img"
              initial={{ opacity: 0, x: -30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.4 }}
              onError={(e) => { e.target.src = 'https://placehold.co/600x750/1a1a1a/FFD700?text=RW' }}
            />
          </div>

          <motion.div
            className="col-12 col-md-6"
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.4 }}
          >
            <h1 className="product-detail-name">{product.name}</h1>
            {product.brand && (
              <p className="product-detail-brand">{product.brand.name}</p>
            )}
            <p className="product-detail-price">{product.price} €</p>

            {hasVariants ? (
              <>
                <p className="product-detail-label">Talla</p>
                <div className="d-flex flex-wrap gap-2 mb-4">
                  {product.variants.map((v) => (
                    <button
                      key={v.id}
                      className={`size-btn ${selectedVariant?.id === v.id ? 'selected' : ''}`}
                      disabled={v.stock === 0}
                      onClick={() => setSelectedVariant(v)}
                    >
                      {v.size}
                    </button>
                  ))}
                </div>

                <button
                  className={`add-cart-btn ${added ? 'added' : ''}`}
                  onClick={handleAddToCart}
                  disabled={adding || !selectedVariant}
                >
                  {adding ? 'AÑADIENDO...' : added ? '¡AÑADIDO!' : 'AÑADIR AL CARRITO'}
                </button>
                {!selectedVariant && (
                  <p style={{ color: '#888', fontSize: '0.82rem', marginTop: '0.5rem' }}>
                    Selecciona una talla
                  </p>
                )}
              </>
            ) : (
              product.brand?.web_url && (
                <a
                  href={product.brand.web_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="web-brand-btn"
                >
                  VER EN WEB DE LA MARCA
                </a>
              )
            )}
          </motion.div>
        </div>
      </div>
    </div>
  )
}
