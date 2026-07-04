"use client";

import { usePathname } from "next/navigation";
import Link from "next/link";
import {
  LayoutDashboard,
  FilePlus,
  FolderOpen,
  Settings,
  HelpCircle,
  LogOut,
  Newspaper,
} from "lucide-react";
import { cn } from "@/lib/utils";

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

const BOTTOM_NAV: NavItem[] = [
  { label: "Settings", href: "/settings", icon: Settings },
  { label: "Help", href: "#", icon: HelpCircle },
];

/**
 * Sidebar navigation for Presswork CMS.
 *
 * Matches the Stitch designs: narrow left rail with the "Presswork CMS / Editorial Desk"
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
        <h1 className="text-headline-md text-on-surface tracking-tight">
          Presswork
          <span className="text-proof-blue-light ml-1">CMS</span>
        </h1>
        <p className="text-data-label text-graphite mt-1">Editorial Desk</p>
      </div>

      {/* ─── Main navigation ─── */}
      <nav className="flex-1 px-3 py-4 space-y-1">
        {MAIN_NAV.map((item) => {
          const isActive = pathname === item.href || pathname?.startsWith(item.href + "/");
          return (
            <Link
              key={item.href}
              href={item.href}
              id={`nav-${item.label.toLowerCase().replace(/\s/g, "-")}`}
              className={cn(
                "flex items-center gap-3 px-3 py-2.5 rounded-md text-ui-medium transition-colors duration-150",
                isActive
                  ? "bg-proof-blue/15 text-proof-blue-light border-l-2 border-proof-blue"
                  : "text-on-surface-variant hover:bg-surface-container-high hover:text-on-surface"
              )}
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
        <button
          id="nav-logout"
          className="flex items-center gap-3 w-full px-3 py-2.5 rounded-md text-ui-base text-on-surface-variant hover:bg-redline/10 hover:text-redline-light transition-colors duration-150"
        >
          <LogOut className="w-5 h-5 shrink-0" />
          <span>Logout</span>
        </button>
      </div>
    </aside>
  );
}
