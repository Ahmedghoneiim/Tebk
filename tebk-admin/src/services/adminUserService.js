import { supabase } from './supabaseClient'

export async function fetchAllUsers() {
  const [profilesRes, ordersRes] = await Promise.all([
    supabase.from('profiles').select('*').order('created_at', { ascending: false }),
    supabase.from('orders').select('user_id'),
  ])

  if (profilesRes.error) return profilesRes
  const orderCountMap = {}
  if (ordersRes.data) {
    ordersRes.data.forEach(o => { orderCountMap[o.user_id] = (orderCountMap[o.user_id] || 0) + 1 })
  }

  return {
    data: (profilesRes.data || []).map(p => ({ ...p, order_count: orderCountMap[p.id] || 0 })),
    error: null,
  }
}

export async function approveUser(userId) {
  const { data, error } = await supabase
    .from('profiles')
    .update({ verified: true })
    .eq('id', userId)
    .select('id, verified')
    .single()
  return { data, error }
}
