import Link from "next/link";
import { ExternalLink } from "lucide-react";
import { PartnerPortrait, BatchChip } from "@/components/ui";
import { YC_PARTNERS } from "@/data/partners";

export const metadata = {
  title: "YC Partners — Bookface",
  description: "Meet the Y Combinator partners and the companies they founded.",
};

export default function PartnersPage() {
  return (
    <div className="shell py-10 md:py-14">
      <div className="mb-9 flex flex-col gap-4 border-b border-[var(--color-line)] pb-8 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <div className="kicker mb-2">Y Combinator</div>
          <h1 className="text-[34px] md:text-[42px]">Partners</h1>
          <p className="mt-2 max-w-[640px] text-[14px] leading-relaxed text-2">
            The people working with YC founders, with the companies they built before joining YC.
          </p>
        </div>
        <a
          href="https://www.ycombinator.com/partners"
          target="_blank"
          rel="noopener noreferrer"
          className="btn btn-sm w-fit"
        >
          YC partner directory <ExternalLink size={13} />
        </a>
      </div>

      <div className="mb-5 flex items-center justify-between">
        <div className="kicker">{YC_PARTNERS.length} partners</div>
        <div className="text-[11px] text-3">Profiles and portraits sourced from YC people pages</div>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {YC_PARTNERS.map((partner) => (
          <article
            key={partner.id}
            id={partner.id}
            className="card card-hover scroll-mt-24 overflow-hidden"
          >
            <div className="surface p-3">
              <PartnerPortrait name={partner.name} image={partner.image} size="lg" />
            </div>
            <div className="flex h-full flex-col p-4">
              <div className="flex items-start justify-between gap-2">
                <div className="min-w-0">
                  <h2 className="truncate text-[16px]">{partner.name}</h2>
                  <p className="mt-1 text-[11.5px] font-medium text-2">{partner.role}</p>
                </div>
                <BatchChip batch={partner.batch} />
              </div>
              <p className="mt-3 text-[12px] leading-relaxed text-2">{partner.bio}</p>
              <div className="mt-4 flex items-center justify-between gap-3 border-t border-[var(--color-line)] pt-3">
                <div className="min-w-0">
                  <div className="kicker">YC company</div>
                  <div className="truncate text-[12px] font-medium">{partner.formerCompany}</div>
                </div>
                <a
                  href={partner.profileUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn btn-sm shrink-0"
                >
                  YC profile <ExternalLink size={12} />
                </a>
              </div>
            </div>
          </article>
        ))}
      </div>
    </div>
  );
}
