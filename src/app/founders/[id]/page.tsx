import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, ArrowUpRight, Building2, ExternalLink, MapPin, MessageSquare } from "lucide-react";
import { Avatar, BatchChip, CompanyLogo } from "@/components/ui";
import { batchLabel, getCompany, getFounder, getFounders, getFoundersByCompany, initials } from "@/lib/data";

export const dynamic = "force-dynamic";

export default async function FounderDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const founder = getFounder(decodeURIComponent(id));
  if (!founder) notFound();

  const company = founder.companySlug ? getCompany(founder.companySlug) : undefined;
  const colleagues = founder.companySlug
    ? getFoundersByCompany(founder.companySlug).filter((f) => f.id !== founder.id)
    : [];
  const sameBatch = founder.batch
    ? getFounders()
        .filter((f) => f.batch === founder.batch && f.id !== founder.id && f.image && f.companySlug !== founder.companySlug)
        .slice(0, 6)
    : [];
  const companyHref = company ? "/companies/" + company.id : undefined;
  const isSeededProfile = ["mahesh-bal", "saharsh-keerthi", "arhaan-rahil-mohammed", "satwik-reddy"].includes(founder.id);
  const ycProfileUrl = !isSeededProfile && !founder.id.startsWith("f-")
    ? "https://www.ycombinator.com/founders/" + encodeURIComponent(founder.id)
    : "";
  const profileSummary = founder.bio?.trim() ||
    [
      founder.name + " is listed in Y Combinator’s public founder directory.",
      founder.role ? "The listed role is " + founder.role + (founder.company ? " at " + founder.company + "." : ".") : "",
      founder.batch ? "The founder is associated with the " + batchLabel(founder.batch) + " batch." : "",
      founder.location ? "The listed location is " + founder.location + "." : "",
      founder.industry.length ? "The directory lists industry areas including " + founder.industry.join(", ") + "." : "",
    ].filter(Boolean).join(" ");

  return (
    <div className="shell py-8 md:py-12">
      <Link href="/founders" className="inline-flex items-center gap-1.5 text-[12.5px] text-2 hover:text-[var(--color-ink)] mb-8">
        <ArrowLeft size={14} /> All founders
      </Link>

      <div className="grid lg:grid-cols-[1fr_320px] gap-10 lg:gap-14 items-start">
        <div>
          <div className="flex flex-col sm:flex-row sm:items-start gap-5">
            <Avatar name={founder.name} image={founder.image} size="xl" />
            <div className="min-w-0 flex-1">
              <h1 className="text-[30px] md:text-[38px] leading-[1.05]">{founder.name}</h1>
              <div className="text-[15px] text-2 mt-2">
                {founder.role || "Founder"}
                {founder.company ? (
                  <>{" at "}{companyHref ? (
                    <Link href={companyHref} className="text-[var(--color-ink)] link-underline">{founder.company}</Link>
                  ) : founder.company}</>
                ) : null}
              </div>
              <div className="flex flex-wrap items-center gap-2 mt-4">
                {founder.batch && <BatchChip batch={founder.batch} />}
                {founder.location && <span className="chip"><MapPin size={11} /> {founder.location}</span>}
                {founder.industry.map((i) => <span key={i} className="chip">{i}</span>)}
              </div>
            </div>
          </div>

          <div className="flex flex-wrap gap-2.5 mt-7">
            <Link href={"/messages?to=" + encodeURIComponent(founder.id)} className="btn btn-accent">
              <MessageSquare size={15} /> Message {founder.name.split(" ")[0]}
            </Link>
            {companyHref && <Link href={companyHref} className="btn"><Building2 size={15} /> View company</Link>}
            {ycProfileUrl && (
              <a href={ycProfileUrl} target="_blank" rel="noopener noreferrer" className="btn">
                YC founder profile <ExternalLink size={14} />
              </a>
            )}
          </div>

          <section className="mt-10 max-w-[660px]">
            <div className="flex items-center justify-between gap-3 mb-2">
              <div className="kicker">{founder.bio?.trim() ? "Profile" : "Public directory profile"}</div>
              <span className="text-[10px] text-3">Based on listed details</span>
            </div>
            <p className="text-[14.5px] leading-relaxed text-2">
              {profileSummary || "The public directory currently contains limited details for this founder. Check the linked company and batch information for available context."}
            </p>
          </section>

          {company && (
            <section className="mt-8">
              <div className="kicker mb-3">Company</div>
              <Link href={"/companies/" + company.id} className="card card-hover flex items-center gap-4 p-4 max-w-[620px]">
                <CompanyLogo name={company.name} logo={company.logo} />
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="text-[14px] font-medium">{company.name}</span>
                    {company.batchShort && <BatchChip batch={company.batchShort} />}
                  </div>
                  <div className="text-[12.5px] text-2">{company.oneLiner || company.industry.join(", ") || "YC company"}</div>
                </div>
                <ArrowUpRight size={15} className="text-[var(--color-ink-3)]" />
              </Link>
            </section>
          )}

          {colleagues.length > 0 && (
            <section className="mt-8">
              <div className="kicker mb-3">Also at {founder.company}</div>
              <div className="space-y-2 max-w-[620px]">
                {colleagues.map((f) => (
                  <div key={f.id} className="card flex items-center gap-3 px-4 py-3">
                    <Link href={"/founders/" + f.id} className="flex items-center gap-3 min-w-0 flex-1">
                      <Avatar name={f.name} image={f.image} size="sm" />
                      <div className="min-w-0">
                        <div className="text-[13px] font-medium truncate">{f.name}</div>
                        <div className="text-[11.5px] text-2 truncate">{f.role || "Founder"}</div>
                      </div>
                    </Link>
                    <Link href={"/messages?to=" + encodeURIComponent(f.id)} className="btn btn-sm shrink-0"><MessageSquare size={12} /> Text</Link>
                  </div>
                ))}
              </div>
            </section>
          )}
        </div>

        <aside className="card p-5 lg:sticky lg:top-20">
          <div className="kicker mb-3">At a glance</div>
          <dl className="space-y-3.5 text-[13px]">
            <Row label="Role" value={founder.role || "Not listed publicly"} />
            <Row label="Company" value={founder.company || "Not listed publicly"} />
            <Row label="Batch" value={founder.batch ? founder.batch + " · " + batchLabel(founder.batch) : "Not listed publicly"} />
            <Row label="Location" value={founder.location || "Not listed publicly"} />
            <Row label="Industry" value={founder.industry.join(", ") || "Not listed publicly"} />
          </dl>
          <hr className="divide my-4" />
          <div className="flex items-center gap-3">
            <span className="w-8 h-8 rounded-full surface hair flex items-center justify-center text-[11px] font-semibold">
              {initials(founder.name)}
            </span>
            <div className="text-[11.5px] text-2 leading-snug">
              Founder directory entry
              <br />
              Public profile details may change.
            </div>
          </div>
        </aside>
      </div>

      {sameBatch.length > 0 && (
        <section className="mt-16 pt-8 border-t border-[var(--color-line)]">
          <div className="flex items-end justify-between mb-5">
            <div><div className="kicker mb-1.5">Same batch</div><h2 className="text-[22px]">More from {batchLabel(founder.batch)}</h2></div>
            <Link href={"/founders?batch=" + founder.batch} className="btn btn-sm">View batch <ArrowUpRight size={14} /></Link>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-2">
            {sameBatch.map((f) => (
              <div key={f.id} className="card card-hover flex items-center gap-3 px-4 py-3">
                <Link href={"/founders/" + f.id} className="flex items-center gap-3 min-w-0 flex-1">
                  <Avatar name={f.name} image={f.image} size="sm" />
                  <div className="min-w-0">
                    <div className="text-[13px] font-medium truncate">{f.name}</div>
                    <div className="text-[11.5px] text-2 truncate">{f.role} · {f.company}</div>
                  </div>
                </Link>
                <Link href={"/messages?to=" + encodeURIComponent(f.id)} className="btn btn-sm shrink-0"><MessageSquare size={12} /></Link>
              </div>
            ))}
          </div>
        </section>
      )}
    </div>
  );
}

function Row({ label, value }: { label: string; value: string }) {
  return <div className="flex items-start justify-between gap-4"><dt className="text-[11px] text-3 mono uppercase tracking-wide pt-0.5">{label}</dt><dd className="text-[13px] text-right">{value}</dd></div>;
}
