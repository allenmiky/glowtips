import Link from "next/link";

type AuthBrandProps = {
  title: string;
  subtitle: string;
};

export function AuthBrand({ title, subtitle }: AuthBrandProps) {
  return (
    <aside className="hidden min-h-[640px] rounded-[4px] border border-black/10 bg-card p-10 lg:flex lg:flex-col lg:justify-between">
      <div>
        <Link href="/" className="inline-flex items-center gap-3">
          <span className="inline-flex h-12 w-12 items-center justify-center rounded-[4px] bg-primary text-2xl font-black text-white">G</span>
          <span className="text-2xl font-black tracking-tight">GlowTips</span>
        </Link>

        <p className="mt-12 text-[11px] font-bold uppercase tracking-[0.28em] text-primary">Creator Platform</p>
        <h2 className="mt-3 max-w-sm text-4xl font-black leading-tight tracking-tight">{title}</h2>
        <p className="mt-4 max-w-md text-sm ">{subtitle}</p>
      </div>

      <div className="rounded-[4px] border border-black/10 bg-muted/30 p-5">
        <p className="text-[11px] font-bold uppercase tracking-[0.14em] ">Trusted by streamers</p>
        <p className="mt-2 text-sm font-semibold">Fast tips, clean alerts, and simple payouts in one place.</p>
      </div>
    </aside>
  );
}

