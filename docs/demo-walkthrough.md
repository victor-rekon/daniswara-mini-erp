# Daniswara Mini ERP — Demo Walkthrough

## Demo Goal

Show the Phase 1 workflow:

Master Data → Production → Quotation → Customer PO/SO → Surat Jalan → Invoice → Payment → Accounting Light → Owner Dashboard.

This is not a full ERP. It is a Phase 1 internal web app prototype.

## 1. Owner Dashboard

Open `/dashboard`.

Explain:

- Owner sees production, losses, HPP, quotation, sales via surat jalan, invoice, payment, outstanding, expense, and simple net profit.
- Every number should be traceable to source module data.
- Attention panel shows outstanding, pending delivery, and overdue invoice.

## 2. Master Data

Open `/master-data`.

Explain:

- Base data: branch, product, customer, chart of accounts.
- Cleaner master data produces cleaner reports.

## 3. Production / HPP

Open `/production`.

Explain:

- Staff inputs production quantity, losses/susut, and HPP base cost.
- System calculates net quantity, losses percentage, and basic HPP/unit.
- HPP formula must be validated by client's accounting team.

Demo data:

- DEMO-BATCH-001
- 100 produced
- 3 losses
- Rp12.500.000 HPP base cost

## 4. Quotation

Open `/quotation`.

Explain:

- Quotation is tracked before order.
- Status: draft, sent, accepted, rejected.
- Prototype supports simple one-line item first.

Demo data:

- QUO-DEMO-001
- Demo Customer PT
- Rp15.000.000

## 5. Sales & Delivery

Open `/sales-delivery`.

Explain:

- Customer PO/SO is captured.
- Surat jalan is captured.
- Sales reporting follows delivery/surat jalan.

Demo data:

- SO-DEMO-001
- PO-CUST-DEMO-001
- SJ-DEMO-001
- 10 ordered
- 10 delivered

Scope note:

- Vendor purchasing PO is not included in Phase 1.

## 6. Invoice & Payment

Open `/invoice-payment`.

Explain:

- Invoice can be linked to surat jalan.
- Payment is input manually.
- System shows paid amount and outstanding.

Demo data:

- INV-DEMO-001
- Invoice Rp15.000.000
- Paid Rp5.000.000
- Outstanding Rp10.000.000

Scope note:

- No bank mutation.
- No reconciliation.
- No e-Faktur.

## 7. Accounting Light

Open `/accounting`.

Explain:

- Manual expense input.
- Simple two-line manual journal.
- Simple management P&L.
- Not full GL, neraca, trial balance, tax, or audit accounting.

Demo data:

- Demo expense Rp1.000.000
- JRN-DEMO-001 balanced journal

## 8. Close Back at Dashboard

Return to `/dashboard`.

Say:

> Ini prototype Phase 1 untuk membuktikan flow utama: produksi, losses, quotation, SO/PO customer, surat jalan, invoice, payment, outstanding, expense, dan dashboard owner.

## Important Demo Wording

Do not say:

- Full ERP
- Accounting otomatis pasti benar
- Tax otomatis benar
- Bisa langsung input data real tanpa security setup

Say:

> Untuk accounting, COA, HPP, jurnal, dan tax treatment harus divalidasi oleh tim accounting/client. SistemBeres mengotomatisasi workflow yang sudah dikonfirmasi.

## Likely Client Questions

### Bisa tambah fitur?

Bisa, tapi masuk Phase 2 atau change request setelah Phase 1 stabil.

### Bisa pakai data real?

Bisa setelah security/RLS, role access, dan environment production selesai.

### Bisa export PDF?

Bisa masuk add-on atau Phase 2 untuk quotation/invoice PDF.
