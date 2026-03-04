"use client";

import { useMutation, useQuery } from "@tanstack/react-query";
import { use, useState } from "react";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { apiRequest } from "@/lib/api-client";

const formSchema = z.object({
  supporterName: z.string().min(2),
  amount: z.coerce.number().min(1),
  message: z.string().max(280).optional()
});

type FormValues = z.infer<typeof formSchema>;
type PaymentMethod = "wallet" | "easypaisa" | "jazzcash" | "card";

type Creator = {
  id: string;
  username: string;
  displayName: string;
  avatarUrl?: string;
  goalAmount: number;
  goalRaised: number;
};

export default function PublicTipPage({ params }: { params: Promise<{ username: string }> }) {
  const { username } = use(params);
  const [isPaymentOpen, setIsPaymentOpen] = useState(false);
  const [pendingTip, setPendingTip] = useState<FormValues | null>(null);
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod | "">("");
  const [payerPhone, setPayerPhone] = useState("");
  const [payerEmail, setPayerEmail] = useState("");

  const creatorQuery = useQuery({
    queryKey: ["creator", username],
    queryFn: () => apiRequest<Creator>(`/api/v1/creators/public/${username}`)
  });

  const form = useForm<FormValues>({ resolver: zodResolver(formSchema) });
  const messageValue = form.watch("message") ?? "";

  const tipMutation = useMutation({
    mutationFn: async (values: FormValues) => {
      const idempotencyKey = `${username}_${Date.now()}`;
      const paymentIntent = await apiRequest<{ tipId: string; paymentIntent: string }>("/api/v1/tips/payment-intent", {
        method: "POST",
        body: {
          creatorId: creatorQuery.data?.id,
          supporterName: values.supporterName,
          amount: values.amount,
          message: values.message,
          idempotencyKey
        }
      });

      await apiRequest("/api/v1/tips/confirm", {
        method: "POST",
        body: {
          tipId: paymentIntent.tipId,
          providerRef: paymentIntent.paymentIntent
        }
      });
    },
    onSuccess: () => {
      toast.success("Tip sent successfully");
      form.reset();
      setPendingTip(null);
      setPaymentMethod("");
      setPayerPhone("");
      setPayerEmail("");
      setIsPaymentOpen(false);
    },
    onError: (error) => toast.error(error.message)
  });

  if (!creatorQuery.data) {
    return <main className="mx-auto max-w-xl p-4">Loading...</main>;
  }

  const progress = creatorQuery.data.goalAmount > 0 ? (creatorQuery.data.goalRaised / creatorQuery.data.goalAmount) * 100 : 0;
  const presetAmounts = [10, 30, 50, 100];
  const recentActivity = [
    { name: "Kaif Ali", amount: 30, time: "about 6 hours ago" },
    { name: "Sarah Stream", amount: 15, time: "about 2 hours ago" },
    { name: "Noor Gaming", amount: 50, time: "about 20 mins ago" }
  ];

  const openPaymentModal = (values: FormValues) => {
    setPendingTip(values);
    setIsPaymentOpen(true);
  };

  const confirmPayment = async () => {
    if (!pendingTip) return;
    if (!payerPhone.trim() || !payerEmail.trim()) {
      toast.error("Phone and email are required");
      return;
    }
    if (!paymentMethod) {
      toast.error("Please select a payment method");
      return;
    }

    await tipMutation.mutateAsync(pendingTip);
  };

  return (
    <main className="mx-auto min-h-screen max-w-6xl p-4 pt-10">
      <div className="grid gap-6 lg:grid-cols-[1.65fr_1fr]">
        <Card className="rounded-[6px] border-black/10">
          <h1 className="text-3xl font-extrabold tracking-tight">Support {creatorQuery.data.displayName}</h1>
          <p className="mt-2 text-sm text-muted-foreground">Send alert with your name, tip amount, and message.</p>
          <div className="mt-4 h-2 overflow-hidden rounded-full bg-muted">
            <div className="h-full bg-accent" style={{ width: `${Math.min(progress, 100)}%` }} />
          </div>

          <form className="mt-6 space-y-4" onSubmit={form.handleSubmit(openPaymentModal)}>
            <div>
              <p className="mb-2 text-[11px] font-bold uppercase tracking-[0.18em] text-muted-foreground">Viewer Name</p>
              <Input placeholder="Enter your name" {...form.register("supporterName")} />
            </div>

            <div>
              <div className="mb-2 flex items-center justify-between">
                <p className="text-[11px] font-bold uppercase tracking-[0.18em] text-muted-foreground">Tip Amount</p>
                <span className="rounded-[4px] bg-primary/10 px-2 py-1 text-[10px] font-bold uppercase tracking-[0.12em] text-primary">
                  Minimum: 1 USD
                </span>
              </div>
              <Input type="number" step="0.01" placeholder="Amount" {...form.register("amount")} />
              <div className="mt-2 flex flex-wrap gap-2">
                {presetAmounts.map((value) => (
                  <Button key={value} type="button" variant="outline" className="rounded-[4px]" onClick={() => form.setValue("amount", value)}>
                    ${value}
                  </Button>
                ))}
              </div>
            </div>

            <div>
              <p className="mb-2 text-[11px] font-bold uppercase tracking-[0.18em] text-muted-foreground">Message</p>
              <textarea
                placeholder="Write your message..."
                maxLength={280}
                className="min-h-[120px] w-full rounded-xl border border-border bg-card p-3 text-sm outline-none transition duration-200 focus:border-accent"
                {...form.register("message")}
              />
              <p className="mt-1 text-right text-[11px] text-muted-foreground">{messageValue.length}/280</p>
            </div>

            <Button className="w-full rounded-[4px] py-3 text-xs font-black uppercase tracking-[0.2em]" type="submit" disabled={tipMutation.isPending}>
              Send Alert
            </Button>
          </form>
        </Card>

        <div className="space-y-4">
          <Card className="rounded-[6px] border-black/10">
            <p className="text-[11px] font-bold uppercase tracking-[0.2em] text-primary">Live Preview</p>
            <div className="mt-4 rounded-[6px] border border-black/10 bg-muted/20 p-5">
              <p className="text-sm font-extrabold">{pendingTip?.supporterName || "{sendername}"} sent ${pendingTip?.amount || "{amount}"}</p>
              <p className="mt-2 text-sm text-muted-foreground">{pendingTip?.message || "{message}"}</p>
            </div>
          </Card>

          <Card className="rounded-[6px] border-black/10">
            <p className="text-[11px] font-bold uppercase tracking-[0.2em] text-primary">Recent Activity</p>
            <div className="mt-3 space-y-2">
              {recentActivity.map((activity) => (
                <div key={`${activity.name}-${activity.time}`} className="rounded-[4px] border border-black/10 bg-muted/30 px-3 py-2">
                  <p className="text-xs font-bold uppercase tracking-[0.08em]">{activity.name}</p>
                  <p className="text-lg font-extrabold text-primary">${activity.amount} USD</p>
                  <p className="text-[11px] text-muted-foreground">{activity.time}</p>
                </div>
              ))}
            </div>
          </Card>

          <Card className="rounded-[6px] border-black/10">
            <p className="text-[11px] font-bold uppercase tracking-[0.2em] text-primary">Audio Alerts</p>
            <div className="mt-3 grid grid-cols-2 gap-2">
              {["Run", "Applause", "Airhorn", "GG"].map((item) => (
                <button
                  key={item}
                  type="button"
                  className="rounded-[4px] border border-black/10 bg-muted/30 px-3 py-2 text-xs font-bold uppercase tracking-[0.12em] hover:bg-muted/50"
                >
                  {item}
                </button>
              ))}
            </div>
          </Card>
        </div>
      </div>

      {isPaymentOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4">
          <div className="w-full max-w-2xl rounded-[8px] border border-black/20 bg-card p-6 shadow-xl">
            <div className="flex items-center justify-between">
              <h2 className="text-2xl font-extrabold tracking-tight">Select Payment Method</h2>
              <button type="button" className="text-sm font-bold text-muted-foreground hover:text-foreground" onClick={() => setIsPaymentOpen(false)}>
                Close
              </button>
            </div>

            <div className="mt-4 grid gap-3 sm:grid-cols-2">
              <div>
                <p className="mb-2 text-[11px] font-bold uppercase tracking-[0.16em] text-muted-foreground">Phone Number</p>
                <Input placeholder="03XXXXXXXXX" value={payerPhone} onChange={(e) => setPayerPhone(e.target.value)} />
              </div>
              <div>
                <p className="mb-2 text-[11px] font-bold uppercase tracking-[0.16em] text-muted-foreground">Email Address</p>
                <Input placeholder="you@example.com" value={payerEmail} onChange={(e) => setPayerEmail(e.target.value)} />
              </div>
            </div>

            <p className="mt-5 text-center text-sm font-semibold">Choose Payment Method</p>
            <div className="mt-3 grid gap-3 sm:grid-cols-2">
              {[
                { value: "wallet", label: "Wallet" },
                { value: "easypaisa", label: "EasyPaisa" },
                { value: "jazzcash", label: "JazzCash" },
                { value: "card", label: "Credit Card" }
              ].map((item) => (
                <button
                  key={item.value}
                  type="button"
                  onClick={() => setPaymentMethod(item.value as PaymentMethod)}
                  className={`rounded-[6px] border px-4 py-3 text-left text-sm font-bold transition ${
                    paymentMethod === item.value ? "border-primary bg-primary/10 text-foreground" : "border-border bg-card hover:bg-muted/30"
                  }`}
                >
                  {item.label}
                </button>
              ))}
            </div>

            <div className="mt-6 flex justify-end gap-2">
              <Button type="button" variant="outline" onClick={() => setIsPaymentOpen(false)}>
                Cancel
              </Button>
              <Button type="button" onClick={confirmPayment} disabled={tipMutation.isPending}>
                {tipMutation.isPending ? "Processing..." : "Pay and Send Tip"}
              </Button>
            </div>
          </div>
        </div>
      )}
    </main>
  );
}
