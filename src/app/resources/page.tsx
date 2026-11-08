import Link from "next/link";
import { ArrowUpRight, BookOpen, Briefcase, Handshake, TrendingUp } from "lucide-react";

export const metadata = {
  title: "Resources — Bookface",
  description: "Playbooks, deals, investor lists, and the YC talent network.",
};

const SECTIONS = [
  {
    icon: BookOpen,
    title: "Proven playbooks",
    desc: "Field-tested guides from YC partners and alumni.",
    items: [
      { name: "The seed pitch deck that raised $4.2M", meta: "Deck · 14 slides", by: "YC Partner" },
      { name: "Founder-led sales: first 20 customers", meta: "Guide · 22 min", by: "Alumni, B2B SaaS" },
      { name: "Hiring your first 10 engineers", meta: "Playbook · 18 min", by: "YC People Ops" },
      { name: "Pricing: from seats to usage", meta: "Memo · 9 min", by: "Alumni, Fintech" },
      { name: "Series A metrics that actually matter", meta: "Benchmarks · 2026", by: "YC Finance" },
      { name: "Incident response for small teams", meta: "Runbook · 11 min", by: "Alumni, DevTools" },
    ],
  },
  {
    icon: Handshake,
    title: "Exclusive deals",
    desc: "Negotiated for YC companies, not available elsewhere.",
    items: [
      { name: "$200k in cloud credits", meta: "Infrastructure · 12 months", by: "Cloud partner" },
      { name: "Incorporation + first-year legal", meta: "Legal · Flat fee", by: "YC Legal" },
      { name: "Payroll and benefits at cost", meta: "HR · Per employee", by: "HR partner" },
      { name: "Observability, 80% off year one", meta: "Engineering · Annual", by: "DevTools partner" },
      { name: "Fractional CFO network", meta: "Finance · Member rate", by: "YC Finance" },
      { name: "Recruiting credits", meta: "Talent · $15k credit", by: "Talent partner" },
    ],
  },
  {
    icon: TrendingUp,
    title: "Investor lists",
    desc: "Curated, active investors with the best intro path.",
    items: [
      { name: "Seed funds writing first checks", meta: "48 firms · Updated weekly", by: "YC" },
      { name: "Series A leads by sector", meta: "31 firms · Fintech, AI, Bio", by: "YC" },
      { name: "Angels who move fast", meta: "120 operators · $25k–$100k", by: "Alumni" },
      { name: "International first-check funds", meta: "EU, India, LATAM", by: "YC" },
      { name: "Climate and hard tech", meta: "22 funds · Deep tech", by: "YC" },
      { name: "Healthcare and bio", meta: "18 funds · Regulated", by: "YC" },
    ],
  },
  {
    icon: Briefcase,
    title: "Talent network",
    desc: "Roles inside YC companies, and operators open to their next thing.",
    items: [
      { name: "Founding engineer — AI infra", meta: "San Francisco · $180k–$240k", by: "W26 company" },
      { name: "Head of Growth — Fintech", meta: "New York · $200k+", by: "S24 company" },
      { name: "Design lead — developer tools", meta: "Remote · $170k–$210k", by: "W23 company" },
      { name: "Chief of Staff", meta: "London · $140k–$180k", by: "S22 company" },
      { name: "Operators open to founding", meta: "42 people · Ex-YC", by: "Talent network" },
      { name: "Technical co-founder matching", meta: "Vetted · Batch-aware", by: "YC" },
    ],
  },
];

export default function ResourcesPage() {
  return (
    <div className="shell py-10 md:py-14">
      <div className="kicker mb-2">The vault</div>
      <h1 className="text-[32px] md:text-[40px]">Resources</h1>
      <p className="text-[14px] text-2 mt-2 max-w-[640px]">
        The playbooks, deals, investor lists, and talent that YC founders get — collected in one place
        and kept current by the community.
      </p>

      <div className="space-y-12 mt-10">
        {SECTIONS.map((s) => (
          <section key={s.title}>
            <div className="flex items-start justify-between gap-4 mb-4">
              <div className="flex items-start gap-3">
                <div className="w-9 h-9 rounded-md surface hair flex items-center justify-center shrink-0">
                  <s.icon size={16} className="text-[var(--color-accent)]" />
                </div>
                <div>
                  <h2 className="text-[20px]">{s.title}</h2>
                  <p className="text-[12.5px] text-2 mt-0.5">{s.desc}</p>
                </div>
              </div>
              <span className="chip shrink-0">{s.items.length}</span>
            </div>
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-2.5">
              {s.items.map((it) => (
                <div key={it.name} className="card card-hover p-4 flex items-start justify-between gap-3">
                  <div className="min-w-0">
                    <div className="text-[13.5px] font-medium leading-snug">{it.name}</div>
                    <div className="text-[11.5px] text-2 mt-1 mono">{it.meta}</div>
                    <div className="text-[11px] text-3 mt-1.5 mono uppercase tracking-wide">{it.by}</div>
                  </div>
                  <ArrowUpRight size={14} className="text-[var(--color-ink-3)] shrink-0 mt-0.5" />
                </div>
              ))}
            </div>
          </section>
        ))}
      </div>

      <div className="card p-6 mt-12 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <div className="text-[15px] font-medium">Everything here is contributed by founders.</div>
          <div className="text-[12.5px] text-2 mt-1">If you have a playbook or a deal worth sharing, add it to the vault.</div>
        </div>
        <Link href="/forum" className="btn btn-accent btn-sm shrink-0">
          Open the forum
        </Link>
      </div>
    </div>
  );
}
