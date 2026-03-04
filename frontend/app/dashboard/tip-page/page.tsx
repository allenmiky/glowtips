"use client";

import { useMutation, useQuery } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { DashboardShell } from "@/components/dashboard/dashboard-shell";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { apiRequest } from "@/lib/api-client";
import { useAccessToken } from "@/hooks/auth";

const schema = z.object({
  displayName: z.string().min(2),
  avatarUrl: z.string().url().optional().or(z.literal("")),
  goalAmount: z.coerce.number().min(0)
});

type Values = z.infer<typeof schema>;
type CreatorProfile = {
  id: string;
  username: string;
};

export default function TipPageSettings() {
  const token = useAccessToken();
  const form = useForm<Values>({
    resolver: zodResolver(schema),
    defaultValues: { displayName: "", avatarUrl: "", goalAmount: 100 }
  });
  const creatorQuery = useQuery({
    queryKey: ["creator", "me"],
    queryFn: () => apiRequest<CreatorProfile>("/api/v1/creators/me", { token }),
    enabled: Boolean(token)
  });

  const mutation = useMutation({
    mutationFn: async (values: Values) =>
      apiRequest("/api/v1/creators/me", {
        method: "PUT",
        token,
        body: {
          ...values,
          avatarUrl: values.avatarUrl || undefined
        }
      }),
    onSuccess: () => toast.success("Tip page updated"),
    onError: (error) => toast.error(error.message)
  });

  const origin = typeof window !== "undefined" ? window.location.origin : "";
  const tipLink = creatorQuery.data?.username ? `${origin}/u/${creatorQuery.data.username}` : "";
  const overlayLink = creatorQuery.data?.id ? `${origin}/overlay/${creatorQuery.data.id}` : "";

  const copyLink = async (value: string, label: string) => {
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
        <h1 className="text-2xl font-bold">Tip Page Branding</h1>
        <form className="mt-6 space-y-4" onSubmit={form.handleSubmit((values) => mutation.mutate(values))}>
          <Input placeholder="Display name" {...form.register("displayName")} />
          <Input placeholder="Avatar URL" {...form.register("avatarUrl")} />
          <Input type="number" placeholder="Goal amount" {...form.register("goalAmount")} />
          <Button type="submit">Save</Button>
        </form>
        <div className="mt-8 space-y-3">
          <h2 className="text-lg font-semibold">Share Links</h2>
          <div className="flex gap-2">
            <Input readOnly value={tipLink} placeholder="Public tip link will appear here" />
            <Button type="button" onClick={() => copyLink(tipLink, "Tip link")} disabled={!tipLink}>
              Copy
            </Button>
          </div>
          <div className="flex gap-2">
            <Input readOnly value={overlayLink} placeholder="Overlay link will appear here" />
            <Button type="button" onClick={() => copyLink(overlayLink, "Overlay link")} disabled={!overlayLink}>
              Copy
            </Button>
          </div>
        </div>
      </Card>
    </DashboardShell>
  );
}
