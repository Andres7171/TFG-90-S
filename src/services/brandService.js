import { supabasePublic as supabase } from '../lib/supabase-public'

export async function getCollaborators() {
  const { data, error } = await supabase
    .from('brand')
    .select('*')
    .in('type', ['Freelancer', 'Empresa'])
    .eq('active', true)
    .order('name')

  if (error) throw error
  return data
}

export async function getCollaboratorById(id) {
  const { data, error } = await supabase
    .from('brand')
    .select('*')
    .eq('id', id)
    .single()

  if (error) throw error
  return data
}
