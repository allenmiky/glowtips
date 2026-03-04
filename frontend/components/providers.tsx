"use client";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ThemeProvider } from "next-themes";
import { ReactNode, useState } from "react";
import { Toaster } from "react-hot-toast";

export function AppProviders({ children }: { children: ReactNode }) {
  const [queryClient] = useState(() => new QueryClient());

  return (
    <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
      <QueryClientProvider client={queryClient}>
        {children}
        <Toaster 
          position="top-right"
          toastOptions={{
            duration: 3000,
            style: {
              borderRadius: "4px",
              background: "hsl(var(--card))",
              color: "hsl(var(--foreground))",
              border: "1px solid hsl(var(--border))",
              fontSize: "12px",
              fontWeight: "600",
              letterSpacing: "0.02em",
              padding: "12px 16px",
              boxShadow: "var(--shadow-lg)",
            },
            success: {
              iconTheme: {
                primary: "hsl(var(--primary))",
                secondary: "white",
              },
            },
          }}
        />
      </QueryClientProvider>
    </ThemeProvider>
  );
}
