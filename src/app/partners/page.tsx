import Link from "next/link";
import { MessageSquare } from "lucide-react";
import { PartnerPortrait, BatchChip } from "@/components/ui";
import { YC_PARTNERS } from "@/data/partners";

export const metadata = {
  title: "Partners — Bookface",
  description: "Meet the partners supporting founders in the Bookface network.",
};

export default function PartnersPage() {
  return (
    <div className="shell py-10 md:py-14">
      <div className="mb-9 border-b border-[var(--color-line)] pb-8">
        <div className="kicker mb-2">Bookface network</div>
        <h1 className="text-[34px] md:text-[42px]">Partners</h1>
        <p className="mt-2 max-w-[640px] text-[14px] leading-relaxed text-2">
          The people working with founders, alongside the companies they built before joining the network.
        </p>
      </div>

      <div className="mb-5 flex items-center justify-between">
        <div className="kicker">{YC_PARTNERS.length} partners</div>
        <div className="text-[11px] text-3">Partner profiles</div>
      </div>

      <div className="grid items-start gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {YC_PARTNERS.map((partner) => (
          <article
            key={partner.id}
            id={partner.id}
            className="card card-hover scroll-mt-24 overflow-hidden"
          >
            <div className="surface p-2">
              <PartnerPortrait
                name={partner.name}
                partnerId={partner.id}
                hasImage={Boolean(partner.image)}
                size="lg"
              />
            </div>
            <div className="flex flex-col p-4">
              <div className="flex items-start justify-between gap-2">
                <div className="min-w-0">
                  <h2 className="truncate text-[16px]">{partner.name}</h2>
                  <p className="mt-1 text-[11.5px] font-medium text-2">{partner.role}</p>
                </div>
                <BatchChip batch={partner.batch} />
              </div>
              <p className="mt-3 min-h-[72px] text-[12px] leading-relaxed text-2">{partner.bio}</p>
              <div className="mt-4 flex items-center justify-between gap-3 border-t border-[var(--color-line)] pt-3">
                <div className="min-w-0">
                  <div className="kicker">Founded</div>
                  <div className="truncate text-[12px] font-medium">{partner.formerCompany}</div>
                </div>
                <Link
                  href={`/messages?to=${encodeURIComponent(`partner:${partner.id}`)}`}
                  className="btn btn-sm btn-ghost shrink-0"
                  aria-label={`Message ${partner.name}`}
                  title={`Message ${partner.name}`}
                >
                  <MessageSquare size={15} />
                </Link>
              </div>
            </div>
          </article>
        ))}
      </div>
    </div>
  );
}
