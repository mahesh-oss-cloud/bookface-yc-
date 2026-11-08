import Link from "next/link";
import { ArrowRight, Building2, Users } from "lucide-react";
import { CompanyRow, EmptyState, FounderRow } from "@/components/ui";
import { getCompanies, getFounders, searchCompanies, searchFounders } from "@/lib/data";

export const dynamic = "force-dynamic";

type SP = Promise<Record<string, string | string[] | undefined>>;

export default async function SearchPage({ searchParams }: { searchParams: SP }) {
  const sp = await searchParams;
  const q = (Array.isArray(sp.q) ? sp.q[0] : sp.q) ?? "";

  if (!q.trim()) {
    const topFounders = getFounders().filter((f) => f.top && f.image).slice(0, 6);
    const topCompanies = getCompanies().filter((c) => c.top).slice(0, 8);
    return (
      <div className="shell py-10 md:py-14">
        <div className="kicker mb-2">Search</div>
        <h1 className="text-[32px] md:text-[40px]">Search Bookface</h1>
        <p className="text-[14px] text-2 mt-2">Find any company or founder across the YC network.</p>

        <div className="mt-10 grid lg:grid-cols-2 gap-10">
          <section>
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-[18px] flex items-center gap-2">
                <Building2 size={16} /> Notable companies
              </h2>
              <Link href="/companies" className="btn btn-sm">All companies</Link>
            </div>
            <div className="space-y-2">
              {topCompanies.map((c) => (
                <CompanyRow key={c.id} company={c} />
              ))}
            </div>
          </section>
          <section>
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-[18px] flex items-center gap-2">
                <Users size={16} /> Notable founders
              </h2>
              <Link href="/founders" className="btn btn-sm">All founders</Link>
            </div>
            <div className="space-y-2">
              {topFounders.map((f) => (
                <FounderRow key={f.id} founder={f} />
              ))}
            </div>
          </section>
        </div>
      </div>
    );
  }

  const companies = searchCompanies({ q, perPage: 8 });
  const founders = searchFounders({ q, perPage: 12 });

  return (
    <div className="shell py-10 md:py-14">
      <div className="kicker mb-2">Search results</div>
      <h1 className="text-[30px] md:text-[38px]">&ldquo;{q}&rdquo;</h1>
      <p className="text-[13.5px] text-2 mt-2">
        {(companies.total + founders.total).toLocaleString("en-US")} results across companies and founders
      </p>

      <div className="grid lg:grid-cols-2 gap-10 mt-10 items-start">
        <section>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-[18px] flex items-center gap-2">
              <Building2 size={16} /> Companies <span className="chip">{companies.total.toLocaleString("en-US")}</span>
            </h2>
            {companies.total > 0 && (
              <Link href={`/companies?q=${encodeURIComponent(q)}`} className="btn btn-sm">
                View all <ArrowRight size={13} />
              </Link>
            )}
          </div>
          {companies.items.length === 0 ? (
            <EmptyState title="No companies match" />
          ) : (
            <div className="space-y-2">
              {companies.items.map((c) => (
                <CompanyRow key={c.id} company={c} />
              ))}
            </div>
          )}
        </section>

        <section>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-[18px] flex items-center gap-2">
              <Users size={16} /> Founders <span className="chip">{founders.total.toLocaleString("en-US")}</span>
            </h2>
            {founders.total > 0 && (
              <Link href={`/founders?q=${encodeURIComponent(q)}`} className="btn btn-sm">
                View all <ArrowRight size={13} />
              </Link>
            )}
          </div>
          {founders.items.length === 0 ? (
            <EmptyState title="No founders match" />
          ) : (
            <div className="space-y-2">
              {founders.items.map((f) => (
                <FounderRow key={f.id} founder={f} />
              ))}
            </div>
          )}
        </section>
      </div>
    </div>
  );
}
