import Link from "next/link";
import { Search, Users } from "lucide-react";
import NetworkPortrait from "@/components/NetworkPortrait";
import { NETWORK_PROFILES } from "@/data/network";

type SearchParams = Promise<Record<string, string | string[] | undefined>>;

function one(value: string | string[] | undefined): string {
  return Array.isArray(value) ? value[0] ?? "" : value ?? "";
}

function ProfileCard({ profile }: { profile: (typeof NETWORK_PROFILES)[number] }) {
  return (
    <article className="group overflow-hidden rounded-xl border border-[var(--color-line)] bg-white transition-colors hover:border-[var(--color-line-strong)]">
      <NetworkPortrait id={profile.id} name={profile.name} />
      <div className="flex min-h-[205px] flex-col p-4">
        <div className="mb-2 flex flex-wrap gap-1.5">
          <span className="chip">{profile.category}</span>
          {profile.tags.includes("Shark Tank India") && (
            <span className="chip chip-accent">Shark Tank India</span>
          )}
        </div>
        <h3 className="text-[16px] font-semibold leading-tight">{profile.name}</h3>
        <p className="mt-1 text-[12px] font-medium text-2">{profile.role}</p>
        <p className="mt-1 text-[12.5px] font-semibold text-[var(--color-ink)]">{profile.company}</p>
        <p className="mt-2.5 text-[12.5px] leading-relaxed text-2">{profile.description}</p>
        <div className="mt-auto flex flex-wrap gap-1.5 pt-4">
          {profile.tags.filter((tag) => tag !== "Shark Tank India").slice(0, 2).map((tag) => (
            <span key={tag} className="text-[10px] text-3">{tag}</span>
          ))}
        </div>
      </div>
    </article>
  );
}

export default async function NetworkPage({
  searchParams,
}: {
  searchParams: SearchParams;
}) {
  const params = await searchParams;
  const query = one(params.q).trim().toLowerCase();
  const region = one(params.region);

  const filtered = NETWORK_PROFILES.filter((profile) => {
    if (region && profile.region !== region) return false;
    if (!query) return true;
    const searchable = [
      profile.name,
      profile.company,
      profile.role,
      profile.description,
      profile.category,
      ...profile.tags,
    ].join(" ").toLowerCase();
    return searchable.includes(query);
  });

  const indianProfiles = filtered.filter((profile) => profile.region === "India");
  const globalProfiles = filtered.filter((profile) => profile.region === "Global");

  return (
    <div className="shell py-10 md:py-14">
      <div className="mb-8 max-w-[760px]">
        <div className="kicker mb-2 flex items-center gap-2">
          <Users size={12} /> Network
        </div>
        <h1 className="text-[34px] md:text-[44px]">The wider founder network.</h1>
        <p className="mt-3 text-[14px] leading-relaxed text-2 md:text-[15px]">
          A curated directory of influential founders, business leaders and investors beyond the YC alumni network.
          Explore the people behind companies shaping India and the global startup ecosystem.
        </p>
      </div>

      <form action="/network" method="get" className="mb-9 flex flex-col gap-2 sm:flex-row">
        <div className="relative min-w-0 flex-1">
          <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--color-ink-3)]" />
          <input
            name="q"
            defaultValue={one(params.q)}
            placeholder="Search people, companies or industries…"
            className="!pl-9 !py-2.5 !text-[13px]"
            aria-label="Search network"
          />
        </div>
        <select
          name="region"
          defaultValue={region}
          className="!w-full !py-2.5 !text-[13px] sm:!w-[170px]"
          aria-label="Filter by region"
        >
          <option value="">All regions</option>
          <option value="India">India</option>
          <option value="Global">Global</option>
        </select>
        <button type="submit" className="btn btn-accent !px-5">Search network</button>
        {(query || region) && (
          <Link href="/network" className="btn justify-center">Clear</Link>
        )}
      </form>

      <div className="mb-8 flex flex-wrap items-center justify-between gap-3 border-b border-[var(--color-line)] pb-4">
        <div className="flex flex-wrap gap-2 text-[12px]">
          <Link href="/network" className={`rounded-md px-3 py-1.5 ${!region ? "bg-[var(--color-ink)] text-white" : "bg-[var(--color-surface)] text-2"}`}>All</Link>
          <Link href="/network?region=India" className={`rounded-md px-3 py-1.5 ${region === "India" ? "bg-[var(--color-ink)] text-white" : "bg-[var(--color-surface)] text-2"}`}>India</Link>
          <Link href="/network?region=Global" className={`rounded-md px-3 py-1.5 ${region === "Global" ? "bg-[var(--color-ink)] text-white" : "bg-[var(--color-surface)] text-2"}`}>Global</Link>
        </div>
        <span className="kicker">{filtered.length} profiles</span>
      </div>

      {indianProfiles.length > 0 && (
        <section id="india" className="mb-14 scroll-mt-24">
          <div className="mb-5 flex items-end justify-between gap-3">
            <div>
              <div className="kicker mb-1">India</div>
              <h2 className="text-[25px] md:text-[30px]">Indian founders & business leaders</h2>
              <p className="mt-1 text-[12.5px] text-2">Startup builders, major business figures and Shark Tank India investors.</p>
            </div>
            <span className="text-[11px] text-3">{indianProfiles.length} profiles</span>
          </div>
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
            {indianProfiles.map((profile) => <ProfileCard key={profile.id} profile={profile} />)}
          </div>
        </section>
      )}

      {globalProfiles.length > 0 && (
        <section id="global" className="mb-14 scroll-mt-24">
          <div className="mb-5 flex items-end justify-between gap-3">
            <div>
              <div className="kicker mb-1">Global</div>
              <h2 className="text-[25px] md:text-[30px]">International founders</h2>
              <p className="mt-1 text-[12.5px] text-2">Founders behind globally recognised technology and consumer companies.</p>
            </div>
            <span className="text-[11px] text-3">{globalProfiles.length} profiles</span>
          </div>
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
            {globalProfiles.map((profile) => <ProfileCard key={profile.id} profile={profile} />)}
          </div>
        </section>
      )}

      {filtered.length === 0 && (
        <div className="rounded-xl border border-[var(--color-line)] px-6 py-16 text-center">
          <p className="text-[14px] font-medium">No profiles found</p>
          <p className="mt-1 text-[12.5px] text-2">Try a different name, company or region.</p>
        </div>
      )}

      <p className="border-t border-[var(--color-line)] pt-4 text-[11px] leading-relaxed text-3">
        This is a curated, expanding directory—not a complete ranking. Some profiles are business leaders or investors rather than startup founders.
      </p>
    </div>
  );
}
