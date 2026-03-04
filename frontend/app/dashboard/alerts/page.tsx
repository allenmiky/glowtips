"use client";

import { useMutation } from "@tanstack/react-query";
import toast from "react-hot-toast";
import { DashboardShell } from "@/components/dashboard/dashboard-shell";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { apiRequest } from "@/lib/api-client";
import { useAccessToken } from "@/hooks/auth";

export default function AlertsPage() {
  const token = useAccessToken();

  const mutation = useMutation({
    mutationFn: async () =>
      apiRequest("/api/v1/alerts/test", {
        method: "POST",
        token,
        body: {
          supporterName: "Test Supporter",
          amount: 12,
          message: "Glow check"
        }
      }),
    onSuccess: () => toast.success("Test alert sent"),
    onError: (error) => toast.error(error.message)
  });

  return (
    <DashboardShell>
      <Card>
        <h1 className="text-2xl font-bold">Alerts</h1>
        <p className="mt-2 ">Send a test event to verify your OBS overlay.</p>
        <Button className="mt-5" onClick={() => mutation.mutate()}>
          Send test alert
        </Button>
      </Card>
    </DashboardShell>
  );
}

