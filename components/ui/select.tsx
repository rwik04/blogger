import * as React from "react";
import { ChevronDown } from "lucide-react";

import { cn } from "@/lib/utils";

/**
 * Plain native `<select>` styled to match the rest of the form primitives.
 * A native element is enough for this app's simple mode/status/preset
 * dropdowns and keeps us from pulling in the full base-ui Select composition.
 */
function Select({ className, children, ...props }: React.ComponentProps<"select">) {
  return (
    <div className="relative">
      <select
        data-slot="select"
        className={cn(
          "flex h-9 w-full appearance-none rounded-md border border-input bg-surface-container-low px-3 pr-8 text-ui-base text-on-surface shadow-xs transition-colors outline-none focus-visible:border-ring focus-visible:ring-2 focus-visible:ring-ring/40 disabled:cursor-not-allowed disabled:opacity-50",
          className
        )}
        {...props}
      >
        {children}
      </select>
      <ChevronDown className="pointer-events-none absolute right-2.5 top-1/2 -translate-y-1/2 size-3.5 text-graphite" />
    </div>
  );
}

export { Select };
