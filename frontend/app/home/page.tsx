"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useAccessToken } from "@/hooks/auth";
import { UserNav } from "@/components/dashboard/user-nav";

export default function HomePage() {
  const token = useAccessToken();
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    setIsLoggedIn(!!token);
  }, [token]);

  return (
    <main className="min-h-screen">
      <nav className="mx-auto flex max-w-7xl items-center justify-between px-4 py-6">
        <Link href={isLoggedIn ? "/dashboard" : "/"} className="flex items-center gap-2 text-2xl font-black tracking-tight">
          <span className="inline-block h-9 w-9 rotate-3 rounded-[4px] bg-primary" />
          GLOWTIPS
        </Link>
        <div className="hidden items-center gap-8 text-[10px] font-black uppercase tracking-[0.25em]  md:flex">
          <a href="#features" className="hover:text-primary">
            Features
          </a>
          <a href="#pricing" className="hover:text-primary">
            Pricing
          </a>
          <a href="#about" className="hover:text-primary">
            About
          </a>
        </div>
        <div className="flex items-center gap-3">
          {isLoggedIn ? (
            <UserNav />
          ) : (
            <>
              <Link href="/auth/login">
                <Button variant="outline" className="rounded-[4px] px-5 py-2 text-[11px] font-black uppercase tracking-[0.17em]">
                  Login
                </Button>
              </Link>
              <Link href="/auth/register">
                <Button className="rounded-[4px] px-5 py-2 text-[11px] font-black uppercase tracking-[0.17em]">Get Started</Button>
              </Link>
            </>
          )}
        </div>
      </nav>

      <section className="mx-auto max-w-7xl px-4 pb-16 pt-10 text-center">
        <div className="mx-auto inline-flex items-center gap-2 rounded-[4px] border border-primary/30 bg-primary/10 px-4 py-2 text-[10px] font-black uppercase tracking-[0.2em] text-primary">
          Trusted by creators daily
        </div>
        <h1 className="mx-auto mt-7 max-w-5xl text-5xl font-black uppercase tracking-tight md:text-7xl">
          The clean way to collect tips and show live alerts
        </h1>
        <p className="mx-auto mt-5 max-w-2xl text-sm font-semibold uppercase tracking-[0.08em]  md:text-base">
          One page for supporters, one dashboard for creators, real-time alerts for stream.
        </p>
        <div className="mt-8 flex justify-center gap-3">
          <Link href={isLoggedIn ? "/dashboard" : "/auth/register"}>
            <Button className="rounded-[4px] px-7 py-3 text-[11px] font-black uppercase tracking-[0.2em]">
              {isLoggedIn ? "Go to Dashboard" : "Start Free"}
            </Button>
          </Link>
          <Link href="/how-it-works">
            <Button variant="outline" className="rounded-[4px] px-7 py-3 text-[11px] font-black uppercase tracking-[0.2em]">
              How it works
            </Button>
          </Link>
        </div>
      </section>

      <section id="features" className="mx-auto grid max-w-7xl gap-4 px-4 pb-16 md:grid-cols-3">
        <Card className="rounded-[6px] border-black/10 p-6 shadow-sm">
          <h3 className="text-lg font-black uppercase tracking-tight">Ledger-backed wallet</h3>
          <p className="mt-2 text-sm ">Every confirmed tip updates wallet via immutable ledger entries.</p>
        </Card>
        <Card className="rounded-[6px] border-black/10 p-6 shadow-sm">
          <h3 className="text-lg font-black uppercase tracking-tight">OBS-ready alerts</h3>
          <p className="mt-2 text-sm ">Creator-specific socket channels with low-latency alert delivery.</p>
        </Card>
        <Card className="rounded-[6px] border-black/10 p-6 shadow-sm">
          <h3 className="text-lg font-black uppercase tracking-tight">Transparent fees</h3>
          <p className="mt-2 text-sm ">Platform fee can be shown clearly so supporters know exact split.</p>
        </Card>
      </section>

      <section id="pricing" className="mx-auto max-w-7xl px-4 pb-16">
        <Card className="rounded-[6px] border-black/10 p-8 shadow-sm text-center md:text-left">
          <p className="text-[11px] font-black uppercase tracking-[0.2em] text-primary">Pricing</p>
          <h2 className="mt-2 text-3xl font-black uppercase tracking-tight">Simple and creator-first</h2>
          <p className="mt-3 max-w-2xl text-sm ">No setup headache. Launch quickly and upgrade when your channel scales.</p>
        </Card>
      </section>

      <section id="about" className="mx-auto max-w-7xl px-4 pb-16">
        <Card className="rounded-[6px] border-black/10 p-8 shadow-sm text-center md:text-left">
          <p className="text-[11px] font-black uppercase tracking-[0.2em] text-primary">About</p>
          <h2 className="mt-2 text-3xl font-black uppercase tracking-tight">Built for streamers and creators</h2>
          <p className="mt-3 max-w-3xl text-sm ">
            GlowTips combines tip pages, overlays, wallet accounting, and creator controls in one focused platform.
          </p>
        </Card>
      </section>
    </main>
  );
}

