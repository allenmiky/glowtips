"use client";

import type { ReactNode } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { ThemeToggle } from "@/components/theme-toggle";
import { UserNav } from "./user-nav";

const links = [
  ["Overview", "/dashboard"],
  ["Main Dashboard", "/dashboard/main-dashboard"],
  ["Tip Page", "/dashboard/tip-page"],
  ["Alerts", "/dashboard/alerts"],
  ["Wallet", "/dashboard/wallet"],
  ["Withdraw", "/dashboard/withdraw"],
  ["Integrations", "/dashboard/integrations"],
  ["Settings", "/dashboard/settings"]
] as const;

export function DashboardShell({ children }: { children: ReactNode }) {
  const pathname = usePathname();

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b border-black/10 bg-card">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-4">
          <Link href="/" className="flex items-center gap-2 text-lg font-extrabold tracking-tight text-foreground">
            <span className="inline-block h-6 w-6 rotate-3 rounded-[4px] bg-primary" />
            GLOWTIPS
          </Link>
          <div className="flex items-center gap-4">
            <ThemeToggle />
            <UserNav />
          </div>
        </div>
      </header>

      <div className="mx-auto grid max-w-7xl gap-6 px-4 py-8 md:grid-cols-[240px_1fr]">
        <aside className="rounded-[4px] border border-black/10 bg-card p-3 shadow-sm">
          <nav className="space-y-1">
            {links.map(([label, href]) => (
              <Link
                key={href}
                href={href}
                className={`block rounded-[4px] px-3 py-2 text-[11px] font-bold uppercase tracking-[0.16em] transition ${
                  pathname === href
                    ? "bg-primary text-white"
                    : "text-muted-foreground hover:bg-black/5 hover:text-foreground"
                }`}
              >
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
