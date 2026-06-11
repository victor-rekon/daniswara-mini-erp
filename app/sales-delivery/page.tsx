import { AppShell } from "@/components/layout/app-shell";
import { PlaceholderPanel } from "@/components/ui/placeholder-panel";

export default function SalesDeliveryPage() {
  return (
    <AppShell
      title="Sales & Delivery"
      description="Sales report based on surat jalan, customer PO/SO references, and delivery tracking."
    >
      <PlaceholderPanel
        title="Sales / Customer PO / Surat Jalan"
        description="Customer PO is in scope. Vendor purchasing PO is not in Phase 1."
        items={[
          "Customer PO / SO reference",
          "Surat jalan number",
          "Sales based on delivery",
          "Delivered quantity",
          "Pending quantity",
          "Delivery status",
        ]}
      />
    </AppShell>
  );
}
