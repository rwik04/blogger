"use client";

import { usePathname } from "next/navigation";
import Link from "next/link";
import { getNavItemClasses, isNavItemActive } from "@/lib/utils/nav";

/**
 * Top bar with breadcrumb-style navigation tabs (Dashboard, Library, Topics, etc.)
 * Matches the secondary navigation row seen in the Stitch designs.
 */

interface TabItem {
  label: string;
  href: string;
}

const TABS: TabItem[] = [
  { label: "Dashboard", href: "/dashboard" },
  { label: "Blogs", href: "/blogs" },
];

export function TopBar() {
  const pathname = usePathname();

  return (
    <div className="flex items-center gap-1 px-6 py-2 border-b border-border bg-surface-container-lowest">
      {TABS.map((tab) => {
        const isActive = isNavItemActive(pathname, tab.href);
        return (
          <Link
            key={tab.href}
            href={tab.href}
            className={getNavItemClasses(isActive, "tab")}
          >
            {tab.label}
          </Link>
        );
      })}
    </div>
  );
}
