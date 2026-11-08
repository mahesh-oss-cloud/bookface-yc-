"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Building2, House, MessageSquare, UserRound, Users } from "lucide-react";

const ITEMS = [
  { href: "/", label: "Home", icon: House, match: (path: string) => path === "/" },
  { href: "/founders", label: "Founders", icon: Users, match: (path: string) => path.startsWith("/founders") },
  { href: "/companies", label: "Companies", icon: Building2, match: (path: string) => path.startsWith("/companies") },
  { href: "/messages", label: "Messages", icon: MessageSquare, match: (path: string) => path.startsWith("/messages") },
  { href: "/profile", label: "Me", icon: UserRound, match: (path: string) => path.startsWith("/profile") },
];

export default function MobileBottomNav() {
  const pathname = usePathname();

  return (
    <nav className="mobile-tabbar lg:hidden" aria-label="Primary mobile navigation">
      {ITEMS.map(({ href, label, icon: Icon, match }) => {
        const active = match(pathname);
        return (
          <Link
            key={href}
            href={href}
            aria-label={label}
            aria-current={active ? "page" : undefined}
            className={`mobile-tabbar-link ${active ? "is-active" : ""}`}
          >
            <Icon size={19} strokeWidth={active ? 2.25 : 1.8} aria-hidden="true" />
            <span>{label}</span>
          </Link>
        );
      })}
    </nav>
  );
}
