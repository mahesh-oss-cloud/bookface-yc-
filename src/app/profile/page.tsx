import Link from "next/link";
import { ArrowUpRight, Building2, ExternalLink, MapPin, Users } from "lucide-react";
import { notFound, redirect } from "next/navigation";
import { Avatar, BatchChip, CompanyLogo } from "@/components/ui";
import { getCompany, getFounder, getFoundersByCompany } from "@/lib/data";
import { getBookfaceSession } from "@/lib/session";
import { getBookfaceAccount } from "@/lib/accounts";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

export default async function MyProfilePage() {
  const session = await getBookfaceSession();
  if (!session) redirect("/signin?next=%2Fprofile");

  const account = getBookfaceAccount(session.email);
  if (!account) redirect("/signin?next=%2Fprofile");

  // Each approved email can be linked to its own founder profile in
  // BOOKFACE_ACCOUNTS_JSON. Never fall back to another member's profile.
  if (!account.founderId) {
    return (
      <div className="shell py-16">
        <div className="card mx-auto max-w-[620px] p-6 md:p-8">
          <div className="kicker mb-2">Your Bookface account</div>
          <h1 className="text-[30px] md:text-[36px]">Welcome, {account.name || "founder"}.</h1>
          <p className="mt-4 text-[14px] leading-relaxed text-2">
            You are signed in as <strong>{session.email}</strong>. Your account is active, but it has not
            yet been linked to a founder profile. Contact the Bookface administrator to finish setup.
          </p>
        </div>
      </div>
    );
  }

  const founder = getFounder(account.founderId);
  if (!founder) notFound();

  const company = founder.companySlug ? getCompany(founder.companySlug) : undefined;
  const teammates = founder.companySlug ? getFoundersByCompany(founder.companySlug) : [];

  return (
    <div className="shell py-10 md:py-14">
      <div className="mb-8">
        <div className="kicker mb-2">Your Bookface account</div>
        <h1 className="text-[34px] md:text-[44px]">Team profile</h1>
        <p className="mt-2 max-w-[680px] text-[14px] leading-relaxed text-2">
          Your account is connected to your team profile and company.
        </p>
      </div>

      <section className="card p-5 md:p-8">
        <div className="flex flex-col gap-5 sm:flex-row sm:items-start">
          <Avatar name={founder.name} image={founder.image} size="xl" />
          <div className="min-w-0 flex-1">
            <div className="flex flex-wrap items-center gap-2">
              <h2 className="text-[30px] md:text-[36px]">{founder.name}</h2>
              {founder.batch && <BatchChip batch={founder.batch} />}
            </div>
            <p className="mt-1 text-[14px] font-medium text-2">
              {founder.role}{founder.company ? " · " + founder.company : ""}
            </p>
            {founder.location && (
              <p className="mt-3 inline-flex items-center gap-1.5 text-[12.5px] text-2">
                <MapPin size={13} /> {founder.location}
              </p>
            )}
            <p className="mt-4 max-w-[760px] text-[14px] leading-[1.8] text-2">
              {founder.bio || "Team profile connected to your Bookface account."}
            </p>
            <div className="mt-4 flex flex-wrap gap-2">
              {founder.industry.map((item) => <span key={item} className="chip">{item}</span>)}
            </div>
            <div className="mt-6 flex flex-wrap gap-2">
              <Link href={`/founders/${founder.id}`} className="btn">
                Open directory profile <ArrowUpRight size={14} />
              </Link>
              {account.linkedinUrl && (
                <a
                  href={account.linkedinUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn"
                >
                  LinkedIn <ExternalLink size={13} />
                </a>
              )}
            </div>
          </div>
        </div>
      </section>

      {company && (
        <section className="mt-8 grid gap-8 lg:grid-cols-[1fr_320px]">
          <div className="card p-5 md:p-7">
            <div className="kicker mb-4">Your company</div>
            <div className="flex items-start gap-4">
              <CompanyLogo name={company.name} logo={company.logo} size="lg" />
              <div className="min-w-0">
                <h2 className="text-[25px] md:text-[29px]">{company.name}</h2>
                <p className="mt-1 text-[13px] leading-relaxed text-2">{company.oneLiner}</p>
                <div className="mt-3 flex flex-wrap gap-2">
                  {company.batchShort && <BatchChip batch={company.batchShort} />}
                  {company.industry.map((item) => <span key={item} className="chip">{item}</span>)}
                </div>
              </div>
            </div>
            <p className="mt-6 text-[13.5px] leading-[1.85] text-2">{company.description}</p>
            <div className="mt-6 flex flex-wrap gap-2">
              <a href={company.website} target="_blank" rel="noopener noreferrer" className="btn">
                {company.name} website <ExternalLink size={13} />
              </a>
              <Link href={`/companies/${company.id}`} className="btn">
                Company directory profile <ArrowUpRight size={14} />
              </Link>
            </div>
          </div>

          <aside className="card p-5">
            <div className="kicker mb-4">At a glance</div>
            <dl className="space-y-4">
              <Detail label="Company" value={company.name} />
              <Detail label="Location" value={company.location || founder.location || "Not listed"} />
              <Detail label="Industry" value={company.industry.join(", ") || "Not listed"} />
              <Detail label="Status" value={company.status || "Not listed"} />
            </dl>
            <div className="mt-5 flex items-center gap-2 border-t border-[var(--color-line)] pt-4 text-[12px] text-2">
              <Building2 size={14} /> Founder account linked to company
            </div>
          </aside>
        </section>
      )}

      {teammates.length > 0 && (
        <section className="mt-12">
          <div className="mb-4 flex items-end justify-between gap-4">
            <div>
              <div className="kicker mb-1.5">The team</div>
              <h2 className="text-[25px] md:text-[29px]">Building {company.name} together.</h2>
            </div>
            <Link href={"/founders?q=" + encodeURIComponent(founder.company)} className="btn btn-sm hidden sm:inline-flex">
              All team members <ArrowUpRight size={13} />
            </Link>
          </div>
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
            {teammates.map((member) => (
              <Link key={member.id} href={`/founders/${member.id}`} className="card card-hover flex flex-col p-4">
                <div className="flex items-center gap-3">
                  <Avatar name={member.name} image={member.image} size="lg" />
                  <div className="min-w-0">
                    <div className="truncate text-[13px] font-medium">{member.name}</div>
                    <div className="mt-0.5 text-[11.5px] leading-snug text-2">{member.role}</div>
                  </div>
                </div>
                <p className="mt-4 text-[12px] leading-relaxed text-2">{member.bio}</p>
                <span className="mt-auto inline-flex items-center gap-1 pt-4 text-[11.5px] font-medium">
                  View profile <ArrowUpRight size={12} />
                </span>
              </Link>
            ))}
          </div>
        </section>
      )}

      <div className="mt-10 flex items-center gap-2 text-[11.5px] text-3">
        <Users size={13} /> This profile is linked to the currently signed-in Bookface member.
      </div>
    </div>
  );
}

function Detail({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <dt className="kicker mb-1">{label}</dt>
      <dd className="text-[13px]">{value}</dd>
    </div>
  );
}
