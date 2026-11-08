import type { Metadata, Viewport } from "next";
import { Toaster } from "sonner";
import "./globals.css";
import Navbar from "@/components/Navbar";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Bookface — The YC founder community",
  description:
    "The private Y Combinator founder community. Search every YC company and founder, ask the collective brain, and access the founder vault.",
};

export const viewport: Viewport = {
  themeColor: "#ffffff",
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body className="min-h-screen flex flex-col">
        <Navbar />
        <main className="flex-1">{children}</main>
        <footer className="border-t border-[var(--color-line)] mt-20">
          <div className="shell py-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
            <div className="flex items-center gap-2.5">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src="/yc-logo.svg" alt="Y Combinator" className="w-6 h-6 rounded-[5px]" />
              <div>
                <div className="wordmark text-[16px] leading-tight">Bookface</div>
                <div className="text-[11.5px] text-3">The private YC founder community</div>
              </div>
            </div>
            <div className="flex flex-wrap items-center gap-x-6 gap-y-2 text-[12px] text-2">
              <Link href="/companies" className="hover:text-[var(--color-ink)]">Companies</Link>
              <Link href="/founders" className="hover:text-[var(--color-ink)]">Founders</Link>
              <Link href="/forum" className="hover:text-[var(--color-ink)]">Forum</Link>
              <Link href="/resources" className="hover:text-[var(--color-ink)]">Resources</Link>
              <Link href="/messages" className="hover:text-[var(--color-ink)]">Messages</Link>
            </div>
            <div className="kicker">Since 2005 · For YC founders only</div>
          </div>
        </footer>
        <Toaster
          position="bottom-right"
          toastOptions={{
            style: {
              fontFamily: "'Inter', system-ui, sans-serif",
              fontSize: "13px",
              background: "#fff",
              border: "1px solid #e7e5e4",
              borderRadius: "8px",
              color: "#111110",
            },
          }}
        />
      </body>
    </html>
  );
}
