import { supabase } from './supabaseClient'

export async function createOrder(userId, orderData, items) {
  const paymentMethod = orderData.paymentMethod === 'card' ? 'card' : 'cash'
  const paymentStatus = paymentMethod === 'card' ? 'pending' : 'cash_pending'

  const { data: order, error } = await supabase
    .from('orders')
    .insert({
      user_id:        userId,
      status:         'pending',
      total:          orderData.total,
      total_price:    orderData.total,
      payment_method: paymentMethod,
      payment_status: paymentStatus,
      shipping_name:  orderData.fullName,
      shipping_email: orderData.email,
      shipping_phone: orderData.phone,
      shipping_address: orderData.address,
      shipping_city:  orderData.city,
      notes:          orderData.notes || null,
    })
    .select()
    .single()

  if (error) return { error }

  const orderItems = items.map((item) => ({
    order_id:   order.id,
    product_id: item.id,
    name:       item.name,
    price:      item.price,
    quantity:   item.quantity,
    image_url:  item.image_url || null,
  }))

  const { error: itemsError } = await supabase.from('order_items').insert(orderItems)
  if (itemsError) return { error: itemsError }

  return { data: order }
}

export async function createPaymobCardPayment(orderId) {
  const { data: { session } } = await supabase.auth.getSession()
  const token = session?.access_token

  const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'https://YOUR_SUPABASE_PROJECT_ID.supabase.co'

  try {
    const res = await fetch(`${supabaseUrl}/functions/v1/create-paymob-intention`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token || ''}`,
      },
      body: JSON.stringify({ orderId }),
    })

    const body = await res.json().catch(() => ({}))
    if (!res.ok) {
      return { error: { message: body.error || 'Server error', details: body.details } }
    }
    return { data: body }
  } catch (err) {
    return { error: { message: err.message || 'Network error' } }
  }
}


export async function fetchOrders(userId) {
  return supabase
    .from('orders')
    .select('*, order_items(*)')
    .eq('user_id', userId)
    .order('created_at', { ascending: false })
}

export async function fetchOrderById(orderId, userId) {
  return supabase
    .from('orders')
    .select('*, order_items(*)')
    .eq('id', orderId)
    .eq('user_id', userId)
    .single()
}

export async function fetchAllOrders() {
  return supabase
    .from('orders')
    .select('*, order_items(*), profiles(full_name, email)')
    .order('created_at', { ascending: false })
}

export async function updateOrderStatus(orderId, status) {
  return supabase.from('orders').update({ status }).eq('id', orderId)
}
