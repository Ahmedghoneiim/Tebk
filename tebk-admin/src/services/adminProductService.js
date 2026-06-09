import { supabase } from './supabaseClient'

export async function fetchAllProducts() {
  return supabase
    .from('products')
    .select('*')
    .order('title')
}

export async function updateProduct(id, updates) {
  return supabase
    .from('products')
    .update(updates)
    .eq('id', id)
    .select('*')
    .single()
}

export async function toggleProductFeatured(id, featured) {
  return updateProduct(id, { featured })
}
