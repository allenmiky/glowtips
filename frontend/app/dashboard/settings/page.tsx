import { DashboardShell } from "@/components/dashboard/dashboard-shell";
import { Card } from "@/components/ui/card";

export default function SettingsPage() {
  return (
    <DashboardShell>
      <Card>
        <h1 className="text-2xl font-bold">Settings</h1>
        <p className="mt-2 ">Manage profile, security, and payout preferences.</p>
      </Card>
    </DashboardShell>
  );
}
