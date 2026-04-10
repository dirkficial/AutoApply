"use client";

import { cn } from "@/lib/utils";

export type SortMode = "best" | "newest";

interface SortToggleProps {
  value: SortMode;
  onChange: (value: SortMode) => void;
}

export function SortToggle({ value, onChange }: SortToggleProps) {
  return (
    <div className="flex items-center gap-1 bg-muted rounded-md p-0.5">
      <button
        onClick={() => onChange("best")}
        className={cn(
          "px-2.5 py-1 rounded text-xs font-medium transition-colors",
          value === "best"
            ? "bg-background text-foreground shadow-sm"
            : "text-muted-foreground hover:text-foreground"
        )}
      >
        Best match
      </button>
      <button
        onClick={() => onChange("newest")}
        className={cn(
          "px-2.5 py-1 rounded text-xs font-medium transition-colors",
          value === "newest"
            ? "bg-background text-foreground shadow-sm"
            : "text-muted-foreground hover:text-foreground"
        )}
      >
        Newest
      </button>
    </div>
  );
}
