# Daniswara Mini ERP — Deployment Checklist

## Status

This app is a Phase 1 prototype for PT Daniswara Gas Indonesia.

Scope:

- Master Data
- Production / HPP basic
- Quotation
- Customer PO / SO
- Surat Jalan / Delivery
- Invoice & Payment
- Accounting Light
- Owner Dashboard

Out of scope:

- Full ERP
- Vendor purchasing
- Bank mutation / reconciliation
- Tax / e-Faktur / e-Bupot
- Full GL / trial balance / balance sheet
- Audit-ready accounting

## Pre-Deployment Checks

Run locally before demo:

```bash
npm install
npm run typecheck
npm run lint
npm run build
```

If any command fails, fix before client demo.

## Required Environment Variables

Create `.env.local` for local development:

```bash
NEXT_PUBLIC_SUPABASE_URL=https://hawulqpnuoifvaxznutv.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=<supabase-anon-key>
SUPABASE_SERVICE_ROLE_KEY=<supabase-service-role-key>
```

Important:

- Never commit `.env.local`.
- `SUPABASE_SERVICE_ROLE_KEY` must only run server-side.
- Do not expose service role key in browser code.

## Vercel Setup

1. Import GitHub repo into Vercel.
2. Set framework preset to Next.js.
3. Set branch for preview deployment to `dev`.
4. Add environment variables:
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - `SUPABASE_SERVICE_ROLE_KEY`
5. Deploy preview.
6. Open preview URL and test all modules.

## Supabase Security Warning

RLS was previously detected as disabled on public tables.

Before adding real client data:

1. Enable RLS.
2. Confirm server-only access pattern.
3. Add proper auth and role policies if browser access is introduced.
4. Re-run Supabase security advisors.

Current prototype uses server-side actions/admin client. This is acceptable for early internal prototype only, not production with real data.

## Manual Test Path

Test in this order:

1. Master Data
2. Production / HPP
3. Quotation
4. Sales & Delivery
5. Invoice & Payment
6. Accounting Light
7. Owner Dashboard

Each page should load without error and display seeded demo data.

## Demo Data

Seeded records currently include:

- Product: Oxygen Industrial
- Customer: Demo Customer PT
- Production: DEMO-BATCH-001
- Quotation: QUO-DEMO-001
- Sales/SO: SO-DEMO-001
- Customer PO: PO-CUST-DEMO-001
- Surat Jalan: SJ-DEMO-001
- Invoice: INV-DEMO-001
- Journal: JRN-DEMO-001

## Client Demo Rule

Do not present the system as finished ERP.

Correct framing:

> Ini prototype Phase 1 untuk membuktikan flow kerja utama: produksi, sales berdasarkan surat jalan, invoice, payment, outstanding, dan dashboard owner.

## Known Limitations

- No authentication UI yet.
- No role-based page restrictions yet.
- No edit/delete actions yet.
- No PDF invoice/quotation export yet.
- No filters/date range yet.
- No RLS policy enforcement yet.
- No build has been confirmed until local/Vercel build passes.
