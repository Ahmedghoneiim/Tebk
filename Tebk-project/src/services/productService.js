import { supabase } from './supabaseClient'
import { MOCK_PRODUCTS, MOCK_CATEGORIES } from '@/utils/mockData'

const USE_MOCK = !import.meta.env.VITE_SUPABASE_URL || import.meta.env.VITE_SUPABASE_URL.includes('placeholder')

function normalizeProduct(p) {
  return {
    ...p,
    name:      p.title || p.name || '',
    category:  p.categories?.slug || p.categories?.name || p.category || p.category_id || '',
    stock:     p.stock  ?? 0,
    unit:      p.unit   || 'piece',
    featured:  p.featured ?? false,
    image_url: p.image_url || p.image || null,
  }
}

export async function fetchProducts({ category, search, sortBy, priceRange } = {}) {
  if (USE_MOCK) {
    let results = [...MOCK_PRODUCTS]
    if (category && category !== 'all') results = results.filter(p => p.category === category)
    if (search) results = results.filter(p => p.name.toLowerCase().includes(search.toLowerCase()))
    if (priceRange) results = results.filter(p => p.price >= priceRange[0] && p.price <= priceRange[1])
    if (sortBy === 'price_asc')  results.sort((a, b) => a.price - b.price)
    if (sortBy === 'price_desc') results.sort((a, b) => b.price - a.price)
    if (sortBy === 'name_asc')   results.sort((a, b) => a.name.localeCompare(b.name))
    return { data: results, error: null }
  }

  let query = supabase.from('products').select('*, categories(id, name, slug)')
  if (category && category !== 'all') query = query.eq('category_id', category)
  if (search) query = query.ilike('title', `%${search}%`)
  if (priceRange) query = query.gte('price', priceRange[0]).lte('price', priceRange[1])
  if (sortBy === 'price_asc')  query = query.order('price', { ascending: true })
  if (sortBy === 'price_desc') query = query.order('price', { ascending: false })
  if (sortBy === 'name_asc')   query = query.order('title', { ascending: true })
  const { data, error } = await query
  if (error) throw error
  return { data: (data || []).map(normalizeProduct), error: null }
}

export async function fetchProductById(id) {
  if (USE_MOCK) {
    const product = MOCK_PRODUCTS.find(p => p.id === id)
    return { data: product || null, error: product ? null : { message: 'Not found' } }
  }
  const { data, error } = await supabase.from('products').select('*').eq('id', id).single()
  if (error) throw error
  return { data: data ? normalizeProduct(data) : null, error: null }
}

export async function fetchCategories() {
  if (USE_MOCK) return { data: MOCK_CATEGORIES, error: null }
  const { data, error } = await supabase.from('categories').select('*').order('name')
  if (error) return { data: MOCK_CATEGORIES, error: null }
  return { data: data || [], error: null }
}

export async function fetchFeaturedProducts() {
  if (USE_MOCK) return { data: MOCK_PRODUCTS.filter(p => p.featured), error: null }
  // .eq('featured', true) — uncomment when featured column is added to products table
  const { data, error } = await supabase.from('products').select('*').order('id', { ascending: false }).limit(8)
  if (error) throw error
  return { data: (data || []).map(normalizeProduct), error: null }
}

const MOCK_VARIANTS = {
  p1: [
    { id: 'v1', product_id: 'p1', size: 'S',  price: 110, stock: 100, image: null },
    { id: 'v2', product_id: 'p1', size: 'M',  price: 120, stock: 50,  image: null },
    { id: 'v3', product_id: 'p1', size: 'L',  price: 130, stock: 0,   image: null },
  ],
  p4: [
    { id: 'v4', product_id: 'p4', size: '5ml',  price: 95,  stock: 200, image: null },
    { id: 'v5', product_id: 'p4', size: '10ml', price: 145, stock: 80,  image: null },
  ],
}

export async function fetchProductVariants(productId) {
  if (USE_MOCK) return { data: MOCK_VARIANTS[productId] || [], error: null }
  const { data, error } = await supabase
    .from('product-variants')
    .select('id, product_id, size, price, quantity')
    .eq('product_id', parseInt(productId, 10))
    .order('id')
  if (error) return { data: [], error }
  return { data: (data || []).map(v => ({ ...v, stock: v.quantity ?? 0 })), error: null }
}
