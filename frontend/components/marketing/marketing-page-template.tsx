import { MarketingNav } from "@/components/marketing/marketing-nav";

export function MarketingPageTemplate({ title, description }: { title: string; description: string }) {
  return (
    <main>
      <MarketingNav />
      <section className="mx-auto max-w-4xl px-4 py-16">
        <h1 className="text-4xl font-extrabold">{title}</h1>
        <p className="mt-4 text-lg text-muted-foreground">{description}</p>
      </section>
    </main>
  );
}