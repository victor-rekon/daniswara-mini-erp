import { AppShell } from "@/components/layout/app-shell";
import { PlaceholderPanel } from "@/components/ui/placeholder-panel";

export default function SettingsPage() {
  return (
    <AppShell
      title="Settings"
      description="Basic configuration only. No complex role matrix in Phase 1."
    >
      <PlaceholderPanel
        title="Settings Module"
        description="Keep settings minimal to protect build speed and scope."
        items={[
          "Simple user roles",
          "Branch visibility if needed",
          "Company profile",
          "Document numbering rules if simple",
        ]}
      />
    </AppShell>
  );
}
