import { supabase } from './supabaseClient'

export async function fetchReportData() {
  const [ordersRes, profilesRes, productsRes] = await Promise.all([
    supabase.from('orders').select('id, total, status, created_at, order_items(name, price, quantity)').order('created_at'),
    supabase.from('profiles').select('id, role, created_at'),
    supabase.from('products').select('id, name, stock, price'),
  ])

  return {
    data: {
      orders:   ordersRes.data   || [],
      profiles: profilesRes.data || [],
      products: productsRes.data || [],
    },
    error: ordersRes.error || profilesRes.error || productsRes.error || null,
  }
}
