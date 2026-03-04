"use client";

import { Card } from "@/components/ui/card";
import { motion } from "framer-motion";

export function MarketingHero() {
  return (
    <section className="mx-auto max-w-6xl px-4 py-16">
      <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.2 }}>
        <Card className="overflow-hidden border-accent/40 bg-gradient-to-br from-card to-muted/70 p-10">
          <p className="mb-4 text-sm font-bold uppercase tracking-wider text-primary">Comfort-first creator support</p>
          <h1 className="max-w-3xl text-4xl font-extrabold leading-tight md:text-5xl">
            Premium tipping, wallet clarity, and calmer alerts for serious creators.
          </h1>
          <p className="mt-4 max-w-2xl text-muted-foreground">
            GlowTips gives your community a trustworthy way to support your work with transparent fees, instant overlays, and stable payouts.
          </p>
        </Card>
      </motion.div>
    </section>
  );
}
