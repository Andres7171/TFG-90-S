import { Routes, Route } from 'react-router-dom'
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
      <CartSidebar />
      <Routes>
        <Route path="/"                        element={<Layout><Home /></Layout>} />
        <Route path="/90s"                     element={<Layout><NinetyS /></Layout>} />
        <Route path="/blog"                    element={<Layout><Blog /></Layout>} />
        <Route path="/eventos"                 element={<Layout><Eventos /></Layout>} />
        <Route path="/marcas"                  element={<Layout><Marcas /></Layout>} />
        <Route path="/atencion-cliente"        element={<Layout><AtencionCliente /></Layout>} />
        <Route path="/colaboradores"           element={<Layout><Colaboradores /></Layout>} />
        <Route path="/colaboradores/:id"       element={<Layout><ColaboradorDetail /></Layout>} />
        <Route path="/producto/:id"            element={<Layout><ProductDetail /></Layout>} />
        <Route path="/login"                   element={<Login />} />
        <Route path="/register"               element={<Register />} />
      </Routes>
    </>
  )
}

export default App
