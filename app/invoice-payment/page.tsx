import { AppShell } from "@/components/layout/app-shell";
import { PlaceholderPanel } from "@/components/ui/placeholder-panel";

export default function InvoicePaymentPage() {
  return (
    <AppShell
      title="Invoice & Payment"
      description="Customer invoice, payment received, outstanding amount, and overdue tracking."
    >
      <PlaceholderPanel
        title="Invoice & Customer Payment Module"
        description="Manual customer payment tracking only. No bank mutation or reconciliation in Phase 1."
        items={[
          "Invoice creation",
          "Due date",
          "Payment update",
          "Outstanding customer",
          "Overdue invoice",
          "Payment status",
        ]}
      />
    </AppShell>
  );
}
