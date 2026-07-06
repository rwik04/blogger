"use client";

import { usePathname } from "next/navigation";
import Link from "next/link";
import {
  FilePlus,
  FolderOpen,
  HelpCircle,
  LogOut,
  Newspaper,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { getNavItemClasses, isNavItemActive } from "@/lib/utils/nav";

interface NavItem {
  label: string;
  href: string;
  icon: React.ElementType;
}

const MAIN_NAV: NavItem[] = [
  { label: "Posts", href: "/dashboard", icon: Newspaper },
  { label: "New Blog", href: "/new", icon: FilePlus },
  { label: "Content Library", href: "/blogs", icon: FolderOpen },
];

const BOTTOM_NAV: NavItem[] = [{ label: "Help", href: "#", icon: HelpCircle }];

/**
 * Sidebar navigation.
 *
 * Matches the Stitch designs: narrow left rail with the brand wordmark
 * header, icon + label links, and a graphite border separator.
 */
export function Nav() {
  const pathname = usePathname();

  return (
    <aside
      id="nav-sidebar"
      className="fixed left-0 top-0 bottom-0 flex flex-col w-[260px] bg-surface-container-lowest border-r border-border z-40"
    >
      {/* ─── Brand header ─── */}
      <div className="px-6 py-6 border-b border-border">
        <h1 className="font-serif italic text-3xl text-on-surface tracking-tight">blogger</h1>
      </div>

      {/* ─── Main navigation ─── */}
      <nav className="flex-1 px-3 py-4 space-y-1">
        {MAIN_NAV.map((item) => {
          const isActive = isNavItemActive(pathname, item.href);
          return (
            <Link
              key={item.href}
              href={item.href}
              id={`nav-${item.label.toLowerCase().replace(/\s/g, "-")}`}
              className={getNavItemClasses(isActive, "sidebar")}
            >
              <item.icon className="w-5 h-5 shrink-0" />
              <span>{item.label}</span>
            </Link>
          );
        })}
      </nav>

      {/* ─── Bottom navigation ─── */}
      <div className="px-3 py-4 border-t border-border space-y-1">
        {BOTTOM_NAV.map((item) => (
          <Link
            key={item.label}
            href={item.href}
            id={`nav-${item.label.toLowerCase()}`}
            className="flex items-center gap-3 px-3 py-2.5 rounded-md text-ui-base text-on-surface-variant hover:bg-surface-container-high hover:text-on-surface transition-colors duration-150"
          >
            <item.icon className="w-5 h-5 shrink-0" />
            <span>{item.label}</span>
          </Link>
        ))}

        {/* Logout */}
        <Button
          id="nav-logout"
          variant="ghost"
          className="w-full justify-start gap-3 h-auto px-3 py-2.5 rounded-md text-ui-base text-on-surface-variant hover:bg-redline/10 hover:text-redline-light"
        >
          <LogOut className="w-5 h-5 shrink-0" />
          <span>Logout</span>
        </Button>
      </div>
    </aside>
  );
}
