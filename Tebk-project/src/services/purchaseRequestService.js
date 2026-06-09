import { supabase } from './supabaseClient'
import { MOCK_PURCHASE_REQUESTS } from '@/utils/mockData'

const USE_MOCK = !import.meta.env.VITE_SUPABASE_URL || import.meta.env.VITE_SUPABASE_URL.includes('placeholder')

export async function fetchPurchaseRequests(userId) {
  if (USE_MOCK) return { data: MOCK_PURCHASE_REQUESTS, error: null }
  return supabase.from('purchase_requests').select('*').eq('user_id', userId).order('created_at', { ascending: false })
}

export async function createPurchaseRequest(userId, { title, description, total }) {
  if (USE_MOCK) return {
    data: {
      id: `pr${Date.now()}`,
      user_id: userId,
      title,
      description,
      total: Number(total) || 0,
      items: 0,
      status: 'pending',
      created_at: new Date().toISOString(),
    },
    error: null,
  }
  return supabase
    .from('purchase_requests')
    .insert({ user_id: userId, title, description, total: Number(total) || 0, status: 'pending' })
    .select()
    .single()
}
