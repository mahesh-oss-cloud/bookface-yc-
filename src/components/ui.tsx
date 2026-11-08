import Link from "next/link";
import { ArrowUpRight, MessageSquare } from "lucide-react";
import type { Company, Founder } from "@/lib/data";
import { batchLabel, initials } from "@/lib/format";

export function Avatar({
  name,
  image,
  size = "md",
}: {
  name: string;
  image?: string | null;
  size?: "sm" | "md" | "lg" | "xl";
}) {
  const cls = size === "sm" ? "avatar avatar-sm" : size === "lg" ? "avatar avatar-lg" : size === "xl" ? "avatar avatar-xl" : "avatar";
  return (
    <div className={cls} aria-hidden>
      {image ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img src={image} alt="" loading="lazy" />
      ) : (
        <span>{initials(name)}</span>
      )}
    </div>
  );
}

export function CompanyLogo({
  name,
  logo,
  size = "md",
}: {
  name: string;
  logo?: string | null;
  size?: "sm" | "md" | "lg";
}) {
  const cls = size === "sm" ? "logo logo-sm" : size === "lg" ? "logo logo-lg" : "logo";
  return (
    <div className={cls} aria-hidden>
      {logo ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img src={logo} alt="" loading="lazy" />
      ) : (
        <span>{initials(name)}</span>
      )}
    </div>
  );
}

export function BatchChip({ batch }: { batch: string }) {
  if (!batch) return null;
  return (
    <span className="chip chip-accent" title={batchLabel(batch)}>
      {batch}
    </span>
  );
}

export function MessageLink({
  founderId,
  label = "Message",
  small = true,
}: {
  founderId: string;
  label?: string;
  small?: boolean;
}) {
  return (
    <Link
      href={`/messages?to=${encodeURIComponent(founderId)}`}
      className={`btn ${small ? "btn-sm" : ""} shrink-0`}
    >
      <MessageSquare size={small ? 13 : 15} />
      {label}
    </Link>
  );
}

export function FounderRow({ founder }: { founder: Founder }) {
  return (
    <div className="card card-hover flex items-center gap-4 px-4 py-3.5">
      <Link href={`/founders/${founder.id}`} className="flex items-center gap-4 min-w-0 flex-1">
        <Avatar name={founder.name} image={founder.image} />
        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-2">
            <span className="font-medium truncate">{founder.name}</span>
            {founder.top && <span className="chip !px-1.5 !py-0.5 !text-[9px]">TOP</span>}
          </div>
          <div className="text-[12.5px] text-2 truncate">
            {founder.role}
            {founder.company ? <> · {founder.company}</> : null}
          </div>
        </div>
      </Link>
      <div className="hidden sm:flex items-center gap-2 shrink-0">
        <BatchChip batch={founder.batch} />
        {founder.location && <span className="chip max-w-[170px] truncate">{founder.location}</span>}
      </div>
      <MessageLink founderId={founder.id} small />
    </div>
  );
}

export function CompanyRow({ company }: { company: Company }) {
  return (
    <div className="card card-hover flex items-center gap-4 px-4 py-3.5">
      <Link href={`/companies/${company.id}`} className="flex items-center gap-4 min-w-0 flex-1">
        <CompanyLogo name={company.name} logo={company.logo} />
        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-2">
            <span className="font-medium truncate">{company.name}</span>
            {company.top && <span className="chip !px-1.5 !py-0.5 !text-[9px]">TOP</span>}
          </div>
          <div className="text-[12.5px] text-2 truncate">{company.oneLiner}</div>
        </div>
      </Link>
      <div className="hidden md:flex items-center gap-2 shrink-0">
        <BatchChip batch={company.batchShort} />
        {company.industry[0] && <span className="chip">{company.industry[0]}</span>}
        {company.location && <span className="chip max-w-[160px] truncate">{company.location.split(",")[0]}</span>}
      </div>
      <Link href={`/companies/${company.id}`} className="btn btn-sm btn-ghost shrink-0" aria-label={`View ${company.name}`}>
        <ArrowUpRight size={14} />
      </Link>
    </div>
  );
}

export function FounderGridCard({ founder }: { founder: Founder }) {
  return (
    <Link href={`/founders/${founder.id}`} className="card card-hover p-4 flex flex-col gap-3">
      <div className="flex items-start justify-between">
        <Avatar name={founder.name} image={founder.image} size="lg" />
        <BatchChip batch={founder.batch} />
      </div>
      <div>
        <div className="font-medium leading-tight">{founder.name}</div>
        <div className="text-[12px] text-2 mt-0.5 truncate">{founder.role}</div>
        <div className="text-[12px] text-2 truncate">{founder.company}</div>
      </div>
      <div className="text-[11px] text-3 mono truncate mt-auto">{founder.location || "—"}</div>
    </Link>
  );
}

export function CompanyGridCard({ company }: { company: Company }) {
  return (
    <Link href={`/companies/${company.id}`} className="card card-hover p-4 flex flex-col gap-3">
      <div className="flex items-start justify-between">
        <CompanyLogo name={company.name} logo={company.logo} size="lg" />
        <BatchChip batch={company.batchShort} />
      </div>
      <div>
        <div className="font-medium leading-tight">{company.name}</div>
        <div className="text-[12px] text-2 mt-0.5 line-clamp-2">{company.oneLiner}</div>
      </div>
      <div className="text-[11px] text-3 mono mt-auto truncate">
        {company.industry[0] || "—"}
        {company.location ? ` · ${company.location.split(",")[0]}` : ""}
      </div>
    </Link>
  );
}

export function EmptyState({ title, hint }: { title: string; hint?: string }) {
  return (
    <div className="card px-6 py-16 text-center">
      <div className="text-[15px] font-medium">{title}</div>
      {hint && <div className="text-[13px] text-2 mt-1">{hint}</div>}
    </div>
  );
}
