import { supabase } from './supabaseClient'

export async function fetchAllOrders() {
  // Step 1: fetch orders + order_items (no FK join to profiles — avoids FK constraint dependency)
  const { data: orders, error } = await supabase
    .from('orders')
    .select('*, order_items(id, name, price, quantity)')
    .order('created_at', { ascending: false })

  if (error) return { data: [], error }
  if (!orders?.length) return { data: [], error: null }

  // Step 2: fetch profiles for all unique user_ids and merge client-side
  const userIds = [...new Set(orders.map(o => o.user_id).filter(Boolean))]
  const { data: profiles } = await supabase
    .from('profiles')
    .select('id, full_name, email, clinic_name, role')
    .in('id', userIds)

  const profileMap = Object.fromEntries((profiles || []).map(p => [p.id, p]))

  return {
    data: orders.map(o => ({ ...o, profiles: profileMap[o.user_id] || null })),
    error: null,
  }
}

export async function updateOrderStatus(orderId, status) {
  const { data, error } = await supabase
    .from('orders')
    .update({ status })
    .eq('id', orderId)
    .select()
    .single()
  return { data, error }
}

export async function deleteOrder(orderId) {
  const { error } = await supabase
    .from('orders')
    .delete()
    .eq('id', orderId)
  return { error }
}
