# Backend QA Status — 2026-06-13

## Baseline

Current work is based on latest production `main`, including Claude's latest UI commits:

- dark/premium visual refinement
- dashboard charts
- mobile layout improvements
- collapsed mobile tables
- active mobile nav behavior

Do not revert these UI changes.

## Verified

- Production deployment is READY.
- `/dashboard` responds 200.
- `/input` responds 200.
- Core server actions still include workflow validation and activity logging.
- Production export endpoint responds 200 CSV.
- Invoice/payment export endpoint responds 200 CSV.
- Vercel runtime logs: no production `error` or `fatal` logs in the last 24 hours.
- Database integrity query returned zero invalid rows for:
  - production quantities/losses/HPP
  - sales quantity/price
  - delivery delivered/pending quantities
  - invoice value/payment received
  - payment amount
  - expense amount
  - journal debit/credit amount
  - orphan delivery rows
  - orphan invoice customer rows
  - orphan payment rows

## Current Backend Coverage

Phase 1 core workflow exists:

Master Data → Production → Quotation → Sales/Delivery → Invoice/Payment → Accounting Light → Dashboard/Reports

Covered modules:

- branches
- products
- customers
- chart_of_accounts
- production_records
- quotations
- quotation_items
- sales_records
- delivery_records
- invoices
- payments
- expense_records
- journal_entries
- journal_lines
- activity_logs

## Not Yet Production-Safe

Supabase reports Row Level Security disabled on all public tables. This is a critical security issue for real client data.

Do not enter sensitive real client data until one of these is done:

1. Activate the app-level access gate using `APP_ACCESS_PASSWORD`, and
2. Implement proper user auth + RLS policies.

RLS should not be enabled blindly without policies, because that can block app access.

## Still Missing for Client-Ready Phase 1

- `APP_ACCESS_PASSWORD` must be configured in Vercel.
- Real role-based access is not fully enforced.
- End-to-end browser form submission QA is not completed.
- RLS policies are not implemented.

## Out of Scope / Phase 2

These are not Phase 1 and should not be represented as complete:

- purchase approval
- vendor payable/outstanding
- bank mutation import/API
- full accounting ledger
- trial balance
- balance sheet/neraca
- tax report/e-Faktur/e-Bupot
- full inventory valuation
