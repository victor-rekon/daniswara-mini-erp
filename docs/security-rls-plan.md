# Security / RLS Plan

## Current Status

Supabase security advisor reports that Row Level Security is disabled on all public Phase 1 tables.

This is acceptable only for the first empty-schema setup moment. It is not acceptable before real client data is entered.

## Risk

If RLS remains disabled, tables exposed through Supabase PostgREST may be readable or writable by clients using the public anon/publishable key depending on API access patterns.

This project contains sensitive business data:

- production
- pricing
- HPP
- customer data
- invoices
- payments
- journal entries
- P&L management report data

## Development Decision

The app should use server actions with the Supabase service role key on the server only.

Never expose `SUPABASE_SERVICE_ROLE_KEY` to browser/client code.

## RLS Enablement SQL

Run after access policy is ready:

```sql
ALTER TABLE public.branches ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.app_users ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.products ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.customers ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.chart_of_accounts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.production_records ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.quotations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.quotation_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.sales_records ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.delivery_records ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.invoices ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.payments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.expense_records ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.journal_entries ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.journal_lines ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.activity_logs ENABLE ROW LEVEL SECURITY;
```

## Minimum Policy Direction

Phase 1 should use one of these approaches:

### Option A — Server-only access

- Enable RLS.
- Do not allow direct anon/auth client reads/writes.
- All reads/writes go through server actions using service role.
- Simplest and safest for first private internal prototype.

### Option B — Authenticated user policies

- Enable RLS.
- Create policies for authenticated users.
- Restrict by `app_users.role` and optionally `branch_id`.
- More correct long-term, but slower to implement.

## Recommendation

Use Option A for prototype. Move to Option B before wider user rollout.
