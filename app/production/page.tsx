import { AppShell } from "@/components/layout/app-shell";
import { PlaceholderPanel } from "@/components/ui/placeholder-panel";

export default function ProductionPage() {
  return (
    <AppShell
      title="Production / HPP"
      description="Production input, losses, and basic HPP automation based on client-confirmed formula."
    >
      <PlaceholderPanel
        title="Production Module"
        description="Build order: input form, table, filters, losses recap, basic HPP summary."
        items={[
          "Production input form",
          "Losses / susut input",
          "Basic HPP fields",
          "Production table",
          "Period and product filters",
          "Owner recap",
        ]}
      />
    </AppShell>
  );
}
