import { AppShell } from "@/components/layout/app-shell";
import { PlaceholderPanel } from "@/components/ui/placeholder-panel";

const dashboardCards = [
  "Total production",
  "Total losses",
  "Basic HPP summary",
  "Total sales",
  "Pending delivery",
  "Payment received",
  "Outstanding customer",
  "Simple P&L result",
];

export default function DashboardPage() {
  return (
    <AppShell
      title="Owner Dashboard"
      description="High-level operational summary. Every number must be traceable to source data."
    >
      <PlaceholderPanel
        title="Dashboard Cards"
        description="Prototype frame for owner summary metrics. Real values will come from Supabase tables."
        items={dashboardCards}
      />
    </AppShell>
  );
}
