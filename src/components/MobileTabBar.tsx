"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Home, MessageSquare, Search, UserRound, Users } from "lucide-react";

const TABS = [
  { href: "/", label: "Home", Icon: Home },
  { href: "/search", label: "Search", Icon: Search },
  { href: "/network", label: "Network", Icon: Users },
  { href: "/messages", label: "Messages", Icon: MessageSquare },
  { href: "/profile", label: "Me", Icon: UserRound },
];

export default function MobileTabBar() {
  const pathname = usePathname();

  return (
    <nav className="mobile-tabbar" aria-label="Main navigation">
      <div className="mobile-tabbar-inner">
        {TABS.map(({ href, label, Icon }) => {
          const active =
            href === "/"
              ? pathname === "/"
              : pathname === href || pathname.startsWith(href + "/");
          return (
            <Link
              key={href}
              href={href}
              aria-current={active ? "page" : undefined}
              className={`mobile-tabbar-link ${active ? "is-active" : ""}`}
            >
              <Icon size={20} strokeWidth={active ? 2.25 : 1.8} aria-hidden="true" />
              <span>{label}</span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
