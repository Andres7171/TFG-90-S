import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { ChevronLeft } from 'lucide-react'
import { getProductById } from '../services/productService'
import { useAuth } from '../context/AuthContext'
import { useCart } from '../context/CartContext'
import { toast } from 'sonner'
import '../styles/ProductDetail.css'

export function ProductDetail() {
  const { id } = useParams()
  const navigate = useNavigate()
  const { user } = useAuth()
  const { addItem, items } = useCart()

  const [product, setProduct] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [selectedVariant, setSelectedVariant] = useState(null)
  const [adding, setAdding] = useState(false)

  useEffect(() => {
    getProductById(id)
      .then(setProduct)
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false))
  }, [id])

  // Cantidad de esta variante ya en el carrito
  const qtyInCart = selectedVariant
    ? items.filter(i => i.variant?.id === selectedVariant.id)
           .reduce((sum, i) => sum + i.quantity, 0)
    : 0

  const stockLeft = selectedVariant ? selectedVariant.stock - qtyInCart : 0
  const canAdd = selectedVariant && stockLeft > 0

  const handleAddToCart = async () => {
    if (!user) { navigate('/login'); return }
    if (!canAdd) {
      toast.error('No hay más stock disponible para esta talla.')
      return
    }
    setAdding(true)
    try {
      await addItem(selectedVariant.id)
      toast.success(`${product.name} (${selectedVariant.size}) añadido al carrito`)
    } catch (err) {
      const msg = err.message || ''
      if (msg.includes('Stock insuficiente')) {
        toast.error('Stock insuficiente para esta cantidad.')
      } else {
        toast.error('Error al añadir al carrito.')
      }
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

  const isOwn = product.brand?.type === 'Propia'
  const hasVariants = Array.isArray(product.variants) && product.variants.length > 0

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

            {product.description && (
              <p style={{ color: '#ccc', fontSize: '0.95rem', lineHeight: '1.6', marginBottom: '1.25rem' }}>
                {product.description}
              </p>
            )}

            {isOwn && hasVariants ? (
              <>
                <p className="product-detail-label">Talla</p>
                <div className="d-flex flex-wrap gap-2 mb-3">
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

                {selectedVariant && (
                  <p className={`product-stock-info ${stockLeft === 0 ? 'out' : stockLeft <= 3 ? 'low' : ''}`}>
                    {selectedVariant.stock === 0
                      ? 'Sin stock'
                      : stockLeft <= 0
                        ? 'Ya tienes el máximo en el carrito'
                        : stockLeft <= 3
                          ? `¡Solo quedan ${stockLeft} unidades!`
                          : `${stockLeft} unidades disponibles`
                    }
                    {qtyInCart > 0 && stockLeft > 0 && (
                      <span className="product-stock-cart"> · {qtyInCart} en tu carrito</span>
                    )}
                  </p>
                )}

                <button
                  className="add-cart-btn"
                  onClick={handleAddToCart}
                  disabled={adding || !canAdd}
                >
                  {adding ? 'AÑADIENDO...' : !selectedVariant ? 'SELECCIONA UNA TALLA' : !canAdd ? 'SIN STOCK' : 'AÑADIR AL CARRITO'}
                </button>
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