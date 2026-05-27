import { Routes, Route, Navigate } from 'react-router-dom'
import { Toaster } from 'sonner'
import { Header } from './components/Header'
import { Slider } from './components/Slider'
import { CartSidebar } from './components/CartSidebar'
import { Home } from './pages/Home'
import { Login } from './pages/Login'
import { Register } from './pages/Register'
import { NinetyS } from './pages/NinetyS'
import { Blog } from './pages/Blog'
import { Eventos } from './pages/Eventos'
import { Marcas } from './pages/Marcas'
import { AtencionCliente } from './pages/AtencionCliente'
import { ProductDetail } from './pages/ProductDetail'
import { Colaboradores } from './pages/Colaboradores'
import { ColaboradorDetail } from './pages/ColaboradorDetail'
import { AdminGuard } from './pages/admin/AdminGuard'
import { AdminProductos } from './pages/admin/AdminProductos'
import { AdminColaboradores } from './pages/admin/AdminColaboradores'
import { AdminProductoForm } from './pages/admin/AdminProductoForm'
import { AdminColabForm } from './pages/admin/AdminColabForm'
import { AdminMarcas } from './pages/admin/AdminMarcas'
import { AdminMarcaForm } from './pages/admin/AdminMarcaForm'
import { AdminPedidos } from './pages/admin/AdminPedidos'
import { AdminPedidoEdit } from './pages/admin/AdminPedidoEdit'

function Layout({ children }) {
  return (
    <>
      <Header />
      <Slider />
      {children}
    </>
  )
}

function App() {
  return (
    <>
      <Toaster
        position="bottom-right"
        theme="dark"
        toastOptions={{
          style: { background: '#111', border: '1px solid #333', color: '#e0e0e0' },
          success: { style: { borderColor: '#FFD700' } },
        }}
      />
      <CartSidebar />
      <Routes>
        <Route path="/" element={<Layout><Home /></Layout>} />
        <Route path="/90s" element={<Layout><NinetyS /></Layout>} />
        <Route path="/blog" element={<Layout><Blog /></Layout>} />
        <Route path="/eventos" element={<Layout><Eventos /></Layout>} />
        <Route path="/marcas" element={<Layout><Marcas /></Layout>} />
        <Route path="/atencion-cliente" element={<Layout><AtencionCliente /></Layout>} />
        <Route path="/colaboradores" element={<Layout><Colaboradores /></Layout>} />
        <Route path="/colaboradores/:id" element={<Layout><ColaboradorDetail /></Layout>} />
        <Route path="/producto/:id" element={<Layout><ProductDetail /></Layout>} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

        <Route path="/admin" element={<AdminGuard><Navigate to="/admin/productos" replace /></AdminGuard>} />
        <Route path="/admin/productos" element={<AdminGuard><AdminProductos /></AdminGuard>} />
        <Route path="/admin/productos/nuevo" element={<AdminGuard><AdminProductoForm /></AdminGuard>} />
        <Route path="/admin/productos/:id" element={<AdminGuard><AdminProductoForm /></AdminGuard>} />
        <Route path="/admin/90s" element={<AdminGuard><AdminProductos soloPropia /></AdminGuard>} />
        <Route path="/admin/90s/nuevo" element={<AdminGuard><AdminProductoForm soloPropia /></AdminGuard>} />
        <Route path="/admin/90s/:id" element={<AdminGuard><AdminProductoForm /></AdminGuard>} />
        <Route path="/admin/marcas" element={<AdminGuard><AdminMarcas /></AdminGuard>} />
        <Route path="/admin/marcas/nuevo" element={<AdminGuard><AdminMarcaForm /></AdminGuard>} />
        <Route path="/admin/marcas/:id" element={<AdminGuard><AdminMarcaForm /></AdminGuard>} />
        <Route path="/admin/colaboradores" element={<AdminGuard><AdminColaboradores /></AdminGuard>} />
        <Route path="/admin/colaboradores/nuevo" element={<AdminGuard><AdminColabForm /></AdminGuard>} />
        <Route path="/admin/colaboradores/:id" element={<AdminGuard><AdminColabForm /></AdminGuard>} />
        <Route path="/admin/pedidos" element={<AdminGuard><AdminPedidos /></AdminGuard>} />
        <Route path="/admin/pedidos/:id" element={<AdminGuard><AdminPedidoEdit /></AdminGuard>} />
      </Routes>
    </>
  )
}

export default App