import { supabase } from '../lib/supabase-client'

export async function registerUser({ email, password, name, surname }) {
  const { data: authData, error: authError } = await supabase.auth.signUp({ email, password })
  if (authError) throw authError

  const { error: dbError } = await supabase
    .from('user')
    .insert({
      id: authData.user.id,
      email,
      name,
      surname,
      rol: 'customer',
      created_date: new Date().toISOString(),
    })
  if (dbError) throw dbError

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
    .from('user')
    .select('*')
    .eq('id', userId)
    .single()
  if (error) throw error
  return data
}
