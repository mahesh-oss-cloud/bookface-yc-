import Link from "next/link";
import { redirect } from "next/navigation";
import { getBookfaceSession } from "@/lib/session";
import { ArrowRight, BookOpen, Briefcase, Building2, Handshake, Search, Sparkles, TrendingUp, Users } from "lucide-react";
import { CompanyGridCard, FounderGridCard } from "@/components/ui";
import { formatCount, getCompanies, getFounders, getStats } from "@/lib/data";

export const dynamic = "force-dynamic";

const SAMPLE_THREADS = [
  {
    title: "How do you actually price a usage-based product without killing expansion revenue?",
    author: "Maya Patel",
    company: "Lattice (S18)",
    replies: 34,
    tag: "Pricing",
  },
  {
    title: "Series A in 2026: what metrics are funds really underwriting right now?",
    author: "Daniel Ortiz",
    company: "Ramp (W19)",
    replies: 51,
    tag: "Fundraising",
  },
  {
    title: "First enterprise hire — when do you move off founder-led sales?",
    author: "Priya Nair",
    company: "ServiceTitan (W14)",
    replies: 27,
    tag: "GTM",
  },
];

export default async function HomePage() {
  // Defense in depth: the public root URL must never expose the member directory.
  const session = await getBookfaceSession();
  if (!session) redirect("/signin?next=%2F");

  const stats = getStats();
  const companies = getCompanies();
  const founders = getFounders();

  const featuredFounders = founders
    .filter((f) => f.top && f.image)
    .slice(0, 8);
  const featuredCompanies = companies.filter((c) => c.top).slice(0, 12);

  return (
    <div>
      {/* Hero */}
      <section className="border-b border-[var(--color-line)]">
        <div className="shell py-16 md:py-24">
          <div className="grid lg:grid-cols-[1.15fr_0.85fr] gap-12 lg:gap-20 items-start">
            <div>
              <div className="flex items-center gap-2 mb-5">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src="/yc-logo.svg" alt="" className="w-4 h-4 rounded-[3px]" />
                <div className="kicker">Y Combinator · Founder Community</div>
              </div>
              <h1 className="text-[40px] md:text-[56px] leading-[1.02] tracking-[-0.035em] font-semibold">
                The collective brain
                <br />
                of Y&nbsp;Combinator.
              </h1>
              <p className="text-[15.5px] leading-relaxed text-2 mt-6 max-w-[560px]">
                Bookface is the private home for current and past YC founders. Search every company and
                every founder, ask the questions that matter, and get answers from people who have
                already solved them.
              </p>

              <form action="/search" method="get" className="mt-8 flex flex-col sm:flex-row gap-2.5 max-w-[560px]">
                <div className="relative flex-1">
                  <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[var(--color-ink-3)]" />
                  <input
                    name="q"
                    placeholder="Search 13,700+ founders and 6,300+ companies…"
                    className="!pl-10 !py-3 !text-[14px]"
                    aria-label="Search Bookface"
                  />
                </div>
                <button type="submit" className="btn btn-accent btn-lg">
                  Search
                </button>
              </form>

              <div className="flex flex-wrap items-center gap-2 mt-4">
                <span className="text-[12px] text-3">Try</span>
                {["Fintech", "AI", "W26", "Marketplace"].map((t) => (
                  <Link key={t} href={`/search?q=${encodeURIComponent(t)}`} className="chip hover:border-[var(--color-line-strong)]">
                    {t}
                  </Link>
                ))}
              </div>
            </div>

            <div className="card p-6 lg:p-7">
              <div className="flex items-center justify-between">
                <div className="kicker">The network</div>
                <span className="chip chip-accent">Live directory</span>
              </div>
              <div className="grid grid-cols-2 gap-x-6 gap-y-7 mt-6">
                <div>
                  <div className="stat-num">{formatCount(stats.companies)}</div>
                  <div className="text-[12px] text-2 mt-1.5">YC companies</div>
                </div>
                <div>
                  <div className="stat-num">{formatCount(stats.founders)}</div>
                  <div className="text-[12px] text-2 mt-1.5">YC founders</div>
                </div>
                <div>
                  <div className="stat-num">{stats.batches}</div>
                  <div className="text-[12px] text-2 mt-1.5">Batches since 2005</div>
                </div>
                <div>
                  <div className="stat-num">$1T+</div>
                  <div className="text-[12px] text-2 mt-1.5">Combined valuation</div>
                </div>
              </div>
              <hr className="divide my-6" />
              <div className="flex items-center justify-between text-[12.5px]">
                <span className="text-2">Every founder. Every batch.</span>
                <Link href="/founders" className="link-underline font-medium inline-flex items-center gap-1">
                  Browse <ArrowRight size={13} />
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Directory */}
      <section className="shell py-16">
        <div className="flex items-end justify-between gap-4 mb-7">
          <div>
            <div className="kicker mb-2">01 — The directory</div>
            <h2 className="text-[26px] md:text-[30px]">Find the exact founder you need.</h2>
            <p className="text-[14px] text-2 mt-2 max-w-[620px]">
              Filter by industry, expertise, batch, or location. Then message them directly.
            </p>
          </div>
          <Link href="/founders" className="btn btn-sm shrink-0">
            All founders <ArrowRight size={14} />
          </Link>
        </div>
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-3">
          {featuredFounders.map((f) => (
            <FounderGridCard key={f.id} founder={f} />
          ))}
        </div>
      </section>

      {/* Companies */}
      <section className="border-y border-[var(--color-line)] surface">
        <div className="shell py-16">
          <div className="flex items-end justify-between gap-4 mb-7">
            <div>
              <div className="kicker mb-2">02 — The companies</div>
              <h2 className="text-[26px] md:text-[30px]">Every YC company, one search away.</h2>
            </div>
            <Link href="/companies" className="btn btn-sm shrink-0">
              All companies <ArrowRight size={14} />
            </Link>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-3">
            {featuredCompanies.map((c) => (
              <CompanyGridCard key={c.id} company={c} />
            ))}
          </div>
        </div>
      </section>

      {/* Forum */}
      <section className="shell py-16">
        <div className="grid lg:grid-cols-[0.9fr_1.1fr] gap-10 lg:gap-16 items-start">
          <div>
            <div className="kicker mb-2">03 — The collective brain</div>
            <h2 className="text-[26px] md:text-[30px]">Signal, not noise.</h2>
            <p className="text-[14px] text-2 mt-3 leading-relaxed">
              Fundraising, product, legal, hiring, founder life. Every question is answered by a peer
              who has been in the same seat. High trust, zero spectators.
            </p>
            <Link href="/forum" className="btn btn-sm mt-5">
              Open the forum <ArrowRight size={14} />
            </Link>
          </div>
          <div className="space-y-2.5">
            {SAMPLE_THREADS.map((t) => (
              <Link key={t.title} href="/forum" className="card card-hover block px-4 py-4">
                <div className="flex items-center gap-2 mb-2">
                  <span className="chip chip-accent">{t.tag}</span>
                  <span className="kicker">{t.replies} replies</span>
                </div>
                <div className="text-[14px] font-medium leading-snug">{t.title}</div>
                <div className="text-[11.5px] text-2 mt-2 mono">
                  {t.author} · {t.company}
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Vault */}
      <section className="border-t border-[var(--color-line)]">
        <div className="shell py-16">
          <div className="kicker mb-2">04 — The vault</div>
          <h2 className="text-[26px] md:text-[30px] mb-7">Resources you can&apos;t get anywhere else.</h2>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-3">
            {[
              { icon: BookOpen, title: "Proven playbooks", desc: "Pitch decks, sales scripts, and go-to-market guides from YC partners and alumni." },
              { icon: Handshake, title: "Exclusive deals", desc: "Cloud credits, legal, HR, and tooling discounts negotiated for YC companies." },
              { icon: TrendingUp, title: "Investor lists", desc: "Curated, active investors with notes on stage, sector, and the best intro path." },
              { icon: Briefcase, title: "Talent network", desc: "Roles inside YC companies, and founders looking for their next operator." },
            ].map(({ icon: Icon, title, desc }) => (
              <Link key={title} href="/resources" className="card card-hover p-5">
                <Icon size={18} className="text-[var(--color-accent)]" />
                <div className="font-medium mt-4">{title}</div>
                <div className="text-[12.5px] text-2 mt-1.5 leading-relaxed">{desc}</div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="border-t border-[var(--color-line)]">
        <div className="shell py-16">
          <div className="card p-8 md:p-12 flex flex-col md:flex-row md:items-center justify-between gap-8">
            <div>
              <div className="flex items-center gap-2 mb-3">
                <span className="chip chip-accent"><Sparkles size={11} /> Pay it forward</span>
                <span className="kicker">The YC way</span>
              </div>
              <h2 className="text-[26px] md:text-[34px]">Ask. Answer. Ship faster.</h2>
              <p className="text-[14px] text-2 mt-2 max-w-[520px]">
                The best founders in the world are already in the room. The only thing missing is your
                question.
              </p>
            </div>
            <div className="flex flex-wrap gap-2.5">
              <Link href="/founders" className="btn btn-accent btn-lg">
                <Users size={16} /> Founder directory
              </Link>
              <Link href="/companies" className="btn btn-lg">
                <Building2 size={16} /> Company directory
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
