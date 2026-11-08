"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useState } from "react";
import { LogOut, MessageSquare, Search, X, Menu } from "lucide-react";

const NAV = [
  { href: "/companies", label: "Companies" },
  { href: "/founders", label: "Founders" },
  { href: "/profile", label: "My profile" },
  { href: "/network", label: "Network" },
  { href: "/partners", label: "Partners" },
  { href: "/forum", label: "Forum" },
  { href: "/resources", label: "Resources" },
];

export default function Navbar({ email }: { email: string }) {
  const pathname = usePathname();
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [q, setQ] = useState("");
  const [signingOut, setSigningOut] = useState(false);

  function submit(e: React.FormEvent) {
    e.preventDefault();
    router.push(q.trim() ? "/search?q=" + encodeURIComponent(q.trim()) : "/search");
    setOpen(false);
  }

  async function signOut() {
    if (signingOut) return;
    setSigningOut(true);
    try {
      await fetch("/api/auth/logout", { method: "POST", credentials: "same-origin" });
      router.replace("/signin");
      router.refresh();
    } finally {
      setSigningOut(false);
      setOpen(false);
    }
  }

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur border-b border-[var(--color-line)]">
      <div className="shell min-h-14 flex items-center gap-3">
        <Link href="/" className="flex items-center gap-2.5 shrink-0" onClick={() => setOpen(false)}>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/yc-logo.svg" alt="Y Combinator" className="w-7 h-7 rounded-[6px]" />
          <span className="flex flex-col items-start gap-0.5">
            <span className="wordmark text-[20px] leading-none">Bookface</span>
            <span className="wordmark text-[9px] leading-none text-2">by Y Combinator</span>
          </span>
        </Link>

        <nav className="hidden lg:flex items-center gap-1 ml-2">
          {NAV.map((item) => {
            const active = pathname === item.href || pathname.startsWith(item.href + "/");
            return (
              <Link
                key={item.href}
                href={item.href}
                className={
                  "px-3 py-1.5 rounded-md text-[13px] font-medium transition-colors " +
                  (active
                    ? "bg-[var(--color-surface)] text-[var(--color-ink)]"
                    : "text-[var(--color-ink-2)] hover:text-[var(--color-ink)] hover:bg-[var(--color-surface)]")
                }
              >
                {item.label}
              </Link>
            );
          })}
        </nav>

        <div className="ml-auto flex items-center gap-2">
          <form onSubmit={submit} className="hidden sm:block relative w-48 xl:w-64">
            <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--color-ink-3)]" />
            <input
              value={q}
              onChange={(e) => setQ(e.target.value)}
              placeholder="Search founders, companies…"
              className="!py-1.5 !pl-8 !text-[12px]"
              aria-label="Search"
            />
          </form>
          <Link href="/messages" className="btn btn-sm" aria-label="Messages">
            <MessageSquare size={14} />
            <span className="hidden xl:inline">Messages</span>
          </Link>

          <div className="hidden md:flex items-center gap-2 pl-2 border-l border-[var(--color-line)]">
            <div className="max-w-[150px]">
              <div className="truncate text-[11px] font-medium">{email}</div>
            </div>
            <button type="button" onClick={signOut} disabled={signingOut} className="btn btn-sm" title="Sign out">
              <LogOut size={13} />
              <span className="hidden xl:inline">{signingOut ? "Signing out…" : "Sign out"}</span>
            </button>
          </div>

          <button
            className="btn btn-sm btn-ghost lg:hidden"
            onClick={() => setOpen((v) => !v)}
            aria-label="Toggle menu"
            aria-expanded={open}
          >
            {open ? <X size={16} /> : <Menu size={16} />}
          </button>
        </div>
      </div>

      {open && (
        <div className="lg:hidden border-t border-[var(--color-line)] bg-white">
          <div className="shell py-3 flex flex-col gap-1">
            <form onSubmit={submit} className="relative mb-2 sm:hidden">
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
            <div className="mt-2 border-t border-[var(--color-line)] pt-3 flex items-center justify-between gap-3">
              <div className="min-w-0">
                <div className="truncate text-[12px] font-medium">{email}</div>
              </div>
              <button type="button" onClick={signOut} disabled={signingOut} className="btn btn-sm shrink-0">
                <LogOut size={13} /> {signingOut ? "Signing out…" : "Sign out"}
              </button>
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
