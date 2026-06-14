import { supabase } from './supabaseClient'
import { MOCK_BUNDLES } from '@/utils/mockData'

const USE_MOCK = !import.meta.env.VITE_SUPABASE_URL || import.meta.env.VITE_SUPABASE_URL.includes('placeholder')

export async function fetchBundles() {
  if (USE_MOCK) return { data: MOCK_BUNDLES, error: null }
  return supabase.from('bundles').select('*, bundle_items(*)')
}

export async function fetchBundleById(id) {
  if (USE_MOCK) {
    const b = MOCK_BUNDLES.find(b => b.id === id)
    return { data: b || null, error: b ? null : { message: 'Not found' } }
  }
  return supabase.from('bundles').select('*, bundle_items(*)').eq('id', id).single()
}
