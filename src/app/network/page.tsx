import Link from "next/link";
import { MessageSquare, Search, Users } from "lucide-react";
import NetworkPortrait from "@/components/NetworkPortrait";
import { NETWORK_PROFILES } from "@/data/network";

type SearchParams = Promise<Record<string, string | string[] | undefined>>;

function one(value: string | string[] | undefined): string {
  return Array.isArray(value) ? value[0] ?? "" : value ?? "";
}

function ProfileCard({ profile }: { profile: (typeof NETWORK_PROFILES)[number] }) {
  const categoryLabel =
    profile.category === "Founder" ? "Startup founder" : profile.category;

  return (
    <article
      id={profile.id}
      className="group scroll-mt-24 overflow-hidden rounded-xl border border-[var(--color-line)] bg-white transition-colors hover:border-[var(--color-line-strong)]"
    >
      <NetworkPortrait id={profile.id} name={profile.name} />
      <div className="flex min-h-[205px] flex-col p-4">
        <div className="mb-2 flex flex-wrap gap-1.5">
          <span className="chip">{categoryLabel}</span>
          {profile.tags.includes("Shark Tank India") && (
            <span className="chip chip-accent">Shark Tank India</span>
          )}
          {profile.tags.some((tag) => tag.startsWith("YC ")) && (
            <span className="chip">YC</span>
          )}
          {profile.tags.includes("YC co-founder") && <span className="chip">YC</span>}
        </div>

        <div className="flex items-start justify-between gap-2">
          <h3 className="min-w-0 text-[16px] font-semibold leading-tight">{profile.name}</h3>
          <Link
            href={`/messages?to=${encodeURIComponent(`network:${profile.id}`)}`}
            aria-label={`Message ${profile.name}`}
            title={`Message ${profile.name}`}
            className="btn btn-sm !h-8 !w-8 !shrink-0 !p-0"
          >
            <MessageSquare size={15} />
          </Link>
        </div>

        <p className="mt-1 text-[12px] font-medium text-2">{profile.role}</p>
        <p className="mt-1 text-[12.5px] font-semibold text-[var(--color-ink)]">{profile.company}</p>
        <p className="mt-2.5 text-[12.5px] leading-relaxed text-2">{profile.description}</p>
        <div className="mt-auto flex flex-wrap gap-1.5 pt-4">
          {profile.tags
            .filter((tag) => tag !== "Shark Tank India" && !tag.startsWith("YC ") && tag !== "YC co-founder")
            .slice(0, 2)
            .map((tag) => (
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

  const filtered = NETWORK_PROFILES.filter((profile) => {
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

  return (
    <div className="shell py-10 md:py-14">
      <div className="mb-8 max-w-[760px]">
        <div className="kicker mb-2 flex items-center gap-2">
          <Users size={12} /> Network
        </div>
        <h1 className="text-[34px] md:text-[44px]">Startup founders & investors.</h1>
        <p className="mt-3 text-[14px] leading-relaxed text-2 md:text-[15px]">
          A directory of notable startup founders, company builders and investors—including founders from the YC network.
        </p>
      </div>

      <form action="/network" method="get" className="mb-8 flex flex-col gap-2 sm:flex-row">
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
        <button type="submit" className="btn btn-accent !px-5">Search network</button>
        {query && <Link href="/network" className="btn justify-center">Clear</Link>}
      </form>

      <div className="mb-5 flex items-center justify-between gap-3 border-b border-[var(--color-line)] pb-4">
        <span className="kicker">{filtered.length} profiles</span>
        <span className="text-[11px] text-3">Founders · Investors · Company leaders</span>
      </div>

      {filtered.length > 0 ? (
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4">
          {filtered.map((profile) => <ProfileCard key={profile.id} profile={profile} />)}
        </div>
      ) : (
        <div className="rounded-xl border border-[var(--color-line)] px-6 py-16 text-center">
          <p className="text-[14px] font-medium">No profiles found</p>
          <p className="mt-1 text-[12.5px] text-2">Try a different name or company.</p>
        </div>
      )}

      <p className="mt-8 border-t border-[var(--color-line)] pt-4 text-[11px] leading-relaxed text-3">
        A curated directory, not a complete list of every billionaire or company founder. Profiles include founders, investors and selected business leaders.
      </p>
    </div>
  );
}
