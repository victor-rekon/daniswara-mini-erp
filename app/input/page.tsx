import { InputCommandPanel } from "@/components/commands/input-command-panel";
import { AppShell } from "@/components/layout/app-shell";

export default function InputPage() {
  return (
    <AppShell title="Input Command" description="Staff input entry page.">
      <InputCommandPanel />
    </AppShell>
  );
}
