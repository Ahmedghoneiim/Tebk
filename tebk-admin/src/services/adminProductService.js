import { supabase } from './supabaseClient'

export async function fetchAllProducts() {
  return supabase
    .from('products')
    .select('*, categories!category_id(name)')
    .order('name')
}

export async function updateProduct(id, updates) {
  return supabase
    .from('products')
    .update(updates)
    .eq('id', id)
    .select('*, categories!category_id(name)')
    .single()
}

export async function toggleProductFeatured(id, featured) {
  return updateProduct(id, { featured })
}
