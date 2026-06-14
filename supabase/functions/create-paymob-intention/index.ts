import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
}

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

function splitName(fullName = '') {
  const parts = fullName.trim().split(/\s+/).filter(Boolean)
  return {
    firstName: parts[0] || 'TEBK',
    lastName: parts.slice(1).join(' ') || 'Customer',
  }
}

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') return new Response('ok', { headers: corsHeaders })
  if (req.method !== 'POST') return jsonResponse({ error: 'Method not allowed' }, 405)

  try {
    const supabaseUrl = requireEnv('SUPABASE_URL')
    const serviceRoleKey = requireEnv('SUPABASE_SERVICE_ROLE_KEY')
    const paymobSecretKey = requireEnv('PAYMOB_SECRET_KEY')
    const paymobPublicKey = requireEnv('PAYMOB_PUBLIC_KEY')
    const cardIntegrationId = Number(requireEnv('PAYMOB_CARD_INTEGRATION_ID'))
    const currency = Deno.env.get('PAYMOB_CURRENCY') || 'EGP'
    const paymobBaseUrl = Deno.env.get('PAYMOB_BASE_URL') || 'https://accept.paymob.com'
    const siteUrl = Deno.env.get('SITE_URL') || req.headers.get('origin') || 'http://localhost:5173'

    const authHeader = req.headers.get('Authorization') || ''
    const token = authHeader.replace('Bearer ', '')
    if (!token) return jsonResponse({ error: 'Unauthorized' }, 401)

    const supabase = createClient(supabaseUrl, serviceRoleKey, {
      auth: { persistSession: false },
    })

    const { data: authData, error: authError } = await supabase.auth.getUser(token)
    if (authError || !authData.user) return jsonResponse({ error: 'Unauthorized' }, 401)

    const { orderId } = await req.json()
    if (!orderId) return jsonResponse({ error: 'orderId is required' }, 400)

    const { data: order, error: orderError } = await supabase
      .from('orders')
      .select('*, order_items(name, price, quantity)')
      .eq('id', orderId)
      .single()

    if (orderError || !order) return jsonResponse({ error: 'Order not found' }, 404)
    if (order.user_id !== authData.user.id) return jsonResponse({ error: 'Forbidden' }, 403)
    if (order.payment_method !== 'card') return jsonResponse({ error: 'Order is not a card payment' }, 400)
    if (!['pending', 'failed'].includes(order.payment_status)) {
      return jsonResponse({ error: 'Order cannot start a new card payment' }, 400)
    }

    const amount = Number(order.total_price ?? order.total ?? 0)
    if (!Number.isFinite(amount) || amount <= 0) {
      return jsonResponse({ error: 'Order total is invalid' }, 400)
    }

    const { firstName, lastName } = splitName(order.shipping_name || authData.user.user_metadata?.full_name)
    const callbackBase = `${supabaseUrl}/functions/v1/paymob-webhook`
    
    // 1. Map order items to Paymob format
    const mappedItems = (order.order_items || []).map((item: any) => ({
      name: item.name,
      amount: Math.round(Number(item.price) * 100),
      quantity: Number(item.quantity),
      description: item.name,
    }))

    // 2. Calculate the total sum of mapped items
    const itemsSum = mappedItems.reduce((sum, item) => sum + (item.amount * item.quantity), 0)
    const totalCents = Math.round(amount * 100)

    // 3. Handle difference (Shipping, Taxes, Discounts)
    if (totalCents > itemsSum) {
      mappedItems.push({
        name: 'Shipping & Delivery',
        amount: totalCents - itemsSum,
        quantity: 1,
        description: 'Shipping and delivery fee',
      })
    } else if (itemsSum > totalCents) {
      mappedItems.push({
        name: 'Discounts & Adjustments',
        amount: totalCents - itemsSum, // negative amount representing the discount
        quantity: 1,
        description: 'Applied discount',
      })
    }

    const body = {
      amount: totalCents,
      currency,
      payment_methods: [cardIntegrationId],
      special_reference: `tebk-${order.id}`,
      notification_url: callbackBase,
      redirection_url: `${siteUrl}/order-success/${order.id}`,
      billing_data: {
        first_name: firstName,
        last_name: lastName,
        email: order.shipping_email || authData.user.email || 'customer@tebk.local',
        phone_number: order.shipping_phone || '01000000000',
        apartment: 'NA',
        floor: 'NA',
        street: order.shipping_address || 'NA',
        building: 'NA',
        shipping_method: 'PKG',
        postal_code: '00000',
        city: order.shipping_city || 'Cairo',
        country: 'EG',
        state: order.shipping_city || 'Cairo',
      },
      items: mappedItems,
      extras: {
        supabase_order_id: order.id,
        user_id: order.user_id,
      },
    }

    const paymobRes = await fetch(`${paymobBaseUrl}/v1/intention/`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Token ${paymobSecretKey}`,
      },
      body: JSON.stringify(body),
    })

    const rawResponseText = await paymobRes.text()
    let intention: any = {}
    
    try {
      intention = JSON.parse(rawResponseText)
    } catch {
      intention = { raw_error: rawResponseText }
    }

    if (!paymobRes.ok) {
      console.error("Paymob API Error:", {
        status: paymobRes.status,
        payloadSent: body,
        responseReceived: intention
      });

      return jsonResponse({
        error: 'Paymob intention creation failed',
        paymob_status: paymobRes.status,
        details: intention,
      }, 502)
    }

    const clientSecret = intention.client_secret || intention.payment_keys?.[0]?.key
    if (!clientSecret) {
      return jsonResponse({ error: 'Paymob response did not include a client secret' }, 502)
    }

    await supabase
      .from('orders')
      .update({
        payment_status: 'pending',
        paymob_intention_id: intention.id || intention.intention_id || null,
        paymob_order_id: intention.order?.id?.toString() || intention.order_id?.toString() || null,
      })
      .eq('id', order.id)

    const checkoutUrl = `${paymobBaseUrl}/unifiedcheckout/?publicKey=${encodeURIComponent(paymobPublicKey)}&clientSecret=${encodeURIComponent(clientSecret)}`

    return jsonResponse({ checkoutUrl, clientSecret })
  } catch (error) {
    return jsonResponse({ error: error.message || 'Unexpected error' }, 500)
  }
})