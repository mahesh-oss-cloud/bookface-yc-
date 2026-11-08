"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { Search, SlidersHorizontal, X } from "lucide-react";

type SelectDef = {
  name: string;
  label: string;
  value: string;
  options: { value: string; label: string }[];
};

export default function Filters({
  basePath,
  q = "",
  selects,
  total,
  unit,
  placeholder,
}: {
  basePath: string;
  q?: string;
  selects: SelectDef[];
  total: number;
  unit: string;
  placeholder: string;
}) {
  const router = useRouter();
  const [text, setText] = useState(q);
  const [values, setValues] = useState<Record<string, string>>(
    Object.fromEntries(selects.map((s) => [s.name, s.value]))
  );

  function push(nextText: string, nextValues: Record<string, string>) {
    const params = new URLSearchParams();
    if (nextText.trim()) params.set("q", nextText.trim());
    for (const s of selects) {
      const v = nextValues[s.name];
      if (v) params.set(s.name, v);
    }
    const qs = params.toString();
    router.push(`${basePath}${qs ? `?${qs}` : ""}`);
  }

  function changeSelect(name: string, value: string) {
    const next = { ...values, [name]: value };
    setValues(next);
    push(text, next);
  }

  const hasFilters = Boolean(text.trim()) || Object.values(values).some(Boolean);

  return (
    <div className="space-y-3">
      <form
        onSubmit={(e) => {
          e.preventDefault();
          push(text, values);
        }}
        className="flex flex-col md:flex-row gap-2.5"
      >
        <div className="relative flex-1">
          <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--color-ink-3)]" />
          <input
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder={placeholder}
            className="!pl-9 !py-2.5"
            aria-label={placeholder}
          />
        </div>
        {selects.map((s) => (
          <div key={s.name} className="relative md:w-[190px]">
            <select
              value={values[s.name]}
              onChange={(e) => changeSelect(s.name, e.target.value)}
              className="select !py-2.5"
              aria-label={s.label}
            >
              <option value="">{s.label}</option>
              {s.options.map((o) => (
                <option key={o.value} value={o.value}>
                  {o.label}
                </option>
              ))}
            </select>
            <SlidersHorizontal size={13} className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-[var(--color-ink-3)]" />
          </div>
        ))}
        <button type="submit" className="btn btn-accent md:w-auto">
          Search
        </button>
      </form>

      <div className="flex items-center justify-between">
        <div className="kicker">
          {total.toLocaleString("en-US")} {unit}
          {hasFilters ? " matching" : ""}
        </div>
        {hasFilters && (
          <button
            onClick={() => {
              setText("");
              setValues(Object.fromEntries(selects.map((s) => [s.name, ""])));
              router.push(basePath);
            }}
            className="text-[11.5px] text-2 hover:text-[var(--color-ink)] inline-flex items-center gap-1"
          >
            <X size={12} /> Clear filters
          </button>
        )}
      </div>
    </div>
  );
}
