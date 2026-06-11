import { AppShell } from "@/components/layout/app-shell";
import { PlaceholderPanel } from "@/components/ui/placeholder-panel";

export default function ReportsPage() {
  return (
    <AppShell
      title="Reports"
      description="Simple period-based operational and management reports. No full report engine in Phase 1."
    >
      <PlaceholderPanel
        title="Reports Module"
        description="Reports should stay simple: period filter, summary table, CSV export if easy."
        items={[
          "Production report",
          "Sales report",
          "Delivery report",
          "Invoice/payment report",
          "P&L management report",
          "CSV export if simple",
        ]}
      />
    </AppShell>
  );
}
