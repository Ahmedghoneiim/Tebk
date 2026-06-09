import { supabase } from './supabaseClient'
import { MOCK_RETURNS } from '@/utils/mockData'

const USE_MOCK = !import.meta.env.VITE_SUPABASE_URL || import.meta.env.VITE_SUPABASE_URL.includes('placeholder')

export async function fetchReturns(userId) {
  if (USE_MOCK) return { data: MOCK_RETURNS, error: null }
  return supabase.from('returns').select('*').eq('user_id', userId).order('created_at', { ascending: false })
}

export async function createReturn(userId, { order_id, product, reason }) {
  if (USE_MOCK) return {
    data: {
      id: `r${Date.now()}`,
      order_id,
      product,
      reason,
      status: 'pending',
      created_at: new Date().toISOString(),
    },
    error: null,
  }
  return supabase
    .from('returns')
    .insert({ user_id: userId, order_id, product, reason, status: 'pending' })
    .select()
    .single()
}
