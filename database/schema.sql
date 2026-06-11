-- Daniswara Mini ERP Phase 1 Schema Draft
-- Scope: operational dashboard + simple accounting light.
-- Not scope: full ERP, tax, bank reconciliation, audit-ready accounting.

create extension if not exists "pgcrypto";

create table if not exists branches (
  id uuid primary key default gen_random_uuid(),
  branch_name text not null,
  location text,
  created_at timestamptz not null default now()
);

create table if not exists app_users (
  id uuid primary key default gen_random_uuid(),
  auth_user_id uuid,
  name text not null,
  email text unique not null,
  role text not null check (role in ('owner', 'admin', 'staff')),
  branch_id uuid references branches(id),
  created_at timestamptz not null default now()
);

create table if not exists products (
  id uuid primary key default gen_random_uuid(),
  product_name text not null,
  unit text not null,
  created_at timestamptz not null default now()
);

create table if not exists customers (
  id uuid primary key default gen_random_uuid(),
  customer_name text not null,
  contact text,
  branch_id uuid references branches(id),
  notes text,
  created_at timestamptz not null default now()
);

create table if not exists chart_of_accounts (
  id uuid primary key default gen_random_uuid(),
  account_code text not null unique,
  account_name text not null,
  account_type text not null check (account_type in ('asset', 'liability', 'equity', 'revenue', 'cost_of_goods_sold', 'expense')),
  created_at timestamptz not null default now()
);

create table if not exists production_records (
  id uuid primary key default gen_random_uuid(),
  production_date date not null,
  branch_id uuid references branches(id),
  product_id uuid not null references products(id),
  batch_code text,
  quantity_produced numeric(14,2) not null default 0,
  unit text not null,
  losses_quantity numeric(14,2) not null default 0,
  hpp_base_cost numeric(14,2) not null default 0,
  notes text,
  created_by uuid references app_users(id),
  created_at timestamptz not null default now()
);

create table if not exists quotations (
  id uuid primary key default gen_random_uuid(),
  quotation_number text not null unique,
  quotation_date date not null,
  branch_id uuid references branches(id),
  customer_id uuid not null references customers(id),
  status text not null default 'draft' check (status in ('draft', 'sent', 'accepted', 'rejected')),
  notes text,
  created_by uuid references app_users(id),
  created_at timestamptz not null default now()
);

create table if not exists quotation_items (
  id uuid primary key default gen_random_uuid(),
  quotation_id uuid not null references quotations(id) on delete cascade,
  product_id uuid not null references products(id),
  quantity numeric(14,2) not null default 0,
  selling_price numeric(14,2) not null default 0,
  line_total numeric(14,2) generated always as (quantity * selling_price) stored,
  notes text,
  created_at timestamptz not null default now()
);

create table if not exists sales_records (
  id uuid primary key default gen_random_uuid(),
  sales_date date not null,
  branch_id uuid references branches(id),
  customer_id uuid not null references customers(id),
  quotation_id uuid references quotations(id),
  so_number text,
  customer_po_number text,
  surat_jalan_number text,
  product_id uuid not null references products(id),
  quantity numeric(14,2) not null default 0,
  selling_price numeric(14,2) not null default 0,
  total_sales numeric(14,2) generated always as (quantity * selling_price) stored,
  sales_status text not null default 'open' check (sales_status in ('open', 'partially_delivered', 'delivered', 'cancelled')),
  notes text,
  created_by uuid references app_users(id),
  created_at timestamptz not null default now()
);

create table if not exists delivery_records (
  id uuid primary key default gen_random_uuid(),
  branch_id uuid references branches(id),
  sales_record_id uuid references sales_records(id),
  so_number text,
  customer_po_number text,
  surat_jalan_number text not null,
  delivery_date date not null,
  customer_id uuid not null references customers(id),
  product_id uuid not null references products(id),
  quantity_delivered numeric(14,2) not null default 0,
  quantity_pending numeric(14,2) not null default 0,
  delivery_status text not null default 'pending' check (delivery_status in ('pending', 'partially_delivered', 'delivered', 'cancelled_issue')),
  receiver text,
  notes text,
  created_by uuid references app_users(id),
  created_at timestamptz not null default now()
);

create table if not exists invoices (
  id uuid primary key default gen_random_uuid(),
  branch_id uuid references branches(id),
  invoice_number text not null unique,
  invoice_date date not null,
  customer_id uuid not null references customers(id),
  delivery_record_id uuid references delivery_records(id),
  invoice_value numeric(14,2) not null default 0,
  due_date date,
  payment_received numeric(14,2) not null default 0,
  outstanding_amount numeric(14,2) generated always as (invoice_value - payment_received) stored,
  payment_status text not null default 'belum_ditagih' check (payment_status in ('belum_ditagih', 'sudah_ditagih', 'sebagian_dibayar', 'lunas', 'overdue')),
  notes text,
  created_by uuid references app_users(id),
  created_at timestamptz not null default now()
);

create table if not exists payments (
  id uuid primary key default gen_random_uuid(),
  invoice_id uuid not null references invoices(id) on delete cascade,
  payment_date date not null,
  amount numeric(14,2) not null default 0,
  notes text,
  created_by uuid references app_users(id),
  created_at timestamptz not null default now()
);

create table if not exists expense_records (
  id uuid primary key default gen_random_uuid(),
  expense_date date not null,
  branch_id uuid references branches(id),
  account_id uuid not null references chart_of_accounts(id),
  description text not null,
  amount numeric(14,2) not null default 0,
  notes text,
  created_by uuid references app_users(id),
  created_at timestamptz not null default now()
);

create table if not exists journal_entries (
  id uuid primary key default gen_random_uuid(),
  journal_date date not null,
  reference_number text,
  description text,
  source_module text check (source_module in ('invoice', 'payment', 'production', 'expense', 'manual')),
  created_by uuid references app_users(id),
  created_at timestamptz not null default now()
);

create table if not exists journal_lines (
  id uuid primary key default gen_random_uuid(),
  journal_entry_id uuid not null references journal_entries(id) on delete cascade,
  account_id uuid not null references chart_of_accounts(id),
  debit_amount numeric(14,2) not null default 0,
  credit_amount numeric(14,2) not null default 0,
  notes text,
  created_at timestamptz not null default now(),
  check (debit_amount >= 0 and credit_amount >= 0),
  check (not (debit_amount > 0 and credit_amount > 0))
);

create table if not exists activity_logs (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references app_users(id),
  module text not null,
  action text not null,
  record_id uuid,
  notes text,
  created_at timestamptz not null default now()
);
