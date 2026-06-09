import { supabase } from '@/services/supabaseClient'

const USE_MOCK = !import.meta.env.VITE_SUPABASE_URL ||
  import.meta.env.VITE_SUPABASE_URL.includes('placeholder')

const MOCK_WELCOME = [
  {
    id: 'welcome',
    type: 'welcome',
    title: 'Welcome to TEBK!',
    message: 'Your account is ready. Browse medical supplies or let our AI assistant recommend what your clinic needs.',
    read: false,
    created_at: new Date().toISOString(),
  },
]

export async function fetchNotifications(userId) {
  if (USE_MOCK) return { data: MOCK_WELCOME, error: null }
  return supabase
    .from('notifications')
    .select('*')
    .eq('user_id', userId)
    .order('created_at', { ascending: false })
}

export async function insertNotification({ userId, type = 'info', title, message }) {
  if (USE_MOCK) return { error: null }
  return supabase.from('notifications').insert({ user_id: userId, type, title, message })
}

export async function markAllNotificationsRead(userId) {
  if (USE_MOCK) return { error: null }
  return supabase
    .from('notifications')
    .update({ read: true })
    .eq('user_id', userId)
    .eq('read', false)
}
