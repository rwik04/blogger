import { cn } from "@/lib/utils";

/**
 * Shared active-route detection for nav links: matches the exact path or
 * any nested route beneath it.
 */
export function isNavItemActive(pathname: string | null, href: string): boolean {
  return pathname === href || (pathname?.startsWith(href + "/") ?? false);
}

type NavItemVariant = "sidebar" | "tab";

/**
 * Shared active/inactive class logic for route-driven nav links, used by
 * both the sidebar (`Nav`) and the secondary tab bar (`TopBar`) so the two
 * don't drift out of sync.
 */
export function getNavItemClasses(isActive: boolean, variant: NavItemVariant): string {
  if (variant === "sidebar") {
    return cn(
      "flex items-center gap-3 px-3 py-2.5 rounded-md text-ui-medium transition-colors duration-150",
      isActive
        ? "bg-proof-blue/15 text-proof-blue-light border-l-2 border-proof-blue"
        : "text-on-surface-variant hover:bg-surface-container-high hover:text-on-surface"
    );
  }

  return cn(
    "px-3 py-1.5 rounded-md text-ui-medium transition-colors duration-150",
    isActive
      ? "text-proof-blue-light bg-proof-blue/10"
      : "text-on-surface-variant hover:text-on-surface hover:bg-surface-container-high"
  );
}
