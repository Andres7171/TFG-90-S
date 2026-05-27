import { supabase } from '../lib/supabase-client'

export async function registerUser({ email, password, name, surname }) {
  const { data: authData, error } = await supabase.auth.signUp({
    email,
    password,
    options: { data: { name } }
  })
  if (error) throw error

  if (authData.user && surname) {
    await supabase
      .from('profile')
      .update({ surname })
      .eq('id', authData.user.id)
  }

  return authData.user
}

export async function loginUser({ email, password }) {
  const { data, error } = await supabase.auth.signInWithPassword({ email, password })
  if (error) throw error
  return data.user
}

export async function logoutUser() {
  const { error } = await supabase.auth.signOut()
  if (error) throw error
}

export async function getUserProfile(userId) {
  const { data, error } = await supabase
    .from('profile')
    .select('*')
    .eq('id', userId)
    .single()
  if (error) throw error
  return data
}

export async function updateUserProfile(userId, fields) {
  const { error } = await supabase
    .from("profile")
    .update(fields)
    .eq("id", userId)
  if (error) throw error
}
