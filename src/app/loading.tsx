export default function Loading() {
  return (
    <div
      className="shell min-h-[68vh] py-8 md:py-12"
      role="status"
      aria-live="polite"
      aria-label="Loading Bookface"
    >
      <span className="sr-only">Loading page…</span>
      <div className="animate-pulse space-y-7">
        <div className="space-y-3">
          <div className="h-3 w-24 rounded bg-[var(--color-line)]" />
          <div className="h-9 w-56 max-w-full rounded-lg bg-[var(--color-line)]" />
          <div className="h-3 w-full max-w-[560px] rounded bg-[var(--color-line)]" />
        </div>
        <div className="h-11 w-full rounded-lg bg-[var(--color-surface)]" />
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
          {Array.from({ length: 8 }, (_, index) => (
            <div
              key={index}
              className="flex min-h-[104px] items-center gap-4 rounded-xl border border-[var(--color-line)] p-4"
            >
              <div className="h-14 w-14 shrink-0 rounded-lg bg-[var(--color-surface)]" />
              <div className="min-w-0 flex-1 space-y-3">
                <div className="h-3 w-2/3 rounded bg-[var(--color-line)]" />
                <div className="h-3 w-full rounded bg-[var(--color-surface)]" />
                <div className="h-3 w-1/2 rounded bg-[var(--color-surface)]" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
