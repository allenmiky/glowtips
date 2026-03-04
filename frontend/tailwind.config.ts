import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: ["class"],
  content: ["./app/**/*.{ts,tsx}", "./components/**/*.{ts,tsx}", "./lib/**/*.{ts,tsx}"],
  theme: {
    extend: {
      borderRadius: {
        xl: "20px"
      },
      colors: {
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        card: "hsl(var(--card))",
        "card-foreground": "hsl(var(--card-foreground))",
        muted: "hsl(var(--muted))",
        "muted-foreground": "hsl(var(--muted-foreground))",
        border: "hsl(var(--border))",
        accent: "hsl(var(--accent))",
        primary: "hsl(var(--primary))"
      },
      boxShadow: {
        glow: "0 0 24px -8px rgba(7, 214, 189, 0.55)"
      },
      fontFamily: {
        sans: ["Manrope", "ui-sans-serif", "system-ui"]
      }
    }
  },
  plugins: []
};

export default config;