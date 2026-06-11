# Scope Phase 1 — Daniswara Mini ERP

## Core Objective

Build a lightweight internal web app for PT Daniswara Gas Indonesia to reduce delayed reports and give the owner visibility over production, sales, delivery, invoice/payment, simple accounting journal, and simple P&L management report.

## In Scope

### 1. Production + Losses + Basic HPP

- Production input
- Losses / susut input
- Basic HPP field and calculation
- Production recap
- Losses recap
- Dashboard summary

HPP formula must be provided and approved by the client. SistemBeres only automates confirmed formulas.

### 2. Sales Based on Surat Jalan

- Sales records based on delivery / surat jalan
- Customer
- Product
- Quantity
- Selling price
- Total sales
- Status
- Period/customer recap

### 3. Simple Quotation

- Quotation number
- Quotation date
- Customer
- Product/item lines
- Quantity
- Price
- Total
- Status: draft, sent, accepted, rejected

Not included: complex templates, approval, versioning, e-signature, auto-send.

### 4. Customer PO / SO Tracking

- Customer PO number
- SO number if used
- Link to sales / delivery / invoice when possible

Important: customer PO is in scope. Vendor purchase order is not Phase 1.

### 5. Surat Jalan / Delivery

- Surat jalan number
- Delivery date
- Customer
- Product
- Quantity delivered
- Quantity pending
- Delivery status
- Receiver
- Notes

### 6. Invoice & Customer Payment

- Invoice creation
- Due date
- Payment received
- Outstanding amount
- Payment status
- Overdue tracking

Manual customer payment input only.

### 7. Accounting Light

- Chart of accounts
- Manual journal entries
- Expense input
- Debit/credit balance check
- Simple management P&L

This is not full accounting software.

### 8. Owner Dashboard

- Production
- Losses
- Basic HPP
- Sales
- Delivery status
- Invoice status
- Payment received
- Outstanding customer
- Simple P&L result

Every dashboard number must be traceable to source data.

## Out of Scope

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
- Fixed asset / depreciation
- Payroll
- Complex inventory
- Stock valuation / FIFO / average costing
- API integrations
- WhatsApp/email automation
- Reminder automation
- Large historical migration by SistemBeres

## Change Request Rule

Any request outside Phase 1 must be quoted separately as Phase 2 / paid change request.
