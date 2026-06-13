import { supabase } from './supabaseClient'

const SINCE_7D = new Date(Date.now() - 7 * 86400000).toISOString()
const SINCE_24H = new Date(Date.now() - 86400000).toISOString()

export async function fetchAdminNotifications() {
  const [ordersRes, usersRes, stockRes] = await Promise.all([
    supabase
      .from('orders')
      .select('id, total, status, created_at, user_id')
      .gte('created_at', SINCE_7D)
      .order('created_at', { ascending: false })
      .limit(10),
    supabase
      .from('profiles')
      .select('id, full_name, role, created_at')
      .gte('created_at', SINCE_7D)
      .order('created_at', { ascending: false })
      .limit(10),
    supabase
      .from('products')
      .select('id, name, stock')
      .lt('stock', 20)
      .order('stock'),
  ])

  const recentOrders = ordersRes.data || []
  if (recentOrders.length > 0) {
    const userIds = [...new Set(recentOrders.map(o => o.user_id).filter(Boolean))]
    const { data: profiles } = await supabase
      .from('profiles')
      .select('id, full_name, clinic_name')
      .in('id', userIds)
    const profileMap = Object.fromEntries((profiles || []).map(p => [p.id, p]))
    recentOrders.forEach(o => { o.profile = profileMap[o.user_id] || null })
  }

  const notifications = []

  recentOrders.forEach(o => {
    const name = o.profile?.clinic_name || o.profile?.full_name || 'Unknown client'
    const isNew = o.created_at > SINCE_24H
    notifications.push({
      id:      `order-${o.id}`,
      type:    'order',
      title:   `Order ${o.status === 'pending' ? 'received' : o.status}`,
      message: `${name} — ${o.status} — EGP ${Number(o.total).toLocaleString()}`,
      read:    !isNew,
      date:    o.created_at,
    })
  })

  const recentUsers = usersRes.data || []
  recentUsers.forEach(u => {
    const isNew = u.created_at > SINCE_24H
    notifications.push({
      id:      `user-${u.id}`,
      type:    u.role === 'supplier' ? 'user' : 'welcome',
      title:   `New ${u.role} registered`,
      message: u.full_name || u.id,
      read:    !isNew,
      date:    u.created_at,
    })
  })

  const lowStock = stockRes.data || []
  lowStock.forEach(p => {
    notifications.push({
      id:      `stock-${p.id}`,
      type:    'stock',
      title:   p.stock === 0 ? 'Out of stock' : 'Low stock alert',
      message: `${p.name}: ${p.stock} units remaining`,
      read:    true,
      date:    new Date(Date.now() - 3600000).toISOString(),
    })
  })

  notifications.sort((a, b) => new Date(b.date) - new Date(a.date))

  return { data: notifications, error: ordersRes.error || usersRes.error || null }
}

export async function markAdminNotificationsRead(userId) {
  return supabase
    .from('notifications')
    .update({ read: true })
    .eq('user_id', userId)
    .eq('read', false)
}
