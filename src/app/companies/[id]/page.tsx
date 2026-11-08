import type { ReactNode } from "react";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, ArrowUpRight, ExternalLink, MapPin, Users } from "lucide-react";
import { Avatar, BatchChip, CompanyLogo, MessageLink } from "@/components/ui";
import { batchLabel, formatCount, getCompanies, getCompany, getFoundersByCompany } from "@/lib/data";

export const dynamic = "force-dynamic";

export default async function CompanyDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const company = getCompany(decodeURIComponent(id));
  if (!company) notFound();

  const founders = getFoundersByCompany(company.id);
  const related = getCompanies()
    .filter((c) => c.batchShort === company.batchShort && c.id !== company.id)
    .slice(0, 8);

  const website = company.website?.startsWith("http") ? company.website : `https://${company.website}`;

  return (
    <div className="shell py-8 md:py-12">
      <Link
        href="/companies"
        className="inline-flex items-center gap-1.5 text-[12.5px] text-2 hover:text-[var(--color-ink)] mb-8"
      >
        <ArrowLeft size={14} /> All companies
      </Link>

      <div className="grid lg:grid-cols-[1fr_340px] gap-10 lg:gap-14 items-start">
        <div>
          <div className="flex items-start gap-5">
            <CompanyLogo name={company.name} logo={company.logo} size="lg" />
            <div className="min-w-0">
              <h1 className="text-[32px] md:text-[40px] leading-[1.05]">{company.name}</h1>
              <p className="text-[15px] text-2 mt-2 max-w-[620px]">{company.oneLiner || "—"}</p>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-2 mt-6">
            <BatchChip batch={company.batchShort} />
            {company.industry.map((i) => (
              <span key={i} className="chip">{i}</span>
            ))}
            {company.status && <span className="chip">{company.status}</span>}
          </div>

          <div className="grid sm:grid-cols-2 gap-x-8 gap-y-5 mt-9">
            <Field label="Batch" value={`${company.batchShort} · ${batchLabel(company.batchShort)}`} />
            <Field label="Founded" value={company.launchedYear ? String(company.launchedYear) : "—"} />
            <Field label="Team size" value={company.teamSize ? formatCount(company.teamSize) : "—"} />
            <Field label="Status" value={company.status || "—"} />
            <Field
              label="Location"
              value={
                <span className="inline-flex items-center gap-1.5">
                  <MapPin size={13} className="text-[var(--color-ink-3)]" />
                  {company.location || "—"}
                </span>
              }
            />
            <Field label="Industry" value={company.industry.join(", ") || "—"} />
          </div>

          {company.tags.length > 0 && (
            <div className="mt-8">
              <div className="kicker mb-3">Tags</div>
              <div className="flex flex-wrap gap-2">
                {company.tags.map((t) => (
                  <Link key={t} href={`/companies?q=${encodeURIComponent(t)}`} className="chip hover:border-[var(--color-line-strong)]">
                    {t}
                  </Link>
                ))}
              </div>
            </div>
          )}

          {website && (
            <a
              href={website}
              target="_blank"
              rel="noopener noreferrer"
              className="btn mt-8 inline-flex"
            >
              Visit website <ExternalLink size={14} />
            </a>
          )}
        </div>

        {/* Founders sidebar */}
        <aside className="card p-5 lg:sticky lg:top-20">
          <div className="flex items-center justify-between mb-4">
            <div className="kicker">Founders</div>
            <span className="chip">{founders.length}</span>
          </div>
          {founders.length === 0 ? (
            <div className="text-[12.5px] text-2 leading-relaxed">
              Founder profiles for this company are not listed in the public directory yet.
            </div>
          ) : (
            <div className="space-y-1">
              {founders.map((f) => (
                <div key={f.id} className="flex items-center gap-3 py-2.5 border-b border-[var(--color-line)] last:border-0">
                  <Link href={`/founders/${f.id}`} className="flex items-center gap-3 min-w-0 flex-1">
                    <Avatar name={f.name} image={f.image} size="sm" />
                    <div className="min-w-0">
                      <div className="text-[13px] font-medium truncate">{f.name}</div>
                      <div className="text-[11.5px] text-2 truncate">{f.role}</div>
                    </div>
                  </Link>
                  <MessageLink founderId={f.id} small label="Text" />
                </div>
              ))}
            </div>
          )}

          <hr className="divide my-4" />
          <div className="flex items-center gap-2 text-[12px] text-2">
            <Users size={14} className="text-[var(--color-ink-3)]" />
            Part of the {company.batchShort || "YC"} founder network
          </div>
        </aside>
      </div>

      {related.length > 0 && (
        <section className="mt-16 pt-8 border-t border-[var(--color-line)]">
          <div className="flex items-end justify-between mb-5">
            <div>
              <div className="kicker mb-1.5">Same batch</div>
              <h2 className="text-[22px]">More from {batchLabel(company.batchShort)}</h2>
            </div>
            <Link href={`/companies?batch=${company.batchShort}`} className="btn btn-sm">
              View batch <ArrowUpRight size={14} />
            </Link>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-3">
            {related.map((c) => (
              <Link key={c.id} href={`/companies/${c.id}`} className="card card-hover p-4 flex items-center gap-3">
                <CompanyLogo name={c.name} logo={c.logo} size="sm" />
                <div className="min-w-0">
                  <div className="text-[13px] font-medium truncate">{c.name}</div>
                  <div className="text-[11.5px] text-2 truncate">{c.oneLiner}</div>
                </div>
              </Link>
            ))}
          </div>
        </section>
      )}
    </div>
  );
}

function Field({ label, value }: { label: string; value: ReactNode }) {
  return (
    <div>
      <div className="kicker mb-1.5">{label}</div>
      <div className="text-[13.5px]">{value}</div>
    </div>
  );
}
