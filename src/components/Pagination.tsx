import Link from "next/link";
import { ChevronLeft, ChevronRight } from "lucide-react";

export default function Pagination({
  basePath,
  page,
  pages,
  params,
}: {
  basePath: string;
  page: number;
  pages: number;
  params: Record<string, string | undefined>;
}) {
  if (pages <= 1) return null;

  function href(p: number) {
    const sp = new URLSearchParams();
    for (const [k, v] of Object.entries(params)) if (v) sp.set(k, v);
    if (p > 1) sp.set("page", String(p));
    const qs = sp.toString();
    return `${basePath}${qs ? `?${qs}` : ""}`;
  }

  const nums: number[] = [];
  const start = Math.max(1, Math.min(page - 2, pages - 4));
  const end = Math.min(pages, start + 4);
  for (let i = start; i <= end; i++) nums.push(i);

  return (
    <div className="flex items-center justify-between gap-3 pt-2">
      {page > 1 ? (
        <Link href={href(page - 1)} className="btn btn-sm">
          <ChevronLeft size={14} /> Previous
        </Link>
      ) : (
        <span className="btn btn-sm opacity-40 pointer-events-none">
          <ChevronLeft size={14} /> Previous
        </span>
      )}

      <div className="hidden sm:flex items-center gap-1">
        {start > 1 && (
          <>
            <Link href={href(1)} className="w-8 h-8 rounded-md flex items-center justify-center text-[12px] mono text-2 hover:bg-[var(--color-surface)]">
              1
            </Link>
            {start > 2 && <span className="text-3 text-[12px] px-1">…</span>}
          </>
        )}
        {nums.map((n) => (
          <Link
            key={n}
            href={href(n)}
            className={`w-8 h-8 rounded-md flex items-center justify-center text-[12px] mono ${
              n === page ? "bg-[var(--color-ink)] text-white" : "text-2 hover:bg-[var(--color-surface)]"
            }`}
          >
            {n}
          </Link>
        ))}
        {end < pages && (
          <>
            {end < pages - 1 && <span className="text-3 text-[12px] px-1">…</span>}
            <Link href={href(pages)} className="w-8 h-8 rounded-md flex items-center justify-center text-[12px] mono text-2 hover:bg-[var(--color-surface)]">
              {pages}
            </Link>
          </>
        )}
      </div>

      <div className="sm:hidden kicker">
        Page {page} / {pages}
      </div>

      {page < pages ? (
        <Link href={href(page + 1)} className="btn btn-sm">
          Next <ChevronRight size={14} />
        </Link>
      ) : (
        <span className="btn btn-sm opacity-40 pointer-events-none">
          Next <ChevronRight size={14} />
        </span>
      )}
    </div>
  );
}
