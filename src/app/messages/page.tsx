import Messenger, { type Contact } from "@/components/Messenger";
import { getBookfaceSession } from "@/lib/session";
import { redirect } from "next/navigation";
import { getFounder } from "@/lib/data";
import { getPartnerById } from "@/data/partners";
import { getNetworkProfileById } from "@/data/network";

export const dynamic = "force-dynamic";

type SP = Promise<Record<string, string | string[] | undefined>>;

export default async function MessagesPage({ searchParams }: { searchParams: SP }) {
  const session = await getBookfaceSession();
  if (!session) redirect("/signin?next=%2Fmessages");

  const sp = await searchParams;
  const toRaw = Array.isArray(sp.to) ? sp.to[0] : sp.to;
  const to = toRaw ? decodeURIComponent(toRaw) : "";

  const isNetwork = to.startsWith("network:");
  const networkId = isNetwork ? to.slice("network:".length) : "";
  const networkProfile = networkId ? getNetworkProfileById(networkId) : undefined;

  const isPartner = to.startsWith("partner:");
  const partnerId = isPartner ? to.slice("partner:".length) : "";
  const partner = partnerId ? getPartnerById(partnerId) : undefined;
  const founder = !isNetwork && !isPartner && to ? getFounder(to) : undefined;

  const initialContact: Contact | null = networkProfile
    ? {
        id: `network:${networkProfile.id}`,
        name: networkProfile.name,
        company: networkProfile.company,
        role: networkProfile.role,
        image: `/api/network-images/${networkProfile.id}`,
        kind: "network" as const,
      }
    : partner
      ? {
          id: `partner:${partner.id}`,
          name: partner.name,
          company: partner.formerCompany,
          role: partner.role,
          image: partner.image ? `/api/partner-images/${partner.id}` : null,
          kind: "partner" as const,
        }
      : founder
        ? {
            id: founder.id,
            name: founder.name,
            company: founder.company,
            role: founder.role,
            image: founder.image,
            kind: "founder" as const,
          }
        : null;

  return <Messenger initialContact={initialContact} accountEmail={session.email} />;
}
