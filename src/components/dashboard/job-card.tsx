"use client";

import { useState } from "react";
import { MapPin } from "lucide-react";
import { MockJob, JobStatus } from "@/lib/mock-data";
import { cn, companyColor, relativeTime } from "@/lib/utils";
import { MatchBadge } from "./match-badge";
import { TechTag } from "./tech-tag";
import { JobCardActions } from "./job-card-actions";

interface JobCardProps {
  job: MockJob;
  status: JobStatus;
  onAction: (action: "YES" | "SKIPPED" | "REJECTED") => void;
  onClick: () => void;
}

export function JobCard({ job, status, onAction, onClick }: JobCardProps) {
  const [flash, setFlash] = useState(false);

  function handleYes() {
    setFlash(true);
    setTimeout(() => setFlash(false), 300);
    onAction("YES");
  }

  const bgColor = companyColor(job.company);
  const initial = job.company[0].toUpperCase();
  const isDecided = status === "REJECTED" || status === "SKIPPED";

  return (
    <div
      onClick={onClick}
      className={cn(
        "rounded-lg border border-border bg-card p-4 cursor-pointer",
        "transition-all duration-200 ease-out",
        "hover:border-white/20",
        flash && "ring-2 ring-emerald-500 border-transparent bg-emerald-500/5",
        isDecided && "opacity-50",
      )}
    >
      {/* Header row */}
      <div className="flex items-start gap-3">
        <div
          className="w-9 h-9 rounded-lg flex items-center justify-center text-white text-sm font-bold shrink-0"
          style={{ backgroundColor: bgColor }}
        >
          {initial}
        </div>

        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 flex-wrap">
            <span className="text-xs font-medium text-foreground">{job.company}</span>
            {job.isRemote && (
              <span className="px-1.5 py-0.5 rounded text-[10px] font-medium bg-[var(--autoapply-primary)]/15 text-[var(--autoapply-primary)]">
                Remote
              </span>
            )}
          </div>
          <div className="flex items-center gap-1 mt-0.5">
            <MapPin className="w-3 h-3 text-muted-foreground shrink-0" />
            <span className="text-xs text-muted-foreground truncate">{job.location}</span>
          </div>
        </div>

        <MatchBadge score={job.matchScore} />
      </div>

      {/* Job title */}
      <p className="mt-2.5 text-sm font-medium text-foreground leading-snug">
        {job.title}
      </p>

      {/* AI summary */}
      <p className="mt-1.5 text-xs text-muted-foreground line-clamp-2 leading-relaxed">
        {job.summary}
      </p>

      {/* Tech stack tags */}
      <div className="mt-2.5 flex flex-wrap gap-1.5">
        {job.techStack.map((tech) => (
          <TechTag key={tech} label={tech} />
        ))}
      </div>

      {/* Footer row */}
      <div className="mt-3 flex items-center justify-between gap-3">
        <JobCardActions
          status={status}
          onYes={handleYes}
          onSkip={() => onAction("SKIPPED")}
          onNo={() => onAction("REJECTED")}
        />
        <span className="text-xs text-muted-foreground shrink-0 ml-auto">
          {relativeTime(job.datePosted)}
        </span>
      </div>
    </div>
  );
}
