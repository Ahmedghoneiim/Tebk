# Tebk Paymob Payment Integration & Database Migration Guide

This document contains a complete guide and reference for the Paymob Payment Integration and database changes applied to the **Tebk** project. It serves as a blueprint to replicate, modify, or merge the payment flow into any other branch or sibling repository.

---

## 🛠️ Architecture Overview

The system uses a secure checkout flow:
1. **Frontend (React)** creates a pending order in the Supabase database.
2. If the user selects **Card Payment**, the frontend calls the Deno Edge Function `create-paymob-intention`.
3. The Edge Function contacts **Paymob**, registers the billing/shipping details, retrieves the payment key, and generates a **Unified Checkout URL**.
4. The client is redirected to Paymob's secure payment page.
5. Once the transaction completes, Paymob triggers a **Secure Webhook** (secured via SHA-512 HMAC validation) targeting the `paymob-webhook` Edge Function.
6. The webhook updates the database order status to `paid` (success) or `failed`.
7. **Frontend Order Success Page** polls the database every 2 seconds if the payment status is pending, dynamically showing the success/fail screen once the webhook responds.

---

## 1️⃣ Database Schema & Migration (`supabase/migrations/`)

Apply this SQL migration script in your Supabase SQL Editor to update the database schema, add constraints, and secure tables using Row Level Security (RLS) policies.

```sql
create extension if not exists "pgcrypto";

-- Create updated_at trigger helper if it does not exist
create or replace function public.set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

-- Alter orders table to support Paymob transaction state
alter table public.orders add column if not exists total_price numeric(12, 2) default 0;
alter table public.orders add column if not exists total numeric(12, 2) default 0;
alter table public.orders add column if not exists payment_method text default 'cod';
alter table public.orders add column if not exists payment_status text default 'cod_pending';
alter table public.orders add column if not exists status text default 'pending';
alter table public.orders add column if not exists shipping_name text;
alter table public.orders add column if not exists shipping_email text;
alter table public.orders add column if not exists shipping_phone text;
alter table public.orders add column if not exists shipping_address text;
alter table public.orders add column if not exists shipping_city text;
alter table public.orders add column if not exists notes text;
alter table public.orders add column if not exists paymob_order_id text;
alter table public.orders add column if not exists paymob_transaction_id text;
alter table public.orders add column if not exists paymob_intention_id text;
alter table public.orders add column if not exists paymob_payment_key text;

-- Add triggers to sync updated_at
drop trigger if exists orders_set_updated_at on public.orders;
create trigger orders_set_updated_at
before update on public.orders
for each row execute function public.set_updated_at();

-- Add constraints for payment method and payment status
do $$
begin
  if not exists (
    select 1 from pg_constraint where conname = 'orders_payment_method_check'
  ) then
    alter table public.orders
      add constraint orders_payment_method_check
      check (payment_method in ('card', 'cod'));
  end if;

  if not exists (
    select 1 from pg_constraint where conname = 'orders_payment_status_check'
  ) then
    alter table public.orders
      add constraint orders_payment_status_check
      check (payment_status in ('pending', 'paid', 'failed', 'cod_pending'));
  end if;
end $$;

-- Enable Row Level Security (RLS)
alter table public.orders enable row level security;
alter table public.order_items enable row level security;

-- Setup RLS Policies for orders
drop policy if exists "Users can read own orders" on public.orders;
create policy "Users can read own orders"
on public.orders for select
using (auth.uid() = user_id);

drop policy if exists "Users can create own orders" on public.orders;
create policy "Users can create own orders"
on public.orders for insert
with check (
  auth.uid() = user_id
  and (
    (payment_method = 'card' and payment_status = 'pending' and status = 'pending')
    or
    (payment_method = 'cod' and payment_status = 'cod_pending' and status = 'pending')
  )
);

drop policy if exists "Admins can read all orders" on public.orders;
create policy "Admins can read all orders"
on public.orders for select
using (
  exists (
    select 1 from public.profiles
    where profiles.id = auth.uid()
      and profiles.role = 'admin'
  )
);

drop policy if exists "Admins can update all orders" on public.orders;
create policy "Admins can update all orders"
on public.orders for update
using (
  exists (
    select 1 from public.profiles
    where profiles.id = auth.uid()
      and profiles.role = 'admin'
  )
)
with check (
  exists (
    select 1 from public.profiles
    where profiles.id = auth.uid()
      and profiles.role = 'admin'
  )
);

-- Setup RLS Policies for order_items
drop policy if exists "Users can read own order items" on public.order_items;
create policy "Users can read own order items"
on public.order_items for select
using (
  exists (
    select 1 from public.orders
    where orders.id = order_items.order_id
      and orders.user_id = auth.uid()
  )
);

drop policy if exists "Users can create own order items" on public.order_items;
create policy "Users can create own order items"
on public.order_items for insert
with check (
  exists (
    select 1 from public.orders
    where orders.id = order_items.order_id
      and orders.user_id = auth.uid()
  )
);

drop policy if exists "Admins can read all order items" on public.order_items;
create policy "Admins can read all order items"
on public.order_items for select
using (
  exists (
    select 1 from public.profiles
    where profiles.id = auth.uid()
      and profiles.role = 'admin'
  )
);
```

---

## 2️⃣ Supabase Edge Functions (`supabase/functions/`)

We implemented two main Deno functions. Deploy them to your Supabase project.

### 🔌 A. `create-paymob-intention`
Handles the integration with Paymob to start a payment session.

**File:** `supabase/functions/create-paymob-intention/index.ts`
```typescript
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
    const body = {
      amount: Math.round(amount * 100),
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
      items: (order.order_items || []).map((item: any) => ({
        name: item.name,
        amount: Math.round(Number(item.price) * 100),
        quantity: Number(item.quantity),
        description: item.name,
      })),
      extras: {
        supabase_order_id: order.id,
        user_id: order.user_id,
      },
    }

    const paymobRes = await fetch(`${paymobBaseUrl}/v1/intention/`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Token ${paymobSecretKey}`,
      },
      body: JSON.stringify(body),
    })

    const intention = await paymobRes.json().catch(() => ({}))
    if (!paymobRes.ok) {
      await supabase.from('orders').delete().eq('id', order.id)
      return jsonResponse({
        error: 'Paymob intention creation failed',
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
```

---

### 🔔 B. `paymob-webhook`
Handles Paymob callback webhooks securely.

**File:** `supabase/functions/paymob-webhook/index.ts`
```typescript
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
```

---

## 3️⃣ Client App Integration (`Tebk-project`)

Apply these updates in the client codebase:

### 📄 A. Payments Utility (`Tebk-project/src/utils/payments.js`)
Helper methods to translate payment keys and statuses in the UI.
```javascript
export function getOrderTotal(order) {
  return Number(order?.total_price ?? order?.total ?? 0)
}

export function getPaymentMethodLabel(method) {
  if (method === 'card') return 'Paymob Card'
  if (method === 'cod') return 'Cash on Delivery'
  return 'Unknown'
}

export function getPaymentStatusLabel(status) {
  if (status === 'cod_pending') return 'COD Pending'
  if (status === 'paid') return 'Paid'
  if (status === 'failed') return 'Failed'
  return 'Pending'
}

export const PAYMENT_STATUS_BADGE = {
  pending: 'warning',
  cod_pending: 'warning',
  paid: 'success',
  failed: 'danger',
}
```

### 📄 B. Order Service (`Tebk-project/src/services/orderService.js`)
Integrates the fetch and post parameters with Supabase & Edge functions.
```javascript
import { supabase } from './supabaseClient'

export async function createOrder(userId, orderData, items) {
  const paymentMethod = orderData.paymentMethod === 'card' ? 'card' : 'cod'
  const paymentStatus = paymentMethod === 'card' ? 'pending' : 'cod_pending'

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

  try {
    const res = await fetch(`https://YOUR_SUPABASE_PROJECT_ID.supabase.co/functions/v1/create-paymob-intention`, {
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
```

### 📄 C. Checkout Page (`Tebk-project/src/features/cart/pages/CheckoutPage.jsx`)
In `CheckoutPage.jsx`, handle the form submission dynamically. If `paymentMethod === 'card'`, request the checkout session and trigger a redirect:
```javascript
const onSubmit = async (data) => {
  setLoading(true)
  const { data: order, error } = await createOrder(user.id, { ...data, total }, items)
  if (error) {
    setLoading(false)
    toast.error(error.message || 'Failed to place order.')
    return
  }

  if (data.paymentMethod === 'card') {
    const { data: paymob, error: paymobError } = await createPaymobCardPayment(order.id)
    setLoading(false)
    if (paymobError) {
      toast.error(paymobError.message || 'Could not start Paymob payment.')
      return
    }
    clearCart()
    window.location.assign(paymob.checkoutUrl) // Redirects user directly to Paymob Checkout
    return
  }

  setLoading(false)
  clearCart()
  navigate(`/order-success/${order?.id}`)
}
```

### 📄 D. Order Success Page (`Tebk-project/src/features/cart/pages/OrderSuccessPage.jsx`)
Use React Query's `refetchInterval` to poll the database status until the payment is marked `paid` or `failed` by the Webhook.
```javascript
const { data, isLoading } = useQuery({
  queryKey: ['orderSuccess', orderId, user?.id],
  queryFn: () => fetchOrderById(orderId, user.id),
  enabled: !!orderId && !!user?.id,
  refetchInterval: (query) => {
    const order = query.state.data?.data
    // Polling every 2 seconds if the checkout session is pending card payment
    return order?.payment_method === 'card' && order?.payment_status === 'pending' ? 2000 : false
  },
})
```

### 📄 E. Checkout Validator Schema (`Tebk-project/src/utils/validators.js`)
Ensure the `checkoutSchema` validates the new payment options:
```javascript
export const checkoutSchema = z.object({
  fullName:      fullNameField,
  email:         emailField,
  phone:         phoneField,
  address:       z.string().min(5, 'Please enter a valid address.'),
  city:          z.string().min(2, 'Please enter a city.'),
  notes:         z.string().optional(),
  paymentMethod: z.enum(['card', 'cod']).default('cod'), // Supported values are card & cod
})
```

### 📄 F. Internationalization Keys (`Tebk-project/src/i18n/`)
Update translation files (`ar.json` / `en.json`) to reflect payment option keys:
**Arabic (`ar.json`):**
```json
"checkout": {
  "placing": "جارٍ تأكيد الطلب…",
  "cash_on_delivery": "الدفع عند الاستلام",
  "cash_desc": "ادفع عند استلام طلبك",
  "card_payment": "الدفع بالبطاقة",
  "card_desc": "Visa / MasterCard عبر Paymob"
}
```
**English (`en.json`):**
```json
"checkout": {
  "placing": "Placing Order…",
  "cash_on_delivery": "Cash on Delivery",
  "cash_desc": "Pay when you receive your order",
  "card_payment": "Card Payment",
  "card_desc": "Visa / MasterCard via Paymob"
}
```

---

## 4️⃣ Admin Panel Integration (`tebk-admin`)

Apply these updates in the admin dashboard:

### 📄 A. Payments Admin Utility (`tebk-admin/src/lib/payments.js`)
```javascript
export function getOrderTotal(order) {
  return Number(order?.total_price ?? order?.total ?? 0)
}

export function getPaymentMethodLabel(method) {
  if (method === 'card') return 'Paymob Card'
  if (method === 'cod') return 'Cash on Delivery'
  return 'Unknown'
}

export function normalizePaymentStatus(status) {
  if (status === 'paid') return 'completed'
  if (status === 'failed') return 'failed'
  return 'pending'
}
```

### 📄 B. Admin Payments Page (`tebk-admin/src/pages/Payments.jsx`)
Fetch order lists and generate total Revenue, Pending transactions count, and Failed payments counts using `normalizePaymentStatus`:
```javascript
const payments = useMemo(() => (raw?.data || []).map(o => ({
  id:       `PAY-${o.id.toString().slice(0, 6).toUpperCase()}`,
  orderId:  o.id,
  customer: o.profiles?.clinic_name || o.profiles?.full_name || o.shipping_name || 'Unknown',
  email:    o.profiles?.email || '',
  amount:   getOrderTotal(o),
  method:   getPaymentMethodLabel(o.payment_method),
  status:   normalizePaymentStatus(o.payment_status),
  date:     o.created_at,
})), [raw?.data])

const revenue = payments.filter(p => p.status === 'completed').reduce((s, p) => s + p.amount, 0)
const pending = payments.filter(p => p.status === 'pending').length
const failed  = payments.filter(p => p.status === 'failed').length
```

---

## 5️⃣ Client App Inline Admin Dashboard (`Tebk-project`)

If your version of the main customer application features an inline admin interface, apply this page to fetch and list the transactions.

### 📄 A. Inline Admin Payments (`Tebk-project/src/features/admin/pages/AdminPayments.jsx`)
```javascript
import { useMemo } from 'react'
import { useQuery } from '@tanstack/react-query'
import { CreditCard, TrendingUp, Clock, CheckCircle, XCircle } from 'lucide-react'
import { usePageTitle } from '@/hooks/usePageTitle'
import { StatCard } from '@/components/shared/StatCard'
import { fetchAllOrders } from '@/services/orderService'
import { formatCurrency, formatDate } from '@/utils/format'
import { getOrderTotal, getPaymentMethodLabel } from '@/utils/payments'

const STATUS = {
  completed: { label: 'Completed', cls: 'bg-emerald-50 text-emerald-700', icon: CheckCircle },
  pending:   { label: 'Pending',   cls: 'bg-amber-50 text-amber-700',     icon: Clock },
  failed:    { label: 'Failed',    cls: 'bg-rose-50 text-rose-700',       icon: XCircle },
}

export function AdminPayments() {
  usePageTitle('Payments - Admin')

  const { data } = useQuery({ queryKey: ['admin-orders'], queryFn: fetchAllOrders })

  const payments = useMemo(() => (data?.data || []).map(order => ({
    id:       `PAY-${order.id.slice(0, 8).toUpperCase()}`,
    customer: order.shipping_name || order.profiles?.full_name || 'Unknown',
    amount:   getOrderTotal(order),
    method:   getPaymentMethodLabel(order.payment_method),
    status:   order.payment_status === 'paid'
      ? 'completed'
      : order.payment_status === 'failed'
        ? 'failed'
        : 'pending',
    date: order.created_at,
  })), [data?.data])

  const total   = payments.reduce((s, p) => p.status === 'completed' ? s + p.amount : s, 0)
  const pending = payments.filter(p => p.status === 'pending').length
  const failed  = payments.filter(p => p.status === 'failed').length

  return (
    <div className="space-y-6">
      <div className="flex items-start justify-between">
        <h1 className="section-title">Payments</h1>
        <span className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold bg-secondary/10 text-secondary border border-secondary/20">
          <CreditCard className="w-3.5 h-3.5" /> Paymob Card + COD
        </span>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <StatCard title="Revenue Collected" value={formatCurrency(total)} icon={TrendingUp} trend={8} />
        <StatCard title="Pending"           value={pending}              icon={Clock} />
        <StatCard title="Failed"            value={failed}               icon={XCircle} />
      </div>

      <div className="card p-0 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-gray-50 text-xs text-muted font-semibold uppercase tracking-wide">
              <tr>
                <th className="px-6 py-3 text-left">Payment ID</th>
                <th className="px-6 py-3 text-left">Customer</th>
                <th className="px-6 py-3 text-left">Method</th>
                <th className="px-6 py-3 text-right">Amount</th>
                <th className="px-6 py-3 text-left">Status</th>
                <th className="px-6 py-3 text-left">Date</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {payments.length === 0
                ? <tr><td colSpan={6} className="px-6 py-10 text-center text-muted">No payment records.</td></tr>
                : payments.map(p => {
                  const { label, cls } = STATUS[p.status]
                  return (
                    <tr key={p.id} className="hover:bg-gray-50 transition-colors">
                      <td className="px-6 py-4 font-mono text-xs text-muted">{p.id}</td>
                      <td className="px-6 py-4 font-medium text-ink">{p.customer}</td>
                      <td className="px-6 py-4 text-muted">{p.method}</td>
                      <td className="px-6 py-4 text-right font-semibold text-primary">{formatCurrency(p.amount)}</td>
                      <td className="px-6 py-4">
                        <span className={`inline-flex px-2.5 py-0.5 rounded-full text-xs font-semibold ${cls}`}>
                          {label}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-muted">{formatDate(p.date)}</td>
                    </tr>
                  )
                })
              }
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
```

---

## 5️⃣ Environment & Secret Keys Configuration

Set the following variables inside Deno deployment settings or through the Supabase CLI secrets system:

```bash
# Set secrets on Supabase Remote
supabase secrets set PAYMOB_SECRET_KEY="your-secret-key"
supabase secrets set PAYMOB_PUBLIC_KEY="your-public-key"
supabase secrets set PAYMOB_CARD_INTEGRATION_ID="your-integration-id"
supabase secrets set PAYMOB_HMAC_SECRET="your-hmac-secret"
supabase secrets set SITE_URL="your-production-site-url"
```

Configure your local testing files (`.env`):
* `PAYMOB_SECRET_KEY`
* `PAYMOB_PUBLIC_KEY`
* `PAYMOB_CARD_INTEGRATION_ID`
* `PAYMOB_HMAC_SECRET`
* `SITE_URL` (Defaults to local web app `http://localhost:5173`)
