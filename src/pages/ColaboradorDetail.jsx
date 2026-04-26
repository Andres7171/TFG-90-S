import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { ChevronLeft } from 'lucide-react'
import { getCollaboratorById } from '../services/brandService'
import '../styles/Colaboradores.css'

export function ColaboradorDetail() {
  const { id } = useParams()
  const navigate = useNavigate()
  const [brand, setBrand]   = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError]   = useState(null)

  useEffect(() => {
    getCollaboratorById(id)
      .then((data) => setBrand(data))
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false))
  }, [id])

  if (loading)
    return (
      <div className="colab-detail-page d-flex justify-content-center align-items-center min-vh-100">
        <p className="text-warning">Cargando...</p>
      </div>
    )

  if (error || !brand)
    return (
      <div className="colab-detail-page d-flex justify-content-center align-items-center min-vh-100">
        <p className="text-danger">{error || 'Colaborador no encontrado'}</p>
      </div>
    )

  return (
    <div className="colab-detail-page">
      <div className="container py-5">
        <button className="colab-back-btn" onClick={() => navigate('/colaboradores')}>
          <ChevronLeft size={16} /> Colaboradores
        </button>

        <div className="row g-4">
          <div className="col-12 col-md-5">
            <motion.img
              src={brand.image_url || 'https://placehold.co/500x480/1a1a1a/FFD700?text=BRAND'}
              alt={brand.name}
              className="colab-detail-img"
              initial={{ opacity: 0, x: -30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.4 }}
              onError={(e) => { e.target.src = 'https://placehold.co/500x480/1a1a1a/FFD700?text=BRAND' }}
            />
          </div>

          <motion.div
            className="col-12 col-md-7"
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.4 }}
          >
            <h1 className="colab-detail-name">{brand.name}</h1>
            <p className="colab-detail-type">{brand.type}</p>

            {brand.description && (
              <>
                <p className="colab-detail-label">Sobre nosotros</p>
                <p className="colab-detail-value">{brand.description}</p>
              </>
            )}

            {brand.email && (
              <>
                <p className="colab-detail-label">Email</p>
                <p className="colab-detail-value">{brand.email}</p>
              </>
            )}

            {brand.contact && (
              <>
                <p className="colab-detail-label">Contacto</p>
                <p className="colab-detail-value">{brand.contact}</p>
              </>
            )}

            {brand.web_url && (
              <a
                href={brand.web_url}
                target="_blank"
                rel="noopener noreferrer"
                className="colab-web-btn"
              >
                VISITAR WEB
              </a>
            )}
          </motion.div>
        </div>
      </div>
    </div>
  )
}
