"use client";

import type { ReactNode } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { ThemeToggle } from "@/components/theme-toggle";
import { UserNav } from "./user-nav";
import { 
  LayoutDashboard, 
  Activity, 
  Settings, 
  Wallet, 
  Heart, 
  ArrowUpRight, 
  Link as LinkIcon, 
  Bell 
} from "lucide-react";

const links = [
  { label: "Overview", href: "/dashboard", icon: LayoutDashboard },
  { label: "Main Dashboard", href: "/dashboard/main-dashboard", icon: Activity },
  { label: "Tip Page", href: "/dashboard/tip-page", icon: Heart },
  { label: "Alerts", href: "/dashboard/alerts", icon: Bell },
  { label: "Wallet", href: "/dashboard/wallet", icon: Wallet },
  { label: "Withdraw", href: "/dashboard/withdraw", icon: ArrowUpRight },
  { label: "Integrations", href: "/dashboard/integrations", icon: LinkIcon },
  { label: "Settings", href: "/dashboard/settings", icon: Settings }
] as const;

export function DashboardShell({ children }: { children: ReactNode }) {
  const pathname = usePathname();

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b border-border bg-card">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-4">
          <Link href="/" className="flex items-center gap-2 text-lg font-extrabold tracking-tight text-foreground">
            <span className="inline-block h-6 w-6 rounded-[4px] bg-primary" />
            GLOWTIPS
          </Link>
          <div className="flex items-center gap-4">
            <ThemeToggle />
            <UserNav />
          </div>
        </div>
      </header>

      <div className="mx-auto grid max-w-7xl gap-6 px-4 py-8 md:grid-cols-[240px_1fr]">
        <aside className="rounded-[4px] border border-border bg-card p-3 shadow-sm">
          <nav className="space-y-1">
            {links.map(({ label, href, icon: Icon }) => (
              <Link
                key={href}
                href={href}
                className={`flex items-center gap-3 rounded-[4px] px-3 py-2.5 text-[11px] font-bold uppercase tracking-[0.16em] transition ${
                  pathname === href
                    ? "bg-primary text-white"
                    : "text-muted-foreground hover:bg-muted hover:text-foreground"
                }`}
              >
                <Icon className="h-4 w-4" />
                {label}
              </Link>
            ))}
          </nav>
        </aside>

        <section className="space-y-6">{children}</section>
      </div>
    </div>
  );
}

