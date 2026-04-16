import { createContext, useContext, useEffect, useState } from 'react'
import { supabase } from '../lib/supabase-client'
import { loginUser, logoutUser, registerUser, getUserProfile } from '../services/authService'

const AuthContext = createContext({})

export function AuthProvider({ children }) {
  const [user, setUser]       = useState(null)
  const [profile, setProfile] = useState(null)
  const [loading, setLoading] = useState(true)

  async function loadProfile(authUser) {
    if (!authUser) { setProfile(null); return }
    try {
      const data = await getUserProfile(authUser.id)
      setProfile(data)
    } catch {
      setProfile(null)
    }
  }

  useEffect(() => {
    supabase.auth.getSession().then(async ({ data: { session } }) => {
      const authUser = session?.user ?? null
      setUser(authUser)
      await loadProfile(authUser)
      setLoading(false)
    })

    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (_event, session) => {
        const authUser = session?.user ?? null
        setUser(authUser)
        await loadProfile(authUser)
      }
    )

    return () => subscription.unsubscribe()
  }, [])

  const login = (email, password) => loginUser({ email, password })

  const register = (email, password, name, surname) =>
    registerUser({ email, password, name, surname })

  const logout = () => logoutUser()

  // isAdmin usa la columna rol de public.user, no app_metadata
  const isAdmin = profile?.rol === 'admin'

  return (
    <AuthContext.Provider value={{ user, profile, loading, login, register, logout, isAdmin }}>
      {!loading && children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => useContext(AuthContext)
