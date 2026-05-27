import { createContext, useContext, useEffect, useState } from 'react'
import { supabase } from '../lib/supabase-client'
import { supabaseAdmin } from '../lib/supabase-admin'
import { loginUser, logoutUser, registerUser, getUserProfile } from '../services/authService'

const AuthContext = createContext({})

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)
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
    const fallback = setTimeout(() => setLoading(false), 4000)

    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        const authUser = session?.user ?? null
        setUser(authUser)
        await loadProfile(authUser)

        if (session) {
          supabaseAdmin.auth.setSession({
            access_token:  session.access_token,
            refresh_token: session.refresh_token,
          }).catch(() => {})
        }

        if (event === 'INITIAL_SESSION') {
          clearTimeout(fallback)
          setLoading(false)
        }
      }
    )

    return () => {
      subscription.unsubscribe()
      clearTimeout(fallback)
    }
  }, [])

  const login = (email, password) => loginUser({ email, password })

  const loginWithGoogle = async () => {
    const { error } = await supabase.auth.signInWithOAuth({
      provider: "google",
      options: {redirectTo: window.location.origin}
    })
    if (error) throw error
  }

  const register = (email, password, name, surname) =>
    registerUser({ email, password, name, surname })

  const logout = () => logoutUser()

  const isAdmin = profile?.rol === 'admin'
  const refreshProfile = () => loadProfile(user)

  return (
    <AuthContext.Provider value={{ user, profile, loading, login, loginWithGoogle, register, logout, isAdmin, refreshProfile }}>
      {!loading && children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => useContext(AuthContext)
