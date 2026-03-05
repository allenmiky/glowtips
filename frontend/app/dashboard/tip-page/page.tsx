"use client";

import React, { useEffect, useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { 
  Bell, 
  Mic, 
  Settings, 
  Copy, 
  ExternalLink, 
  Image as ImageIcon, 
  Play, 
  Volume2, 
  History,
  AlertCircle
} from "lucide-react";
import { DashboardShell } from "@/components/dashboard/dashboard-shell";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { apiRequest } from "@/lib/api-client";
import { useAccessToken } from "@/hooks/auth";

const brandingSchema = z.object({
  displayName: z.string().min(2),
  avatarUrl: z.string().url().optional().or(z.literal("")),
  goalAmount: z.coerce.number().min(0)
});

const alertSchema = z.object({
  soundEnabled: z.boolean(),
  durationMs: z.number().min(1000).max(30000),
  volume: z.number().min(0).max(100),
  imageLayout: z.string(),
  animation: z.string(),
  fontStyle: z.string(),
  messageTTS: z.boolean(),
  nameAmountTTS: z.boolean(),
  minAmount: z.coerce.number().min(0),
  maxMessageLength: z.number().min(1).max(500),
  filterProfanity: z.boolean(),
  priorityLevel: z.number().min(1).max(10)
});

type BrandingValues = z.infer<typeof brandingSchema>;
type AlertValues = z.infer<typeof alertSchema>;

type CreatorProfile = {
  id: string;
  username: string;
  displayName: string;
  avatarUrl?: string;
  goalAmount: number;
};

type AlertSetting = {
  creatorId: string;
  soundEnabled: boolean;
  durationMs: number;
  volume: number;
  imageLayout: string;
  animation: string;
  fontStyle: string;
  messageTTS: boolean;
  nameAmountTTS: boolean;
  minAmount: number;
  maxMessageLength: number;
  filterProfanity: boolean;
  priorityLevel: number;
  soundUrl?: string;
  imageUrl?: string;
};

type Tip = {
  id: string;
  supporterName: string;
  amount: number;
  message?: string;
  status: string;
  createdAt: string;
};

export default function TipPageSettings() {
  const token = useAccessToken();
  const queryClient = useQueryClient();
  const [activeTab, setActiveTab] = useState<"branding" | "alerts" | "audio" | "history">("audio");

  const brandingForm = useForm<BrandingValues>({
    resolver: zodResolver(brandingSchema),
    defaultValues: { displayName: "", avatarUrl: "", goalAmount: 100 }
  });

  // Queries
  const creatorQuery = useQuery({
    queryKey: ["creator", "me"],
    queryFn: () => apiRequest<CreatorProfile>("/api/v1/creators/me", { token }),
    enabled: Boolean(token)
  });

  useEffect(() => {
    if (!creatorQuery.data) return;
    brandingForm.reset({
      displayName: creatorQuery.data.displayName || "",
      avatarUrl: creatorQuery.data.avatarUrl || "",
      goalAmount: Number(creatorQuery.data.goalAmount) || 100
    });
  }, [creatorQuery.data, brandingForm]);

  const alertsQuery = useQuery({
    queryKey: ["alerts", "settings"],
    queryFn: () => apiRequest<AlertSetting>("/api/v1/alerts/settings", { token }),
    enabled: Boolean(token)
  });

  const tipsQuery = useQuery({
    queryKey: ["tips", "history"],
    queryFn: () => apiRequest<Tip[]>("/api/v1/tips/me", { token }),
    enabled: Boolean(token)
  });

  // Mutations
  const brandingMutation = useMutation({
    mutationFn: (values: BrandingValues) =>
      apiRequest("/api/v1/creators/me", {
        method: "PUT",
        token,
        body: { ...values, avatarUrl: values.avatarUrl || undefined }
      }),
    onSuccess: () => {
      toast.success("Branding updated");
      queryClient.invalidateQueries({ queryKey: ["creator", "me"] });
    },
    onError: (err: any) => toast.error(err.message)
  });

  const alertsMutation = useMutation({
    mutationFn: (values: Partial<AlertSetting>) =>
      apiRequest("/api/v1/alerts/settings", {
        method: "PUT",
        token,
        body: values
      }),
    onSuccess: () => {
      toast.success("Alert settings saved");
      queryClient.invalidateQueries({ queryKey: ["alerts", "settings"] });
    },
    onError: (err: any) => toast.error(err.message)
  });

  const copyLink = async (value: string, label: string) => {
    if (!value) return;
    try {
      await navigator.clipboard.writeText(value);
      toast.success(`${label} copied`);
    } catch {
      toast.error("Failed to copy");
    }
  };

  const origin = typeof window !== "undefined" ? window.location.origin : "";
  const tipLink = creatorQuery.data?.username ? `${origin}/u/${creatorQuery.data.username}` : "";
  const overlayLink = creatorQuery.data?.id ? `${origin}/overlay/${creatorQuery.data.id}` : "";
  const fallbackLink = "https://glowtips.com/fallback";

  return (
    <DashboardShell>
      <div className="flex flex-col space-y-6">
        {/* Navigation Tabs */}
        <div className="flex items-center gap-8 border-b border-border pb-1">
          <button
            onClick={() => setActiveTab("branding")}
            className={`flex items-center gap-2 pb-3 text-sm font-bold uppercase tracking-wider transition ${
              activeTab === "branding"
                ? "border-b-2 border-primary text-primary"
                : "text-muted-foreground hover:text-foreground"
            }`}
          >
            <Settings className="h-4 w-4" />
            Branding
          </button>
          <button
            onClick={() => setActiveTab("alerts")}
            className={`flex items-center gap-2 pb-3 text-sm font-bold uppercase tracking-wider transition ${
              activeTab === "alerts"
                ? "border-b-2 border-primary text-primary"
                : "text-muted-foreground hover:text-foreground"
            }`}
          >
            <Bell className="h-4 w-4" />
            Alert Management
          </button>
          <button
            onClick={() => setActiveTab("audio")}
            className={`flex items-center gap-2 pb-3 text-sm font-bold uppercase tracking-wider transition ${
              activeTab === "audio"
                ? "border-b-2 border-primary text-primary"
                : "text-muted-foreground hover:text-foreground"
            }`}
          >
            <Mic className="h-4 w-4" />
            Audio Alert Management
          </button>
          <button
            onClick={() => setActiveTab("history")}
            className={`flex items-center gap-2 pb-3 text-sm font-bold uppercase tracking-wider transition ${
              activeTab === "history"
                ? "border-b-2 border-primary text-primary"
                : "text-muted-foreground hover:text-foreground"
            }`}
          >
            <History className="h-4 w-4" />
            Tips History
          </button>
        </div>

        {/* Tab Content */}
        <div className="animate-fade-in">
          {activeTab === "branding" && (
            <Card className="max-w-2xl">
              <h1 className="text-xl font-black uppercase tracking-tight">Tip Page Branding</h1>
              <p className="mt-1 text-xs text-muted-foreground">Customize how your public tip page looks to supporters.</p>
              
              <form 
                className="mt-8 space-y-6" 
                onSubmit={brandingForm.handleSubmit((values) => brandingMutation.mutate(values))}
              >
                <div className="space-y-4">
                  <div>
                    <label className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">Display Name</label>
                    <Input className="mt-1" {...brandingForm.register("displayName")} />
                  </div>
                  <div>
                    <label className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">Avatar URL</label>
                    <Input className="mt-1" {...brandingForm.register("avatarUrl")} />
                  </div>
                  <div>
                    <label className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">Goal Amount</label>
                    <Input className="mt-1" type="number" {...brandingForm.register("goalAmount")} />
                  </div>
                </div>
                <Button type="submit" disabled={brandingMutation.isPending}>
                  {brandingMutation.isPending ? "Saving..." : "Save Branding"}
                </Button>
              </form>
            </Card>
          )}

          {activeTab === "alerts" && (
            <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
              {/* Top Row */}
              <Card className="flex flex-col items-center justify-center py-8 text-center">
                <h3 className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Alert Box</h3>
                <div className="mt-4 flex flex-col items-center gap-1">
                  <span className="text-[10px] font-medium text-muted-foreground">Status: <span className="text-primary font-bold">Enabled</span></span>
                  <div className="mt-2 h-6 w-12 rounded-full bg-primary relative cursor-pointer">
                    <div className="absolute right-1 top-1 h-4 w-4 rounded-full bg-white" />
                  </div>
                </div>
                <Button variant="outline" className="mt-6 border-primary text-primary hover:bg-primary/10">
                  <Play className="mr-2 h-3 w-3" /> Test Alert
                </Button>
              </Card>

              <Card className="flex flex-col">
                <h3 className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Overlay Link</h3>
                <div className="mt-4 space-y-3">
                  <Input readOnly value={overlayLink} className="bg-muted/30 text-xs font-mono" />
                  <div className="flex gap-2">
                    <Button variant="outline" className="flex-1 text-[10px] font-bold uppercase tracking-tighter" onClick={() => copyLink(overlayLink, "Overlay link")}>
                      <Copy className="mr-2 h-3 w-3" /> Copy
                    </Button>
                    <Button variant="outline" className="flex-1 text-[10px] font-bold uppercase tracking-tighter" onClick={() => window.open(overlayLink, "_blank")}>
                      <ExternalLink className="mr-2 h-3 w-3" /> Open Link
                    </Button>
                  </div>
                </div>
              </Card>

              <Card className="flex flex-col">
                <h3 className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Fallback Link (experimental)</h3>
                <div className="mt-4 space-y-3">
                  <Input readOnly value={fallbackLink} className="bg-muted/30 text-xs font-mono" />
                  <div className="flex gap-2">
                    <Button variant="outline" className="flex-1 text-[10px] font-bold uppercase tracking-tighter" onClick={() => copyLink(fallbackLink, "Fallback link")}>
                      <Copy className="mr-2 h-3 w-3" /> Copy
                    </Button>
                  </div>
                </div>
              </Card>

              {/* Middle Row */}
              <Card className="lg:col-span-1">
                <h3 className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Alert Configuration</h3>
                <div className="mt-6 flex flex-col items-center gap-6">
                  <div className="relative aspect-video w-full rounded-[4px] border border-border bg-muted/20 flex items-center justify-center overflow-hidden">
                    <div className="text-center p-4">
                      <div className="h-12 w-12 bg-primary/20 rounded-[4px] mx-auto mb-2 flex items-center justify-center">
                        <ImageIcon className="h-6 w-6 text-primary" />
                      </div>
                      <p className="text-[10px] font-bold text-primary uppercase">[IMAGE]</p>
                      <p className="text-[9px] text-muted-foreground leading-tight mt-1">SUPPORTNAME sent $12.00 MESSAGEHERE</p>
                    </div>
                    <div className="absolute bottom-2 right-2 flex gap-1">
                      <Button variant="outline" className="h-7 text-[9px] uppercase font-bold">Edit Image</Button>
                      <Button variant="outline" className="h-7 text-[9px] uppercase font-bold">Test Alert</Button>
                    </div>
                  </div>

                  <div className="w-full space-y-4">
                    <div>
                      <label className="text-[9px] font-bold uppercase tracking-widest text-muted-foreground">Alert Animation</label>
                      <select className="w-full mt-1 bg-card border border-border rounded-[4px] px-3 py-2 text-xs focus:ring-1 focus:ring-primary outline-none">
                        <option>Fade In & Out</option>
                        <option>Slide Up</option>
                        <option>Bounce</option>
                      </select>
                    </div>
                    <div>
                      <label className="text-[9px] font-bold uppercase tracking-widest text-muted-foreground">Text Animation</label>
                      <select className="w-full mt-1 bg-card border border-border rounded-[4px] px-3 py-2 text-xs focus:ring-1 focus:ring-primary outline-none">
                        <option>Wiggle</option>
                        <option>Bounce</option>
                        <option>None</option>
                      </select>
                    </div>
                    <div>
                      <label className="text-[9px] font-bold uppercase tracking-widest text-muted-foreground">Text Font Style</label>
                      <select className="w-full mt-1 bg-card border border-border rounded-[4px] px-3 py-2 text-xs focus:ring-1 focus:ring-primary outline-none">
                        <option>Modern (Manrope)</option>
                        <option>Comic Sans</option>
                        <option>Classic</option>
                      </select>
                    </div>
                    <div>
                      <label className="text-[9px] font-bold uppercase tracking-widest text-muted-foreground">Duration</label>
                      <div className="flex items-center gap-4 mt-1">
                        <input type="range" className="flex-1 accent-primary" />
                        <span className="text-xs font-mono text-muted-foreground">4s</span>
                      </div>
                    </div>
                  </div>
                </div>
              </Card>

              <Card className="lg:col-span-1">
                <div className="flex items-center justify-between">
                  <h3 className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Alert Sound</h3>
                  <Mic className="h-4 w-4 text-muted-foreground" />
                </div>
                <div className="mt-6 space-y-6">
                  <div className="flex items-center gap-4 p-3 rounded-[4px] border border-border bg-muted/20">
                    <Volume2 className="h-4 w-4 text-primary" />
                    <div className="flex-1 h-1.5 bg-border rounded-full relative overflow-hidden">
                      <div className="absolute left-0 top-0 h-full w-2/3 bg-primary" />
                    </div>
                    <span className="text-[10px] font-mono text-muted-foreground">0:01 / 0:23</span>
                    <Button variant="outline" className="h-7 text-[9px] uppercase font-bold px-2">Upload Sound</Button>
                  </div>

                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <label className="text-[9px] font-bold uppercase tracking-widest text-muted-foreground">Message Text-To-Speech</label>
                      <div className="h-5 w-10 rounded-full bg-primary relative cursor-pointer">
                        <div className="absolute right-0.5 top-0.5 h-4 w-4 rounded-full bg-white" />
                      </div>
                    </div>
                    <div className="flex items-center justify-between">
                      <label className="text-[9px] font-bold uppercase tracking-widest text-muted-foreground">Name + Amount Text-To-Speech</label>
                      <div className="h-5 w-10 rounded-full bg-primary relative cursor-pointer">
                        <div className="absolute right-0.5 top-0.5 h-4 w-4 rounded-full bg-white" />
                      </div>
                    </div>
                    <div>
                      <label className="text-[9px] font-bold uppercase tracking-widest text-muted-foreground">Volume</label>
                      <div className="flex items-center gap-4 mt-1">
                        <input type="range" className="flex-1 accent-primary" />
                        <span className="text-xs font-mono text-muted-foreground">80%</span>
                      </div>
                    </div>
                  </div>
                </div>
              </Card>

              <Card className="lg:col-span-1 flex flex-col">
                <h3 className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Management</h3>
                <div className="mt-6 space-y-6 flex-1">
                  <div>
                    <label className="text-[9px] font-bold uppercase tracking-widest text-muted-foreground">Min. Amount To Alert (Leave as 0 for any amount)</label>
                    <Input className="mt-2 text-xs" type="number" placeholder="10" />
                  </div>
                  <div>
                    <label className="text-[9px] font-bold uppercase tracking-widest text-muted-foreground">Minimim Amount to show message</label>
                    <Input className="mt-2 text-xs" type="number" placeholder="10" />
                  </div>
                  <div className="p-4 rounded-[4px] border border-dashed border-border bg-muted/10 text-center">
                    <p className="text-[9px] font-bold uppercase text-muted-foreground mb-1">Priority Flow works</p>
                    <p className="text-[8px] text-muted-foreground">The alerts below will be disabled from the message.</p>
                    <div className="mt-3 flex justify-center gap-2">
                      <span className="px-2 py-1 rounded-[2px] border border-border text-[8px] font-bold uppercase">Priority</span>
                      <span className="px-2 py-1 rounded-[2px] bg-primary/10 text-primary text-[8px] font-bold uppercase tracking-tighter">Level 1</span>
                    </div>
                  </div>
                </div>
                <Button className="mt-8 font-black uppercase tracking-widest text-[10px] py-6">Save All Changes</Button>
              </Card>
            </div>
          )}

          {activeTab === "audio" && (
            <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
              {/* Audio Files Card */}
              <Card className="flex flex-col">
                <h3 className="text-[10px] font-black uppercase tracking-widest text-muted-foreground text-center mb-6">Audio Files</h3>
                
                <div className="space-y-6">
                  {/* Selection Row */}
                  <div className="p-4 rounded-[4px] border border-border bg-muted/5 space-y-4">
                    <div className="flex items-center justify-between">
                      <label className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">Select Audio File</label>
                      <select className="bg-card border border-border rounded-[4px] px-3 py-1.5 text-xs focus:ring-1 focus:ring-primary outline-none min-w-[140px]">
                        <option>Audio 1</option>
                        <option>Audio 2</option>
                      </select>
                    </div>
                    <div className="flex gap-2 justify-end">
                      <Button variant="outline" className="bg-primary text-white hover:bg-primary/90 border-none text-[10px] font-bold uppercase h-8 px-4">Test Audio</Button>
                      <Button variant="outline" className="bg-primary text-white hover:bg-primary/90 border-none text-[10px] font-bold uppercase h-8 px-4">Set to Default</Button>
                    </div>
                  </div>

                  {/* Edit Section */}
                  <div className="p-4 rounded-[4px] border border-border bg-muted/5 space-y-4">
                    <div>
                      <label className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground text-center block mb-2">Title</label>
                      <Input className="text-xs h-9" defaultValue="FBI Open Up" />
                    </div>
                    <div>
                      <label className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground text-center block mb-2">Amount (Cannot be less than 30 PKR)</label>
                      <Input className="text-xs h-9" type="number" defaultValue="30" />
                    </div>
                    <Button className="w-full bg-primary text-white hover:bg-primary/90 font-bold uppercase text-[11px] h-10">Save</Button>
                  </div>

                  {/* Player & Upload */}
                  <div className="p-4 rounded-[4px] border border-border bg-muted/5 space-y-4 flex flex-col items-center">
                    <Button variant="outline" className="text-[10px] font-bold uppercase border-border hover:bg-muted h-8">
                      <Mic className="mr-2 h-3 w-3" /> Upload Alert Sound
                    </Button>
                    <div className="w-full bg-white rounded-full p-1 shadow-sm mt-4">
                      <audio controls className="w-full h-8 scale-90 origin-center bg-transparent">
                        <source src="#" type="audio/mpeg" />
                      </audio>
                    </div>
                  </div>
                </div>
              </Card>

              {/* Audio Alert Card */}
              <Card className="flex flex-col">
                <h3 className="text-[10px] font-black uppercase tracking-widest text-muted-foreground text-center mb-6">Audio Alert</h3>
                
                <div className="space-y-8">
                  <div className="flex items-center justify-between p-4 bg-muted/5 rounded-[4px]">
                    <span className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">Manage your Audio Alert</span>
                    <div className="h-5 w-10 rounded-full bg-primary relative cursor-pointer">
                      <div className="absolute right-0.5 top-0.5 h-4 w-4 rounded-full bg-white" />
                    </div>
                  </div>

                  <div className="flex justify-center">
                    <Button className="bg-primary text-white hover:bg-primary/90 px-8 py-4 font-bold uppercase text-[11px]">Set to Default</Button>
                  </div>

                  <div className="space-y-4">
                    <label className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">Alert Animation</label>
                    <div className="space-y-2">
                      <select className="w-full bg-card border border-border rounded-[4px] px-3 py-2 text-xs focus:ring-1 focus:ring-primary outline-none">
                        <option>Fade In Fast</option>
                      </select>
                      <select className="w-full bg-card border border-border rounded-[4px] px-3 py-2 text-xs focus:ring-1 focus:ring-primary outline-none">
                        <option>Fade Out Fast</option>
                      </select>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <label className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">Volume</label>
                    <div className="flex items-center gap-4">
                      <input type="range" className="flex-1 accent-primary" />
                    </div>
                  </div>
                </div>
              </Card>
            </div>
          )}

          {activeTab === "history" && (
            <Card>
              <h1 className="text-xl font-black uppercase tracking-tight">Tips History</h1>
              <p className="mt-1 text-xs text-muted-foreground">View and manage the tips you've received.</p>
              
              <div className="mt-8 border border-border rounded-[4px] overflow-hidden">
                <table className="w-full text-left text-xs">
                  <thead className="bg-muted/50 border-b border-border">
                    <tr>
                      <th className="px-4 py-3 font-black uppercase tracking-widest text-[9px] text-muted-foreground">Supporter</th>
                      <th className="px-4 py-3 font-black uppercase tracking-widest text-[9px] text-muted-foreground">Amount</th>
                      <th className="px-4 py-3 font-black uppercase tracking-widest text-[9px] text-muted-foreground">Message</th>
                      <th className="px-4 py-3 font-black uppercase tracking-widest text-[9px] text-muted-foreground">Status</th>
                      <th className="px-4 py-3 font-black uppercase tracking-widest text-[9px] text-muted-foreground">Date</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border">
                    {tipsQuery.data?.length === 0 && (
                      <tr>
                        <td colSpan={5} className="px-4 py-8 text-center text-muted-foreground italic">
                          No tips received yet.
                        </td>
                      </tr>
                    )}
                    {tipsQuery.data?.map((tip) => (
                      <tr key={tip.id} className="hover:bg-muted/30 transition-colors">
                        <td className="px-4 py-4 font-bold">{tip.supporterName}</td>
                        <td className="px-4 py-4 font-mono text-primary">${Number(tip.amount).toFixed(2)}</td>
                        <td className="px-4 py-4 text-muted-foreground max-w-xs truncate">{tip.message || "-"}</td>
                        <td className="px-4 py-4">
                          <span className={`px-2 py-0.5 rounded-[2px] text-[8px] font-black uppercase tracking-tighter ${
                            tip.status === "CONFIRMED" ? "bg-success/10 text-success" : 
                            tip.status === "PENDING" ? "bg-warning/10 text-warning" : "bg-danger/10 text-danger"
                          }`}>
                            {tip.status}
                          </span>
                        </td>
                        <td className="px-4 py-4 text-muted-foreground">{new Date(tip.createdAt).toLocaleDateString()}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </Card>
          )}
        </div>
      </div>
    </DashboardShell>
  );
}
