import Messenger, { type Contact } from "@/components/Messenger";
import { getFounder } from "@/lib/data";
import { getPartnerById } from "@/data/partners";

export const dynamic = "force-dynamic";

type SP = Promise<Record<string, string | string[] | undefined>>;

export default async function MessagesPage({ searchParams }: { searchParams: SP }) {
  const sp = await searchParams;
  const toRaw = Array.isArray(sp.to) ? sp.to[0] : sp.to;
  const to = toRaw ? decodeURIComponent(toRaw) : "";

  const isPartner = to.startsWith("partner:");
  const partnerId = isPartner ? to.slice("partner:".length) : "";
  const partner = partnerId ? getPartnerById(partnerId) : undefined;
  const founder = !isPartner && to ? getFounder(to) : undefined;

  const initialContact: Contact | null = partner
    ? {
        id: `partner:${partner.id}`,
        name: partner.name,
        company: partner.formerCompany,
        role: partner.role,
        image: partner.image ? `/api/partner-images/${partner.id}` : null,
        kind: "partner",
      }
    : founder
      ? {
          id: founder.id,
          name: founder.name,
          company: founder.company,
          role: founder.role,
          image: founder.image,
          kind: "founder",
        }
      : null;

  return <Messenger initialContact={initialContact} />;
}
