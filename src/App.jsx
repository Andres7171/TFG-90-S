import { Routes, Route } from 'react-router-dom'
import { Header } from './components/Header'
import { Slider } from './components/Slider'
import { Login } from './pages/Login'
import { Register } from './pages/Register'

function App() {
  return (
    <Routes>
      <Route path="/" element={<><Header /><Slider /></>} />
      <Route path="/login"    element={<Login />} />
      <Route path="/register" element={<Register />} />
    </Routes>
  )
}

export default App
