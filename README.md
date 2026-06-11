# Daniswara Mini ERP — SistemBeres

Internal web app for PT Daniswara Gas Indonesia.

This project is a lightweight operational dashboard / mini ERP Phase 1 build. It is not a full ERP, not a full accounting system, not a tax system, not a POS replacement, and not a native mobile app.

## Phase 1 Scope

- Production + losses + basic HPP
- Sales based on surat jalan
- Simple quotation
- Customer PO / SO tracking
- Surat jalan / delivery tracking
- Invoice and customer payment tracking
- Outstanding customer payment
- Simple accounting journal
- Expense input
- Simple P&L management report
- Owner dashboard
- Basic reports
- Master data: products, customers, branches, users, chart of accounts

## Explicitly Out of Scope

- Tax report
- e-Faktur
- Bank mutation
- Bank reconciliation
- Vendor purchasing
- Vendor outstanding
- Purchase approval workflow
- Balance sheet / neraca
- Full general ledger
- Trial balance
- Closing period
- Complex inventory / stock valuation
- API integrations
- WhatsApp/email automation
- Reminder automation
- Large historical data migration by SistemBeres

## Recommended Stack

- Next.js App Router
- TypeScript
- Supabase Postgres
- Supabase Auth
- Vercel hosting
- Tailwind CSS

## Build Rule

Ship the signed Phase 1 scope only. Any accounting, tax, bank, vendor, inventory, approval, integration, or automation expansion must be handled as Phase 2 / paid change request.