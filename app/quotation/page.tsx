import { AppShell } from "@/components/layout/app-shell";
import { PlaceholderPanel } from "@/components/ui/placeholder-panel";

export default function QuotationPage() {
  return (
    <AppShell
      title="Quotation"
      description="Simple quotation tracking. Not multi-template, not approval/versioning engine."
    >
      <PlaceholderPanel
        title="Quotation Module"
        description="Phase 1 quotation is simple operational document tracking."
        items={[
          "Quotation number",
          "Customer",
          "Items / products",
          "Quantity and price",
          "Quotation total",
          "Status: draft / sent / accepted / rejected",
        ]}
      />
    </AppShell>
  );
}
