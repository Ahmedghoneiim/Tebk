import { supabase } from './supabaseClient'

export async function createOrder(userId, orderData, items) {
  const { data: order, error } = await supabase
    .from('orders')
    .insert({
      user_id:          userId,
      status:           'pending',
      payment_status:   'pending',
      total:            orderData.total,
      total_price:      orderData.total,
      shipping_name:    orderData.fullName,
      shipping_email:   orderData.email,
      shipping_phone:   orderData.phone,
      shipping_address: orderData.address,
      shipping_city:    orderData.city,
      payment_method:   orderData.paymentMethod,
      notes:            orderData.notes || null,
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
