import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
  'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
}

const hmacFields = [
  'amount_cents',
  'created_at',
  'currency',
  'error_occured',
  'has_parent_transaction',
  'id',
  'integration_id',
  'is_3d_secure',
  'is_auth',
  'is_capture',
  'is_refunded',
  'is_standalone_payment',
  'is_voided',
  'order.id',
  'owner',
  'pending',
  'source_data.pan',
  'source_data.sub_type',
  'source_data.type',
  'success',
]

function jsonResponse(body: Record<string, unknown>, status = 200) {
  return new Response(JSON.stringify(body), {
    status,
    headers: { ...corsHeaders, 'Content-Type': 'application/json' },
  })
}

function requireEnv(name: string) {
  const value = Deno.env.get(name)
  if (!value) throw new Error(`Missing ${name}`)
  return value.trim().replace(/^['"]|['"]$/g, '')
}

function getPathValue(source: Record<string, unknown>, path: string) {
  return path.split('.').reduce<unknown>((value, key) => {
    if (value && typeof value === 'object' && key in value) {
      return (value as Record<string, unknown>)[key]
    }
    return ''
  }, source)
}

function stringifyHmacValue(value: unknown) {
  if (value === null || value === undefined) return ''
  if (typeof value === 'boolean') return value ? 'true' : 'false'
  return String(value)
}

async function sha512Hmac(secret: string, message: string) {
  const key = await crypto.subtle.importKey(
    'raw',
    new TextEncoder().encode(secret),
    { name: 'HMAC', hash: 'SHA-512' },
    false,
    ['sign'],
  )
  const signature = await crypto.subtle.sign('HMAC', key, new TextEncoder().encode(message))
  return Array.from(new Uint8Array(signature))
    .map((byte) => byte.toString(16).padStart(2, '0'))
    .join('')
}

function timingSafeEqual(a: string, b: string) {
  if (a.length !== b.length) return false
  let result = 0
  for (let i = 0; i < a.length; i += 1) result |= a.charCodeAt(i) ^ b.charCodeAt(i)
  return result === 0
}

function normalizeQueryPayload(url: URL) {
  const payload: Record<string, unknown> = {}
  url.searchParams.forEach((value, key) => {
    if (key === 'hmac') return
    if (key.includes('.')) {
      const [parent, child] = key.split('.')
      payload[parent] = { ...((payload[parent] as Record<string, unknown>) || {}), [child]: value }
    } else {
      payload[key] = value
    }
  })
  return payload
}

function extractSupabaseOrderId(tx: Record<string, unknown>) {
  const order = tx.order as Record<string, unknown> | undefined
  const extras = (tx.extras || order?.extras) as Record<string, unknown> | undefined
  const candidates = [
    extras?.supabase_order_id,
    tx.supabase_order_id,
    tx.special_reference,
    order?.special_reference,
    order?.merchant_order_id,
  ].filter(Boolean).map(String)

  for (const value of candidates) {
    if (value.startsWith('tebk-')) return value.slice(5)
    if (/^[0-9a-f-]{36}$/i.test(value)) return value
  }
  return null
}

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') return new Response('ok', { headers: corsHeaders })

  try {
    const url = new URL(req.url)
    const body = req.method === 'POST' ? await req.json().catch(() => ({})) : normalizeQueryPayload(url)
    const receivedHmac = url.searchParams.get('hmac') || body.hmac || ''
    if (!receivedHmac) return jsonResponse({ error: 'Missing HMAC' }, 400)

    const tx = (body.obj || body) as Record<string, unknown>
    const hmacMessage = hmacFields.map((field) => stringifyHmacValue(getPathValue(tx, field))).join('')
    const expectedHmac = await sha512Hmac(requireEnv('PAYMOB_HMAC_SECRET'), hmacMessage)

    if (!timingSafeEqual(expectedHmac.toLowerCase(), receivedHmac.toLowerCase())) {
      return jsonResponse({ error: 'Invalid HMAC' }, 401)
    }

    const supabase = createClient(requireEnv('SUPABASE_URL'), requireEnv('SUPABASE_SERVICE_ROLE_KEY'), {
      auth: { persistSession: false },
    })

    const supabaseOrderId = extractSupabaseOrderId(tx)
    const paymobOrderId = stringifyHmacValue(getPathValue(tx, 'order.id'))
    const transactionId = stringifyHmacValue(tx.id)
    const isPaid = tx.success === true || tx.success === 'true'
    const paymentStatus = isPaid ? 'paid' : 'failed'
    const orderStatus = isPaid ? 'processing' : 'cancelled'

    if (!supabaseOrderId && (!paymobOrderId || paymobOrderId === '')) {
      return jsonResponse({ error: 'Missing both supabase_order_id and paymob_order_id' }, 400)
    }

    let query = supabase.from('orders').update({
      payment_status: paymentStatus,
      status: orderStatus,
      paymob_transaction_id: transactionId || null,
      paymob_order_id: paymobOrderId || null,
    })

    query = supabaseOrderId
      ? query.eq('id', supabaseOrderId)
      : query.eq('paymob_order_id', paymobOrderId)

    const { error } = await query
    if (error) return jsonResponse({ error: error.message }, 500)

    return jsonResponse({ received: true, payment_status: paymentStatus, status: orderStatus })
  } catch (error) {
    return jsonResponse({ error: error.message || 'Unexpected error' }, 500)
  }
})
