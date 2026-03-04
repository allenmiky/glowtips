"use client";

import { useMutation, useQuery } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { DashboardShell } from "@/components/dashboard/dashboard-shell";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { apiRequest } from "@/lib/api-client";
import { useAccessToken } from "@/hooks/auth";

const schema = z.object({ amount: z.coerce.number().min(1) });

type FormValues = z.infer<typeof schema>;

type Withdrawal = {
  id: string;
  amount: number;
  status: "PENDING" | "APPROVED" | "REJECTED" | "PAID";
  requestedAt: string;
  processedAt?: string;
};

export default function WithdrawPage() {
  const token = useAccessToken();
  const form = useForm<FormValues>({ resolver: zodResolver(schema) });

  const historyQuery = useQuery({
    queryKey: ["withdrawals"],
    queryFn: () => apiRequest<Withdrawal[]>("/api/v1/withdrawals", { token })
  });

  const requestMutation = useMutation({
    mutationFn: (payload: FormValues) => apiRequest("/api/v1/withdrawals", { method: "POST", token, body: payload }),
    onSuccess: () => {
      toast.success("Withdrawal requested");
      historyQuery.refetch();
      form.reset();
    },
    onError: (error) => toast.error(error.message)
  });

  return (
    <DashboardShell>
      <Card>
        <h1 className="text-2xl font-bold">Withdraw</h1>
        <form className="mt-4 flex gap-3" onSubmit={form.handleSubmit((values) => requestMutation.mutate(values))}>
          <Input type="number" step="0.01" placeholder="Amount" {...form.register("amount")} />
          <Button type="submit">Request</Button>
        </form>
        <div className="mt-6 space-y-3">
          {(historyQuery.data ?? []).map((item) => (
            <div key={item.id} className="rounded-xl border border-border p-3 text-sm">
              <p className="font-semibold">${item.amount.toFixed(2)} - {item.status}</p>
              <p className="">Requested: {new Date(item.requestedAt).toLocaleString()}</p>
              <p className="">Processed: {item.processedAt ? new Date(item.processedAt).toLocaleString() : "Pending"}</p>
            </div>
          ))}
        </div>
      </Card>
    </DashboardShell>
  );
}
