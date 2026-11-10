"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useState } from "react";
import { LogOut, Menu, MessageSquare, Search, X } from "lucide-react";

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

  function submit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
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
    <header className="site-header sticky top-0 z-40 border-b border-[var(--color-line)] bg-white/95 backdrop-blur">
      <div className="shell mobile-header-shell flex min-h-14 items-center gap-3">
        <Link href="/" className="flex shrink-0 items-center gap-2.5" onClick={() => setOpen(false)}>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/yc-logo.svg" alt="" className="h-7 w-7 rounded-[6px]" />
          <span className="flex flex-col items-start gap-0.5">
            <span className="wordmark text-[20px] leading-none">Bookface</span>
            <span className="wordmark text-[9px] leading-none text-2">by Y Combinator</span>
          </span>
        </Link>

        <nav className="ml-2 hidden items-center gap-1 lg:flex" aria-label="Primary navigation">
          {NAV.map((item) => {
            const active = pathname === item.href || pathname.startsWith(item.href + "/");
            return (
              <Link
                key={item.href}
                href={item.href}
                prefetch={true}
                className={
                  "rounded-md px-3 py-1.5 text-[13px] font-medium transition-colors " +
                  (active
                    ? "bg-[var(--color-surface)] text-[var(--color-ink)]"
                    : "text-[var(--color-ink-2)] hover:bg-[var(--color-surface)] hover:text-[var(--color-ink)]")
                }
              >
                {item.label}
              </Link>
            );
          })}
        </nav>

        <div className="ml-auto flex items-center gap-2">
          <form onSubmit={submit} className="relative hidden w-48 sm:block xl:w-64">
            <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--color-ink-3)]" />
            <input
              value={q}
              onChange={(event) => setQ(event.target.value)}
              placeholder="Search founders, companies…"
              className="!py-1.5 !pl-8 !text-[12px]"
              aria-label="Search"
            />
          </form>
          <Link href="/messages" className="btn btn-sm hidden md:inline-flex" aria-label="Messages">
            <MessageSquare size={14} />
            <span className="hidden xl:inline">Messages</span>
          </Link>

          <div className="hidden items-center gap-2 border-l border-[var(--color-line)] pl-2 md:flex">
            <div className="max-w-[150px]">
              <div className="truncate text-[11px] font-medium">{email}</div>
            </div>
            <button type="button" onClick={signOut} disabled={signingOut} className="btn btn-sm" title="Sign out">
              <LogOut size={13} />
              <span className="hidden xl:inline">{signingOut ? "Signing out…" : "Sign out"}</span>
            </button>
          </div>

          <button
            className="btn btn-sm btn-ghost min-h-10 min-w-10 !p-2 lg:hidden"
            onClick={() => setOpen((value) => !value)}
            aria-label={open ? "Close menu" : "Open menu"}
            aria-expanded={open}
            aria-controls="mobile-navigation"
          >
            {open ? <X size={17} /> : <Menu size={17} />}
          </button>
        </div>
      </div>

      {open && (
        <div id="mobile-navigation" className="mobile-menu border-t border-[var(--color-line)] bg-white lg:hidden">
          <div className="shell flex flex-col gap-3 py-4">
            <form onSubmit={submit} className="relative">
              <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--color-ink-3)]" />
              <input
                value={q}
                onChange={(event) => setQ(event.target.value)}
                placeholder="Search founders or companies…"
                className="!py-3 !pl-10 !text-[14px]"
                aria-label="Search Bookface"
              />
            </form>
            <div className="grid grid-cols-2 gap-2">
              {NAV.map((item) => {
                const active = pathname === item.href || pathname.startsWith(item.href + "/");
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    prefetch={true}
                    onClick={() => setOpen(false)}
                    className={
                      "flex min-h-11 items-center rounded-lg border px-3 py-2.5 text-[13px] font-medium " +
                      (active
                        ? "border-[#ffd6b8] bg-[#fff7f0] text-[var(--color-accent-ink)]"
                        : "border-[var(--color-line)] text-[var(--color-ink-2)]")
                    }
                  >
                    {item.label}
                  </Link>
                );
              })}
            </div>
            <div className="flex items-center justify-between gap-3 border-t border-[var(--color-line)] pt-3">
              <div className="min-w-0">
                <div className="kicker mb-1">Signed in as</div>
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
