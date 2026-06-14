export function getOrderTotal(order) {
  return Number(order?.total_price ?? order?.total ?? 0)
}

export function getPaymentMethodLabel(method) {
  if (method === 'card') return 'Paymob Card'
  if (method === 'cash') return 'Cash on Delivery'
  return 'Unknown'
}

export function normalizePaymentStatus(status) {
  if (status === 'paid') return 'completed'
  if (status === 'failed') return 'failed'
  return 'pending'
}
