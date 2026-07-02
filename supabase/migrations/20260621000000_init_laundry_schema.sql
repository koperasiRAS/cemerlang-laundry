create extension if not exists "uuid-ossp";

create table profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  name text not null,
  role text not null check (role in ('super_admin', 'owner', 'staff')),
  created_at timestamptz default now() not null,
  updated_at timestamptz default now() not null
);

-- Function to get current user role securely (bypasses RLS)
create or replace function public.get_current_user_role()
returns text
language sql
security definer
set search_path = public
as $$
  select role from public.profiles where id = auth.uid();
$$;

create table service_types (
  id uuid primary key default uuid_generate_v4(),
  name text not null,
  unit text not null check (unit in ('kg', 'item')),
  base_price integer not null check (base_price >= 0),
  estimated_duration_hours integer not null check (estimated_duration_hours > 0),
  created_at timestamptz default now() not null,
  updated_at timestamptz default now() not null
);

create table customers (
  id uuid primary key default uuid_generate_v4(),
  name text not null,
  phone_number text not null unique,
  address text,
  created_at timestamptz default now() not null,
  updated_at timestamptz default now() not null
);

create table orders (
  id uuid primary key default uuid_generate_v4(),
  tracking_number text not null unique,
  customer_id uuid references customers(id) on delete restrict,
  staff_id uuid references profiles(id) on delete restrict,
  service_type_id uuid references service_types(id) on delete restrict,
  weight numeric,
  estimated_price integer not null check (estimated_price >= 0),
  final_price integer check (final_price >= 0),
  payment_status text not null default 'unpaid' check (payment_status in ('unpaid', 'paid')),
  payment_method text check (payment_method in ('cash', 'transfer', 'qris', null)),
  status text not null default 'diterima' check (status in ('diterima', 'proses_cuci', 'proses_kering', 'setrika_lipat', 'siap_diambil', 'selesai', 'dibatalkan')),
  estimated_completion_date timestamptz,
  special_notes text,
  created_at timestamptz default now() not null,
  updated_at timestamptz default now() not null
);

create table order_items (
  id uuid primary key default uuid_generate_v4(),
  order_id uuid references orders(id) on delete cascade,
  item_name text not null,
  initial_condition_description text,
  initial_condition_image_url text,
  price integer not null check (price >= 0),
  created_at timestamptz default now() not null
);

create table order_status_history (
  id uuid primary key default uuid_generate_v4(),
  order_id uuid references orders(id) on delete cascade,
  status text not null,
  changed_by uuid references profiles(id) on delete set null,
  created_at timestamptz default now() not null
);

-- RLS
alter table profiles enable row level security;
alter table service_types enable row level security;
alter table customers enable row level security;
alter table orders enable row level security;
alter table order_items enable row level security;
alter table order_status_history enable row level security;

-- Profiles Policies
create policy "Super Admin can do all on profiles" on profiles for all using (
  public.get_current_user_role() = 'super_admin'
);
create policy "Owner can read all profiles" on profiles for select using (
  public.get_current_user_role() = 'owner'
);
create policy "Owner can update profiles" on profiles for update using (
  public.get_current_user_role() = 'owner'
);
create policy "Staff can read all profiles" on profiles for select using (
  public.get_current_user_role() = 'staff'
);

-- Service Types Policies
create policy "Super Admin and Owner can do all on service_types" on service_types for all using (
  public.get_current_user_role() in ('super_admin', 'owner')
);
create policy "Staff can read service_types" on service_types for select using (
  public.get_current_user_role() = 'staff'
);

-- Customers Policies
create policy "All authenticated roles can read customers" on customers for select using (
  auth.role() = 'authenticated'
);
create policy "All authenticated roles can insert customers" on customers for insert with check (
  auth.role() = 'authenticated'
);
create policy "All authenticated roles can update customers" on customers for update using (
  auth.role() = 'authenticated'
);
create policy "Super admin can delete customers" on customers for delete using (
  public.get_current_user_role() = 'super_admin'
);

-- Orders Policies
create policy "Super Admin can do all on orders" on orders for all using (
  public.get_current_user_role() = 'super_admin'
);
create policy "Owner can read all orders" on orders for select using (
  public.get_current_user_role() = 'owner'
);
create policy "Owner can update orders" on orders for update using (
  public.get_current_user_role() = 'owner'
);
create policy "Owner can insert orders" on orders for insert with check (
  public.get_current_user_role() = 'owner'
);
create policy "Staff can read all orders" on orders for select using (
  public.get_current_user_role() = 'staff'
);
create policy "Staff can insert orders" on orders for insert with check (
  public.get_current_user_role() = 'staff'
);
create policy "Staff can update orders" on orders for update using (
  public.get_current_user_role() = 'staff'
);

-- Order Items Policies
create policy "Super Admin can do all on order_items" on order_items for all using (
  public.get_current_user_role() = 'super_admin'
);
create policy "Owner can read order_items" on order_items for select using (
  public.get_current_user_role() = 'owner'
);
create policy "Owner can insert order_items" on order_items for insert with check (
  public.get_current_user_role() = 'owner'
);
create policy "Owner can update order_items" on order_items for update using (
  public.get_current_user_role() = 'owner'
);
create policy "Staff can read order_items" on order_items for select using (
  public.get_current_user_role() = 'staff'
);
create policy "Staff can insert order_items" on order_items for insert with check (
  public.get_current_user_role() = 'staff'
);
create policy "Staff can update order_items" on order_items for update using (
  public.get_current_user_role() = 'staff'
);
create policy "Staff can delete order_items" on order_items for delete using (
  public.get_current_user_role() = 'staff'
  and (select status from orders where id = order_items.order_id) != 'selesai'
);

-- Order Status History Policies
create policy "Super Admin can do all on order_status_history" on order_status_history for all using (
  public.get_current_user_role() = 'super_admin'
);
create policy "Owner can read order_status_history" on order_status_history for select using (
  public.get_current_user_role() = 'owner'
);
create policy "Staff can read order_status_history" on order_status_history for select using (
  public.get_current_user_role() = 'staff'
);
create policy "Staff can insert order_status_history" on order_status_history for insert with check (
  public.get_current_user_role() = 'staff'
);
create policy "Owner can insert order_status_history" on order_status_history for insert with check (
  public.get_current_user_role() = 'owner'
);
