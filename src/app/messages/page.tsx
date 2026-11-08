import Messenger, { type Contact } from "@/components/Messenger";
import { getFounder } from "@/lib/data";

export const dynamic = "force-dynamic";

type SP = Promise<Record<string, string | string[] | undefined>>;

export default async function MessagesPage({ searchParams }: { searchParams: SP }) {
  const sp = await searchParams;
  const toRaw = Array.isArray(sp.to) ? sp.to[0] : sp.to;
  const to = toRaw ? decodeURIComponent(toRaw) : "";
  const founder = to ? getFounder(to) : undefined;

  const initialContact: Contact | null = founder
    ? {
        id: founder.id,
        name: founder.name,
        company: founder.company,
        role: founder.role,
        image: founder.image,
      }
    : null;

  return <Messenger initialContact={initialContact} />;
}
