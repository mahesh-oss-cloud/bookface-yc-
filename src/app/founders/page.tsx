import Pagination from "@/components/Pagination";
import Filters from "@/components/Filters";
import { FounderRow, EmptyState } from "@/components/ui";
import { batchLabel, getBatches, getFounderIndustries, getFounders, searchFounders } from "@/lib/data";

export const dynamic = "force-dynamic";

type SP = Promise<Record<string, string | string[] | undefined>>;

function one(v: string | string[] | undefined): string {
  return Array.isArray(v) ? v[0] ?? "" : v ?? "";
}

function topRoles(limit = 30): { value: string; label: string }[] {
  const counts = new Map<string, number>();
  for (const f of getFounders()) {
    if (!f.role) continue;
    counts.set(f.role, (counts.get(f.role) ?? 0) + 1);
  }
  return [...counts.entries()]
    .sort((a, b) => b[1] - a[1] || a[0].localeCompare(b[0]))
    .slice(0, limit)
    .map(([value, n]) => ({ value, label: `${value} (${n.toLocaleString("en-US")})` }));
}

export default async function FoundersPage({ searchParams }: { searchParams: SP }) {
  const sp = await searchParams;
  const q = one(sp.q);
  const batch = one(sp.batch);
  const industry = one(sp.industry);
  const role = one(sp.role);
  const page = Math.max(1, parseInt(one(sp.page) || "1", 10) || 1);

  const result = searchFounders({ q, batch, industry, role, page, perPage: 24 });
  const batches = getBatches();
  const industries = getFounderIndustries();

  return (
    <div className="shell py-10 md:py-14">
      <div className="flex items-end justify-between gap-4 mb-8">
        <div>
          <div className="kicker mb-2">Directory</div>
          <h1 className="text-[32px] md:text-[40px]">Founders</h1>
          <p className="text-[14px] text-2 mt-2 max-w-[640px]">
            Every founder who has gone through Y Combinator. Search by name, company, role, batch,
            industry, or location — then message them directly.
          </p>
        </div>
        <div className="hidden sm:block text-right">
          <div className="stat-num">{result.total.toLocaleString("en-US")}</div>
          <div className="kicker mt-1">Founders</div>
        </div>
      </div>

      <div className="mb-6">
        <Filters
          basePath="/founders"
          q={q}
          total={result.total}
          unit="founders"
          placeholder="Search by name, company, role, or city…"
          selects={[
            {
              name: "batch",
              label: "All batches",
              value: batch,
              options: batches.map((b) => ({ value: b, label: `${b} · ${batchLabel(b)}` })),
            },
            {
              name: "industry",
              label: "All industries",
              value: industry,
              options: industries.map((i) => ({ value: i, label: i })),
            },
            {
              name: "role",
              label: "All roles",
              value: role,
              options: topRoles(),
            },
          ]}
        />
      </div>

      {result.items.length === 0 ? (
        <EmptyState title="No founders found" hint="Try a different search or clear the filters." />
      ) : (
        <div className="space-y-2">
          {result.items.map((f) => (
            <FounderRow key={f.id} founder={f} />
          ))}
        </div>
      )}

      <div className="mt-6">
        <Pagination
          basePath="/founders"
          page={result.page}
          pages={result.pages}
          params={{ q, batch, industry, role }}
        />
      </div>
    </div>
  );
}
