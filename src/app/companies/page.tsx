import Pagination from "@/components/Pagination";
import Filters from "@/components/Filters";
import { CompanyRow, EmptyState } from "@/components/ui";
import { batchLabel, getBatches, getIndustries, searchCompanies } from "@/lib/data";

export const dynamic = "force-dynamic";

type SP = Promise<Record<string, string | string[] | undefined>>;

function one(v: string | string[] | undefined): string {
  return Array.isArray(v) ? v[0] ?? "" : v ?? "";
}

export default async function CompaniesPage({ searchParams }: { searchParams: SP }) {
  const sp = await searchParams;
  const q = one(sp.q);
  const batch = one(sp.batch);
  const industry = one(sp.industry);
  const page = Math.max(1, parseInt(one(sp.page) || "1", 10) || 1);

  const result = searchCompanies({ q, batch, industry, page, perPage: 30 });
  const batches = getBatches();
  const industries = getIndustries();

  return (
    <div className="shell py-10 md:py-14">
      <div className="flex items-end justify-between gap-4 mb-8">
        <div>
          <div className="kicker mb-2">Directory</div>
          <h1 className="text-[32px] md:text-[40px]">Companies</h1>
          <p className="text-[14px] text-2 mt-2 max-w-[620px]">
            Every company that has gone through Y Combinator — with the batch, one-liner, and
            founders behind it.
          </p>
        </div>
        <div className="hidden sm:block text-right">
          <div className="stat-num">{result.total.toLocaleString("en-US")}</div>
          <div className="kicker mt-1">Companies</div>
        </div>
      </div>

      <div className="mb-6">
        <Filters
          basePath="/companies"
          q={q}
          total={result.total}
          unit="companies"
          placeholder="Search by name, one-liner, tag, or location…"
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
          ]}
        />
      </div>

      {result.items.length === 0 ? (
        <EmptyState title="No companies found" hint="Try a different search or clear the filters." />
      ) : (
        <div className="space-y-2">
          {result.items.map((c) => (
            <CompanyRow key={c.id} company={c} />
          ))}
        </div>
      )}

      <div className="mt-6">
        <Pagination basePath="/companies" page={result.page} pages={result.pages} params={{ q, batch, industry }} />
      </div>
    </div>
  );
}
