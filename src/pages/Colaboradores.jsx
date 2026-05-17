import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { getCollaborators } from '../services/brandService'
import '../styles/Colaboradores.css'

export function Colaboradores() {
  const [brands, setBrands] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError]     = useState(null)
  const navigate = useNavigate()

  useEffect(() => {
    getCollaborators()
      .then(setBrands)
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false))
  }, [])

  if (loading)
    return (
      <div className="colab-page d-flex justify-content-center align-items-center min-vh-100">
        <p className="text-warning">Cargando colaboradores...</p>
      </div>
    )

  if (error)
    return (
      <div className="colab-page d-flex justify-content-center align-items-center min-vh-100">
        <p className="text-danger">{error}</p>
      </div>
    )

  return (
    <div className="colab-page">
      <div className="container py-5">
        <h1 className="colab-title mb-4">COLABORADORES</h1>

        {brands.length === 0 && (
          <p className="text-secondary">No hay colaboradores disponibles.</p>
        )}

        <div className="row g-4">
          {brands.map((brand, i) => (
            <div key={brand.id} className="col-12 col-md-6 col-lg-4">
              <motion.div
                className="card colab-card"
                onClick={() => navigate(`/colaboradores/${brand.id}`)}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.3, delay: i * 0.07 }}
              >
                <img
                  src={brand.image_url || 'https://placehold.co/400x220/1a1a1a/FFD700?text=BRAND'}
                  alt={brand.name}
                  className="colab-card-img"
                  onError={(e) => { e.target.src = 'https://placehold.co/400x220/1a1a1a/FFD700?text=BRAND' }}
                />
                <div className="card-body">
                  <p className="colab-card-name">{brand.name}</p>
                  <p className="colab-card-type">{brand.type}</p>
                </div>
              </motion.div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
