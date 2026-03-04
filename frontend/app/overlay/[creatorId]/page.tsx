"use client";

import { motion, AnimatePresence } from "framer-motion";
import { use, useEffect, useState } from "react";
import { io } from "socket.io-client";
import { config } from "@/lib/config";
import type { TipConfirmedEvent } from "@/types/alerts";

export default function OverlayPage({ params }: { params: Promise<{ creatorId: string }> }) {
  const { creatorId } = use(params);
  const [event, setEvent] = useState<TipConfirmedEvent | null>(null);

  useEffect(() => {
    const socket = io(config.wsUrl, { path: "/alerts", transports: ["websocket"] });
    socket.emit("alerts:subscribe", creatorId);
    socket.on("tip:confirmed", (payload: TipConfirmedEvent) => {
      setEvent(payload);
      setTimeout(() => setEvent(null), 4200);
    });

    return () => {
      socket.disconnect();
    };
  }, [creatorId]);

  return (
    <main className="min-h-screen p-6">
      <AnimatePresence>
        {event && (
          <motion.div
            initial={{ opacity: 0, y: 24, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -20, scale: 0.97 }}
            transition={{ duration: 0.2 }}
            className="max-w-md rounded-xl border border-accent/40 bg-card px-5 py-4 shadow-glow"
          >
            <p className="text-sm font-semibold text-primary">New Tip Confirmed</p>
            <p className="mt-1 text-2xl font-extrabold">${event.amount.toFixed(2)}</p>
            <p className="mt-1 text-sm">from {event.supporterName}</p>
            {event.message && <p className="mt-2 text-sm text-muted-foreground">{event.message}</p>}
          </motion.div>
        )}
      </AnimatePresence>
    </main>
  );
}
