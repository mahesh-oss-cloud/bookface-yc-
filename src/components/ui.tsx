import Link from "next/link";
import { ArrowUpRight, MessageSquare } from "lucide-react";
import { getPartnerByName } from "@/data/partners";
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

export function PartnerPortrait({
  name,
  image,
  size = "md",
}: {
  name: string;
  image?: string | null;
  size?: "sm" | "md" | "lg";
}) {
  const classes =
    size === "sm"
      ? "h-9 w-9 rounded-lg"
      : size === "lg"
        ? "aspect-[4/3] w-full rounded-lg"
        : "h-16 w-16 rounded-xl";
  return (
    <div className={`shrink-0 overflow-hidden border border-[var(--color-line)] bg-[var(--color-surface)] ${classes}`}>
      {image ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img src={image} alt={name} loading="lazy" className="h-full w-full object-cover object-center" />
      ) : (
        <span className="flex h-full w-full items-center justify-center text-[13px] font-semibold text-2">
          {initials(name)}
        </span>
      )}
    </div>
  );
}

export function PartnerInline({ name }: { name: string }) {
  const partner = getPartnerByName(name);
  return (
    <Link
      href={partner ? `/partners#${partner.id}` : "/partners"}
      className="inline-flex min-w-0 items-center gap-2 rounded-md border border-[var(--color-line)] bg-white px-2 py-1.5 transition-colors hover:border-[var(--color-line-strong)]"
      title={`Group partner: ${name}`}
    >
      <PartnerPortrait name={name} image={partner?.image} size="sm" />
      <span className="min-w-0">
        <span className="block text-[9px] uppercase tracking-[0.12em] text-3">Group partner</span>
        <span className="block truncate text-[11.5px] font-medium text-[var(--color-ink)]">{name}</span>
      </span>
    </Link>
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
    <span className="batch-chip" title={batchLabel(batch)}>
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
    <div className="card card-hover flex flex-col gap-3 px-4 py-3.5 sm:flex-row sm:items-center sm:gap-4">
      <Link href={`/founders/${founder.id}`} className="flex min-w-0 flex-1 items-center gap-4">
        <Avatar name={founder.name} image={founder.image} />
        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-2">
            <span className="truncate text-[13.5px] font-medium">{founder.name}</span>
            {founder.top && <span className="chip !px-1.5 !py-0.5 !text-[9px]">TOP</span>}
          </div>
          <div className="truncate text-[12.5px] text-2">
            {founder.role}
            {founder.company ? <> · {founder.company}</> : null}
          </div>
        </div>
      </Link>
      <div className="flex flex-wrap items-center gap-2 sm:max-w-[48%] sm:justify-end">
        <BatchChip batch={founder.batch} />
        {founder.industry[0] && <span className="chip">{founder.industry[0]}</span>}
        {founder.location && <span className="chip max-w-[170px] truncate">{founder.location}</span>}
        {founder.groupPartner && <PartnerInline name={founder.groupPartner} />}
      </div>
      <MessageLink founderId={founder.id} small />
    </div>
  );
}

export function CompanyRow({ company }: { company: Company }) {
  return (
    <div className="card card-hover flex flex-col gap-3 px-4 py-3.5 sm:flex-row sm:items-center sm:gap-4">
      <Link href={`/companies/${company.id}`} className="flex min-w-0 flex-1 items-center gap-4">
        <CompanyLogo name={company.name} logo={company.logo} />
        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-2">
            <span className="truncate text-[13.5px] font-medium">{company.name}</span>
            {company.top && <span className="chip !px-1.5 !py-0.5 !text-[9px]">TOP</span>}
          </div>
          <div className="line-clamp-2 text-[12.5px] text-2">{company.oneLiner}</div>
        </div>
      </Link>
      <div className="flex flex-wrap items-center gap-2 sm:max-w-[52%] sm:justify-end">
        <BatchChip batch={company.batchShort} />
        {company.industry[0] && <span className="chip">{company.industry[0]}</span>}
        {company.location && <span className="chip max-w-[160px] truncate">{company.location.split(",")[0]}</span>}
        {company.groupPartner && <PartnerInline name={company.groupPartner} />}
      </div>
      <Link href={`/companies/${company.id}`} className="btn btn-sm btn-ghost shrink-0" aria-label={`View ${company.name}`}>
        <ArrowUpRight size={14} />
      </Link>
    </div>
  );
}

export function FounderGridCard({ founder }: { founder: Founder }) {
  return (
    <Link href={`/founders/${founder.id}`} className="card card-hover flex flex-col gap-3 p-4">
      <div className="flex items-start justify-between gap-3">
        <Avatar name={founder.name} image={founder.image} size="lg" />
        <BatchChip batch={founder.batch} />
      </div>
      <div>
        <div className="text-[13.5px] font-medium leading-tight">{founder.name}</div>
        <div className="mt-0.5 truncate text-[12px] text-2">{founder.role}</div>
        <div className="truncate text-[12px] text-2">{founder.company}</div>
      </div>
      <div className="mt-auto flex flex-col gap-2 border-t border-[var(--color-line)] pt-3">
        <div className="truncate text-[11px] text-3">{founder.location || "Location not listed"}</div>
        {founder.groupPartner && (
          <span className="text-[11px] text-2">Group partner · {founder.groupPartner}</span>
        )}
      </div>
    </Link>
  );
}

export function CompanyGridCard({ company }: { company: Company }) {
  return (
    <Link href={`/companies/${company.id}`} className="card card-hover flex flex-col gap-3 p-4">
      <div className="flex items-start justify-between gap-3">
        <CompanyLogo name={company.name} logo={company.logo} size="lg" />
        <BatchChip batch={company.batchShort} />
      </div>
      <div>
        <div className="text-[13.5px] font-medium leading-tight">{company.name}</div>
        <div className="mt-0.5 line-clamp-2 text-[12px] text-2">{company.oneLiner}</div>
      </div>
      <div className="mt-auto flex flex-col gap-2 border-t border-[var(--color-line)] pt-3">
        <div className="truncate text-[11px] text-3">
          {company.industry[0] || "Industry not listed"}
          {company.location ? ` · ${company.location.split(",")[0]}` : ""}
        </div>
        {company.groupPartner && (
          <span className="text-[11px] text-2">Group partner · {company.groupPartner}</span>
        )}
      </div>
    </Link>
  );
}

export function EmptyState({ title, hint }: { title: string; hint?: string }) {
  return (
    <div className="card px-6 py-16 text-center">
      <div className="text-[15px] font-medium">{title}</div>
      {hint && <div className="mt-1 text-[13px] text-2">{hint}</div>}
    </div>
  );
}
