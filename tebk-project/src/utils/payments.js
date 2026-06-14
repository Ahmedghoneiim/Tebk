export function getOrderTotal(order) {
  return Number(order?.total_price ?? order?.total ?? 0)
}

export function getPaymentMethodLabel(method) {
  if (method === 'card') return 'Paymob Card'
  if (method === 'cash') return 'Cash on Delivery'
  return 'Unknown'
}

export function getPaymentStatusLabel(status) {
  if (status === 'cash_pending') return 'COD Pending'
  if (status === 'paid') return 'Paid'
  if (status === 'failed') return 'Failed'
  return 'Pending'
}

export const PAYMENT_STATUS_BADGE = {
  pending: 'warning',
  cash_pending: 'warning',
  paid: 'success',
  failed: 'danger',
}
