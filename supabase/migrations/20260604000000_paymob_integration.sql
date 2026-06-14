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
alter table public.orders add column if not exists payment_method text default 'cash';
alter table public.orders add column if not exists payment_status text default 'cash_pending';
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

-- Update existing rows to conform to the new payment method check constraint
update public.orders set payment_method = 'cash' where payment_method = 'cod';
update public.orders set payment_method = 'cash' where payment_method not in ('card', 'cash') or payment_method is null;
update public.orders set payment_status = 'cash_pending' where payment_status = 'cod_pending';
update public.orders set payment_status = 'cash_pending' where payment_status not in ('pending', 'paid', 'failed', 'cash_pending') or payment_status is null;

-- Add constraints for payment method and payment status
alter table public.orders drop constraint if exists orders_payment_method_check;
alter table public.orders drop constraint if exists orders_payment_status_check;

alter table public.orders
  add constraint orders_payment_method_check
  check (payment_method in ('card', 'cash'));

alter table public.orders
  add constraint orders_payment_status_check
  check (payment_status in ('pending', 'paid', 'failed', 'cash_pending'));

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
    (payment_method = 'cash' and payment_status = 'cash_pending' and status = 'pending')
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
