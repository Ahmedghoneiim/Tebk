import { supabase } from './supabaseClient'
import { MOCK_BUNDLES } from '@/utils/mockData'

const USE_MOCK = !import.meta.env.VITE_SUPABASE_URL || import.meta.env.VITE_SUPABASE_URL.includes('placeholder')

function normalizeBundle(b) {
  return {
    ...b,
    name:           b.title || b.name || '',
    image_url:      b.image || null,
    bundle_price:   b.price ?? 0,
    original_price: null,
    savings_pct:    null,
    category:       null,
    items:          [],
  }
}

export async function fetchBundles() {
  if (USE_MOCK) return { data: MOCK_BUNDLES, error: null }
  const { data, error } = await supabase.from('bundle').select('*').order('id')
  if (error) throw error
  return { data: (data || []).map(normalizeBundle), error: null }
}

export async function fetchBundleById(id) {
  if (USE_MOCK) {
    const b = MOCK_BUNDLES.find(b => b.id === id)
    return { data: b || null, error: b ? null : { message: 'Not found' } }
  }
  const { data, error } = await supabase.from('bundle').select('*').eq('id', id).single()
  if (error) throw error
  return { data: data ? normalizeBundle(data) : null, error: null }
}
