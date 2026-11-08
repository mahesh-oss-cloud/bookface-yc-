"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";
import Navbar from "@/components/Navbar";
import MobileTabBar from "@/components/MobileTabBar";
import Link from "next/link";

type Props = {
  children: React.ReactNode;
  email: string;
};

export default function SiteChrome({ children, email }: Props) {
  const pathname = usePathname();
  const isSignIn = pathname === "/signin";

  useEffect(() => {
    if (!("serviceWorker" in navigator)) return;
    navigator.serviceWorker.register("/sw.js", { scope: "/" }).catch(() => {
      // The site remains fully usable when service-worker registration is unavailable.
    });
  }, []);

  if (isSignIn) return <main className="flex-1">{children}</main>;

  return (
    <>
      <Navbar email={email} />
      <main className="mobile-app-main flex-1">{children}</main>
      <footer className="app-footer mt-20 border-t border-[var(--color-line)]">
        <div className="shell flex flex-col items-start justify-between gap-6 py-10 md:flex-row md:items-center">
          <div className="flex items-center gap-2.5">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="/yc-logo.svg" alt="Y Combinator" className="h-6 w-6 rounded-[5px]" />
            <div className="flex flex-col items-start gap-0.5">
              <div className="wordmark text-[16px] leading-none">Bookface</div>
              <div className="wordmark text-[10px] leading-none text-3">by Y Combinator</div>
            </div>
          </div>
          <div className="flex flex-wrap items-center gap-x-6 gap-y-2 text-[12px] text-2">
            <Link href="/companies" className="hover:text-[var(--color-ink)]">Companies</Link>
            <Link href="/founders" className="hover:text-[var(--color-ink)]">Founders</Link>
            <Link href="/network" className="hover:text-[var(--color-ink)]">Network</Link>
            <Link href="/partners" className="hover:text-[var(--color-ink)]">Partners</Link>
            <Link href="/forum" className="hover:text-[var(--color-ink)]">Forum</Link>
            <Link href="/resources" className="hover:text-[var(--color-ink)]">Resources</Link>
            <Link href="/messages" className="hover:text-[var(--color-ink)]">Messages</Link>
          </div>
          <div className="kicker">Private access · Since 2005</div>
        </div>
      </footer>
      <MobileTabBar />
    </>
  );
}
