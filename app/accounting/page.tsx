import { AppShell } from "@/components/layout/app-shell";
import { PlaceholderPanel } from "@/components/ui/placeholder-panel";

export default function AccountingPage() {
  return (
    <AppShell
      title="Accounting Light"
      description="Simple journal and management P&L only. Not full accounting, tax, bank, or audit-ready finance system."
    >
      <PlaceholderPanel
        title="Accounting Light Module"
        description="This module must be driven by client-confirmed COA, HPP formula, and accounting rules."
        items={[
          "Chart of accounts",
          "Manual journal entries",
          "Expense input",
          "Debit/credit balance check",
          "Simple P&L management report",
          "No tax / bank / balance sheet",
        ]}
      />
    </AppShell>
  );
}
