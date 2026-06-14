import { supabase } from './supabaseClient'
import { MOCK_INVENTORY } from '@/utils/mockData'

const USE_MOCK = !import.meta.env.VITE_SUPABASE_URL || import.meta.env.VITE_SUPABASE_URL.includes('placeholder')

export async function fetchInventory(userId) {
  if (USE_MOCK) return { data: MOCK_INVENTORY, error: null }
  return supabase.from('inventory_items').select('*').eq('user_id', userId).order('name')
}

export function exportInventoryCSV(items) {
  const headers = ['Product', 'Category', 'Current Stock', 'Min Threshold', 'Monthly Usage', 'Status']
  const rows = items.map(i => [
    `"${i.name}"`, i.category, i.current_stock, i.min_threshold,
    i.monthly_usage, i.current_stock <= i.min_threshold ? 'Low Stock' : 'OK',
  ])
  const csv = [headers, ...rows].map(r => r.join(',')).join('\n')
  const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' })
  const url  = URL.createObjectURL(blob)
  const a    = document.createElement('a')
  a.href = url; a.download = 'inventory.csv'; a.click()
  URL.revokeObjectURL(url)
}
