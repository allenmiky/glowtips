import { DashboardShell } from "@/components/dashboard/dashboard-shell";
import { Card } from "@/components/ui/card";
import { useUser } from "@/hooks/auth";

export default function ProfilePage() {
  const { name, email } = useUser();

  return (
    <DashboardShell>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-black tracking-tight">Public Profile</h1>
          <p className="">Manage your public presence and branding.</p>
        </div>

        <Card className="p-6">
          <div className="flex items-center gap-4">
            <div className="h-16 w-16 rounded-full bg-primary flex items-center justify-center text-xl font-black text-white">
              {name ? name.substring(0, 2).toUpperCase() : "US"}
            </div>
            <div>
              <h2 className="text-xl font-bold">{name}</h2>
              <p className="text-sm ">{email}</p>
            </div>
          </div>
          
          <div className="mt-8 grid gap-4 max-w-md">
             <p className="text-sm  italic">Profile editing coming soon...</p>
          </div>
        </Card>
      </div>
    </DashboardShell>
  );
}

