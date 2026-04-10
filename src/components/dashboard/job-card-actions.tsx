"use client";

import { ThumbsUp, SkipForward, ThumbsDown, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { JobStatus } from "@/lib/mock-data";

interface JobCardActionsProps {
  status: JobStatus;
  onYes: () => void;
  onSkip: () => void;
  onNo: () => void;
}

export function JobCardActions({ status, onYes, onSkip, onNo }: JobCardActionsProps) {
  if (status === "YES") {
    return (
      <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
        <Loader2 className="w-3.5 h-3.5 animate-spin" />
        Tailoring resume...
      </div>
    );
  }

  if (status === "REJECTED") {
    return (
      <span className="text-xs text-muted-foreground">Dismissed</span>
    );
  }

  if (status === "SKIPPED") {
    return (
      <span className="text-xs text-muted-foreground">Skipped</span>
    );
  }

  return (
    <div className="flex items-center gap-2">
      <button
        onClick={(e) => { e.stopPropagation(); onYes(); }}
        className={cn(
          "flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-medium border transition-colors duration-200",
          "border-emerald-600 text-emerald-500 hover:bg-emerald-600/10"
        )}
      >
        <ThumbsUp className="w-3.5 h-3.5" />
        Yes
      </button>
      <button
        onClick={(e) => { e.stopPropagation(); onSkip(); }}
        className={cn(
          "flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-medium border transition-colors duration-200",
          "border-border text-muted-foreground hover:text-foreground hover:bg-muted"
        )}
      >
        <SkipForward className="w-3.5 h-3.5" />
        Skip
      </button>
      <button
        onClick={(e) => { e.stopPropagation(); onNo(); }}
        className={cn(
          "flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-medium border transition-colors duration-200",
          "border-red-800 text-red-500 hover:bg-red-600/10"
        )}
      >
        <ThumbsDown className="w-3.5 h-3.5" />
        No
      </button>
    </div>
  );
}
