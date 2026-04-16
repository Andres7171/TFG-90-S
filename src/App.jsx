import { Routes, Route } from 'react-router-dom'
import { Header } from './components/Header'
import { Slider } from './components/Slider'
import { Home } from './pages/Home'
import { Login } from './pages/Login'
import { Register } from './pages/Register'
import { NinetyS } from './pages/NinetyS'
import { Blog } from './pages/Blog'
import { Eventos } from './pages/Eventos'
import { Marcas } from './pages/Marcas'
import { AtencionCliente } from './pages/AtencionCliente'

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
    <Routes>
      <Route path="/"                 element={<Layout><Home /></Layout>} />
      <Route path="/90s"              element={<Layout><NinetyS /></Layout>} />
      <Route path="/blog"             element={<Layout><Blog /></Layout>} />
      <Route path="/eventos"          element={<Layout><Eventos /></Layout>} />
      <Route path="/marcas"           element={<Layout><Marcas /></Layout>} />
      <Route path="/atencion-cliente" element={<Layout><AtencionCliente /></Layout>} />
      <Route path="/login"            element={<Login />} />
      <Route path="/register"         element={<Register />} />
    </Routes>
  )
}

export default App
