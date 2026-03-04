import Link from "next/link";
import { ThemeToggle } from "@/components/theme-toggle";

const links = [
  ["Features", "/features"],
  ["How it works", "/how-it-works"],
  ["Pricing", "/pricing"],
  ["FAQ", "/faq"],
  ["Contact", "/contact"]
] as const;

export function MarketingNav() {
  return (
    <header className="sticky top-0 z-20 border-b border-border/70 bg-background/90 backdrop-blur">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-4">
        <Link href="/" className="text-xl font-extrabold tracking-tight text-primary">
          GlowTips
        </Link>
        <nav className="hidden gap-6 md:flex">
          {links.map(([label, href]) => (
            <Link key={href} href={href} className="text-sm text-muted-foreground transition hover:text-foreground">
              {label}
            </Link>
          ))}
        </nav>
        <div className="flex items-center gap-3">
          <Link href="/auth/login" className="text-sm text-muted-foreground hover:text-foreground">
            Login
          </Link>
          <ThemeToggle />
        </div>
      </div>
    </header>
  );
}