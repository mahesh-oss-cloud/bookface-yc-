"use client";

import { usePathname } from "next/navigation";
import Navbar from "@/components/Navbar";
import Link from "next/link";

type Props = {
  children: React.ReactNode;
  email: string;
};

export default function SiteChrome({ children, email }: Props) {
  const pathname = usePathname();
  const isSignIn = pathname === "/signin";

  if (isSignIn) return <main className="flex-1">{children}</main>;

  return (
    <>
      <Navbar email={email} />
      <main className="flex-1">{children}</main>
      <footer className="border-t border-[var(--color-line)] mt-20">
        <div className="shell py-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div className="flex items-center gap-2.5">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="/yc-logo.svg" alt="Y Combinator" className="w-6 h-6 rounded-[5px]" />
            <div className="flex flex-col items-start gap-0.5">
              <div className="wordmark text-[16px] leading-none">Bookface</div>
              <div className="wordmark text-[10px] leading-none text-3">by Y Combinator</div>
            </div>
          </div>
          <div className="flex flex-wrap items-center gap-x-6 gap-y-2 text-[12px] text-2">
            <Link href="/companies" className="hover:text-[var(--color-ink)]">Companies</Link>
            <Link href="/founders" className="hover:text-[var(--color-ink)]">Founders</Link>
            <Link href="/forum" className="hover:text-[var(--color-ink)]">Forum</Link>
            <Link href="/resources" className="hover:text-[var(--color-ink)]">Resources</Link>
            <Link href="/messages" className="hover:text-[var(--color-ink)]">Messages</Link>
          </div>
          <div className="kicker">Private access · Since 2005</div>
        </div>
      </footer>
    </>
  );
}
