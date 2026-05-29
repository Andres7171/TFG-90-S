import { Link } from 'react-router-dom'
import '../styles/NotFound.css'

export function NotFound() {
  return (
    <div className="notfound-page">
      <h1 className="notfound-code">404</h1>
      <p className="notfound-text">Esta página no existe o ha sido movida.</p>
      <Link to="/" className="notfound-link">VOLVER AL INICIO</Link>
    </div>
  )
}