"use client";

import { usePathname } from "next/navigation";
import Link from "next/link";
import { cn } from "@/lib/utils";

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
  { label: "Settings", href: "/settings" },
];

export function TopBar() {
  const pathname = usePathname();

  return (
    <div className="flex items-center gap-1 px-6 py-2 border-b border-border bg-surface-container-lowest">
      {TABS.map((tab) => {
        const isActive = pathname === tab.href || pathname?.startsWith(tab.href + "/");
        return (
          <Link
            key={tab.href}
            href={tab.href}
            className={cn(
              "px-3 py-1.5 rounded-md text-ui-medium transition-colors duration-150",
              isActive
                ? "text-proof-blue-light bg-proof-blue/10"
                : "text-on-surface-variant hover:text-on-surface hover:bg-surface-container-high"
            )}
          >
            {tab.label}
          </Link>
        );
      })}
    </div>
  );
}
