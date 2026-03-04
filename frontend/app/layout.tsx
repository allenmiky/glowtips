import type { ReactNode } from "react";
import type { Metadata } from "next";
import "./globals.css";
import { AppProviders } from "@/components/providers";

export const metadata: Metadata = {
  title: "GlowTips",
  description: "Premium tipping and alerts platform",
  icons: {
    icon: "/tab_logo.jpg",
    shortcut: "/tab_logo.jpg",
    apple: "/tab_logo.jpg"
  }
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body>
        <AppProviders>{children}</AppProviders>
      </body>
    </html>
  );
}
