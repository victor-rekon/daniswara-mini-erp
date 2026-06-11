import { AppShell } from "@/components/layout/app-shell";
import { PlaceholderPanel } from "@/components/ui/placeholder-panel";

export default function MasterDataPage() {
  return (
    <AppShell
      title="Master Data"
      description="Shared data used across production, sales, delivery, invoice, and accounting modules."
    >
      <PlaceholderPanel
        title="Master Data Module"
        description="Build this before transaction modules. Transaction data depends on these records."
        items={[
          "Products",
          "Customers",
          "Branches",
          "Users",
          "Chart of accounts",
          "Status options",
        ]}
      />
    </AppShell>
  );
}
