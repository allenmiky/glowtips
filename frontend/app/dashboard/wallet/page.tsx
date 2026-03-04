"use client";

import { useQuery } from "@tanstack/react-query";
import { Area, AreaChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { DashboardShell } from "@/components/dashboard/dashboard-shell";
import { Card } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { apiRequest } from "@/lib/api-client";
import { useAccessToken } from "@/hooks/auth";

type WalletResponse = {
  balance: number;
  feeBreakdown: {
    gross: number;
    platformFeeRate: number;
    platformFee: number;
    net: number;
  };
  entries: Array<{ id: string; amount: number; createdAt: string }>;
};

export default function WalletPage() {
  const token = useAccessToken();
  const query = useQuery({
    queryKey: ["wallet"],
    queryFn: () => apiRequest<WalletResponse>("/api/v1/wallet", { token })
  });

  return (
    <DashboardShell>
      <Card>
        <h1 className="text-2xl font-bold">Wallet</h1>
        {query.isLoading && <Skeleton className="mt-4 h-40" />}
        {query.data && (
          <>
            <p className="mt-4 text-3xl font-extrabold">${query.data.balance.toFixed(2)}</p>
            <p className="mt-1 text-sm text-muted-foreground">
              Gross ${query.data.feeBreakdown.gross.toFixed(2)} | Fee ${(query.data.feeBreakdown.platformFeeRate * 100).toFixed(0)}% = ${query.data.feeBreakdown.platformFee.toFixed(2)} | Net ${query.data.feeBreakdown.net.toFixed(2)}
            </p>
            <div className="mt-6 h-56">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={query.data.entries.slice().reverse()}>
                  <XAxis dataKey="createdAt" hide />
                  <YAxis hide />
                  <Tooltip />
                  <Area type="monotone" dataKey="amount" stroke="hsl(var(--accent))" fill="hsl(var(--accent))" fillOpacity={0.2} />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </>
        )}
      </Card>
    </DashboardShell>
  );
}