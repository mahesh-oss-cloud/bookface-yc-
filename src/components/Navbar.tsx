"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useState } from "react";
import { MessageSquare, Search, X, Menu } from "lucide-react";

const NAV = [
  { href: "/companies", label: "Companies" },
  { href: "/founders", label: "Founders" },
  { href: "/forum", label: "Forum" },
  { href: "/resources", label: "Resources" },
];

export default function Navbar() {
  const pathname = usePathname();
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [q, setQ] = useState("");

  function submit(e: React.FormEvent) {
    e.preventDefault();
    router.push(q.trim() ? `/search?q=${encodeURIComponent(q.trim())}` : "/search");
    setOpen(false);
  }

  return (
    <header className="sticky top-0 z-40 bg-white/90 backdrop-blur border-b border-[var(--color-line)]">
      <div className="shell h-14 flex items-center gap-4">
        <Link href="/" className="flex items-center gap-2.5 shrink-0" onClick={() => setOpen(false)}>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/yc-logo.svg" alt="Y Combinator" className="w-7 h-7 rounded-[6px]" />
          <span className="wordmark text-[20px] leading-none">Bookface</span>
        </Link>

        <nav className="hidden md:flex items-center gap-1 ml-2">
          {NAV.map((item) => {
            const active = pathname === item.href || pathname.startsWith(item.href + "/");
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`px-3 py-1.5 rounded-md text-[13px] font-medium transition-colors ${
                  active ? "bg-[var(--color-surface)] text-[var(--color-ink)]" : "text-[var(--color-ink-2)] hover:text-[var(--color-ink)] hover:bg-[var(--color-surface)]"
                }`}
              >
                {item.label}
              </Link>
            );
          })}
        </nav>

        <div className="ml-auto flex items-center gap-2">
          <form onSubmit={submit} className="hidden sm:block relative w-56 lg:w-72">
            <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--color-ink-3)]" />
            <input
              value={q}
              onChange={(e) => setQ(e.target.value)}
              placeholder="Search founders, companies…"
              className="!py-1.5 !pl-8 !text-[12.5px]"
              aria-label="Search"
            />
          </form>
          <Link href="/messages" className="btn btn-sm" aria-label="Messages">
            <MessageSquare size={14} />
            <span className="hidden sm:inline">Messages</span>
          </Link>
          <button
            className="btn btn-sm btn-ghost md:hidden"
            onClick={() => setOpen((v) => !v)}
            aria-label="Toggle menu"
          >
            {open ? <X size={16} /> : <Menu size={16} />}
          </button>
        </div>
      </div>

      {open && (
        <div className="md:hidden border-t border-[var(--color-line)] bg-white">
          <div className="shell py-3 flex flex-col gap-1">
            <form onSubmit={submit} className="relative mb-2">
              <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--color-ink-3)]" />
              <input
                value={q}
                onChange={(e) => setQ(e.target.value)}
                placeholder="Search founders, companies…"
                className="!pl-8 !text-[13px]"
              />
            </form>
            {NAV.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setOpen(false)}
                className="px-2 py-2 rounded-md text-[13px] font-medium text-[var(--color-ink-2)] hover:bg-[var(--color-surface)]"
              >
                {item.label}
              </Link>
            ))}
            <Link href="/messages" onClick={() => setOpen(false)} className="px-2 py-2 rounded-md text-[13px] font-medium text-[var(--color-ink-2)] hover:bg-[var(--color-surface)]">
              Messages
            </Link>
          </div>
        </div>
      )}
    </header>
  );
}
