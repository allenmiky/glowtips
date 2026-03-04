"use client";

import { useQuery } from "@tanstack/react-query";
import toast from "react-hot-toast";
import { DashboardShell } from "@/components/dashboard/dashboard-shell";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useAccessToken } from "@/hooks/auth";
import { apiRequest } from "@/lib/api-client";
import { config } from "@/lib/config";

type CreatorProfile = {
  id: string;
  username: string;
};

export default function IntegrationsPage() {
  const token = useAccessToken();
  const creatorQuery = useQuery({
    queryKey: ["creator", "me"],
    queryFn: () => apiRequest<CreatorProfile>("/api/v1/creators/me", { token }),
    enabled: Boolean(token)
  });

  const origin = typeof window !== "undefined" ? window.location.origin : "";
  const obsOverlayUrl = creatorQuery.data?.id ? `${origin}/overlay/${creatorQuery.data.id}` : "";

  const copyValue = async (value: string, label: string) => {
    if (!value) return;
    try {
      await navigator.clipboard.writeText(value);
      toast.success(`${label} copied`);
    } catch {
      toast.error("Failed to copy");
    }
  };

  return (
    <DashboardShell>
      <Card>
        <h1 className="text-2xl font-bold">Integrations</h1>
        <p className="mt-2 text-sm ">Use this URL as an OBS Browser Source.</p>

        <div className="mt-5 flex gap-2">
          <Input readOnly value={obsOverlayUrl} placeholder="OBS overlay URL will appear here" />
          <Button type="button" onClick={() => copyValue(obsOverlayUrl, "OBS URL")} disabled={!obsOverlayUrl}>
            Copy
          </Button>
        </div>

        <div className="mt-6 space-y-3 text-sm ">
          <p>API endpoint: {config.apiUrl}</p>
          <p>Socket endpoint: {config.wsUrl}</p>
        </div>
      </Card>
    </DashboardShell>
  );
}

