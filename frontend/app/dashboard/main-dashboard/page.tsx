"use client";

import { useState } from "react";
import { DashboardShell } from "@/components/dashboard/dashboard-shell";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

const recentMessages = [
  { name: "Ahsan Plays", amount: 15, message: "Great stream bro", time: "2m ago" },
  { name: "Sana Vibes", amount: 5, message: "Keep going!", time: "11m ago" },
  { name: "Ali Clips", amount: 25, message: "For new mic setup", time: "25m ago" },
  { name: "Noor Live", amount: 10, message: "GGs", time: "40m ago" }
];

export default function MainDashboardPage() {
  const [goal, setGoal] = useState(100);
  const raised = 48;
  const progress = Math.min((raised / Math.max(goal, 1)) * 100, 100);

  return (
    <DashboardShell>
      <Card className="rounded-[4px] border-black/10">
        <p className="text-[10px] font-bold uppercase tracking-[0.25em] text-primary">Creator Room</p>
        <h1 className="mt-2 text-4xl font-extrabold tracking-tight">Main Dashboard</h1>
        <p className="mt-3 text-sm text-muted-foreground">Overview alag tab me hai. Yahan live creator controls and signals hain.</p>
      </Card>

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <Card className="rounded-[4px] border-black/10">
          <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-muted-foreground">Today Tips</p>
          <p className="mt-2 text-3xl font-extrabold">$55</p>
        </Card>
        <Card className="rounded-[4px] border-black/10">
          <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-muted-foreground">Supporters</p>
          <p className="mt-2 text-3xl font-extrabold">9</p>
        </Card>
        <Card className="rounded-[4px] border-black/10">
          <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-muted-foreground">Avg Tip</p>
          <p className="mt-2 text-3xl font-extrabold">$6.11</p>
        </Card>
        <Card className="rounded-[4px] border-black/10">
          <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-muted-foreground">Pending Withdraw</p>
          <p className="mt-2 text-3xl font-extrabold">$0</p>
        </Card>
      </div>

      <div className="grid gap-6 lg:grid-cols-[1.2fr_1fr]">
        <Card className="rounded-[4px] border-black/10">
          <h2 className="text-xl font-extrabold tracking-tight">Goal Setter</h2>
          <p className="mt-1 text-sm text-muted-foreground">Set stream goal and keep audience updated live.</p>
          <div className="mt-4 flex gap-2">
            <Input type="number" min={1} value={goal} onChange={(e) => setGoal(Number(e.target.value) || 1)} />
            <Button type="button" className="rounded-[4px] px-5">
              Save
            </Button>
          </div>
          <div className="mt-4 h-3 overflow-hidden rounded-full bg-muted">
            <div className="h-full bg-primary" style={{ width: `${progress}%` }} />
          </div>
          <p className="mt-2 text-sm font-semibold">
            ${raised} raised of ${goal} goal ({progress.toFixed(0)}%)
          </p>
        </Card>

        <Card className="rounded-[4px] border-black/10">
          <h2 className="text-xl font-extrabold tracking-tight">Recent Messages</h2>
          <div className="mt-4 space-y-2">
            {recentMessages.map((tip) => (
              <div key={`${tip.name}-${tip.time}`} className="rounded-[4px] border border-black/10 bg-muted/30 p-3">
                <div className="flex items-center justify-between">
                  <p className="text-sm font-bold">{tip.name}</p>
                  <p className="text-sm font-extrabold text-primary">${tip.amount}</p>
                </div>
                <p className="mt-1 text-sm text-muted-foreground">{tip.message}</p>
                <p className="mt-1 text-[11px] font-bold uppercase tracking-[0.12em] text-muted-foreground">{tip.time}</p>
              </div>
            ))}
          </div>
        </Card>
      </div>
    </DashboardShell>
  );
}
