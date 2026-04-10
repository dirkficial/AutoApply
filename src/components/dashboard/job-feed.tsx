"use client";

import { MockJob, JobStatus } from "@/lib/mock-data";
import { SortMode, SortToggle } from "./sort-toggle";
import { JobCard } from "./job-card";
import { SkeletonCard } from "./skeleton-card";
import { EmptyState } from "./empty-state";

interface JobFeedProps {
  jobs: MockJob[];
  statuses: Record<string, JobStatus>;
  sortMode: SortMode;
  onSortChange: (mode: SortMode) => void;
  onAction: (jobId: string, action: "YES" | "SKIPPED" | "REJECTED") => void;
  onCardClick: (jobId: string) => void;
  isLoading?: boolean;
  totalNew: number;
  lastUpdated: string;
}

export function JobFeed({
  jobs,
  statuses,
  sortMode,
  onSortChange,
  onAction,
  onCardClick,
  isLoading = false,
  totalNew,
  lastUpdated,
}: JobFeedProps) {
  const allDecided =
    jobs.length > 0 &&
    jobs.every((j) => {
      const s = statuses[j.id] ?? j.status;
      return s !== "NEW";
    });

  return (
    <div className="flex flex-col h-full">
      {/* Feed header */}
      <div className="flex items-center justify-between px-4 py-3 border-b border-border shrink-0">
        <div className="flex items-center gap-2">
          <span className="text-sm font-medium text-foreground">
            {totalNew} new job{totalNew !== 1 ? "s" : ""}
          </span>
          <span className="text-xs text-muted-foreground">{lastUpdated}</span>
        </div>
        <SortToggle value={sortMode} onChange={onSortChange} />
      </div>

      {/* Card list */}
      <div className="flex-1 overflow-y-auto px-4 py-3 space-y-2.5">
        {isLoading ? (
          <>
            <SkeletonCard />
            <SkeletonCard />
            <SkeletonCard />
          </>
        ) : jobs.length === 0 ? (
          <EmptyState variant="no-jobs" />
        ) : allDecided ? (
          <EmptyState variant="all-decided" />
        ) : (
          jobs.map((job) => (
            <JobCard
              key={job.id}
              job={job}
              status={statuses[job.id] ?? job.status}
              onAction={(action) => onAction(job.id, action)}
              onClick={() => onCardClick(job.id)}
            />
          ))
        )}
      </div>
    </div>
  );
}
