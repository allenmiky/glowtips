import { DashboardShell } from "@/components/dashboard/dashboard-shell";
import { Card } from "@/components/ui/card";

const checklist = [
  "Complete your profile branding",
  "Set your tip page goal",
  "Configure alert style + sound",
  "Run a test alert",
  "Request first withdrawal"
];

export default function DashboardPage() {
  return (
    <DashboardShell>
      <Card>
        <h1 className="text-3xl font-bold">Setup Checklist</h1>
        <ul className="mt-4 space-y-2 text-sm text-muted-foreground">
          {checklist.map((item) => (
            <li key={item} className="rounded-lg bg-muted px-3 py-2">
              {item}
            </li>
          ))}
        </ul>
      </Card>
    </DashboardShell>
  );
}
