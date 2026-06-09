import { supabase } from './supabaseClient'
import { MOCK_SUBS } from '@/utils/mockData'

const USE_MOCK = !import.meta.env.VITE_SUPABASE_URL || import.meta.env.VITE_SUPABASE_URL.includes('placeholder')

export async function fetchSubscriptions(userId) {
  if (USE_MOCK) return { data: MOCK_SUBS, error: null }
  return supabase
    .from('subscriptions')
    .select('*, products(name, price, unit)')
    .eq('user_id', userId)
    .order('created_at', { ascending: false })
}

export async function updateSubscriptionStatus(id, status) {
  if (USE_MOCK) return { data: { id, status }, error: null }
  return supabase.from('subscriptions').update({ status }).eq('id', id).select().single()
}

export async function cancelSubscription(id) {
  return updateSubscriptionStatus(id, 'cancelled')
}
