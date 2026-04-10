"use client";

import { useState } from "react";
import { X } from "lucide-react";
import { cn } from "@/lib/utils";
import { Filters, RoleType, LocationFilter } from "@/hooks/use-job-filters";

interface SidebarFiltersProps {
  filters: Filters;
  isAnyFilterActive: boolean;
  techStackOptions: string[];
  onRoleType: (v: RoleType) => void;
  onLocation: (v: LocationFilter) => void;
  onMinScore: (v: number) => void;
  onToggleTechStack: (tech: string) => void;
  onRemoteOnly: (v: boolean) => void;
  onClear: () => void;
}

const ROLE_OPTIONS: { label: string; value: RoleType }[] = [
  { label: "All SWE", value: "all" },
  { label: "Frontend", value: "frontend" },
  { label: "Backend", value: "backend" },
  { label: "Full-stack", value: "fullstack" },
  { label: "DevOps", value: "devops" },
  { label: "ML / AI", value: "mlai" },
];

const LOCATION_OPTIONS: { label: string; value: LocationFilter }[] = [
  { label: "Remote", value: "remote" },
  { label: "Hybrid", value: "hybrid" },
  { label: "Onsite", value: "onsite" },
  { label: "SF", value: "sf" },
  { label: "NYC", value: "nyc" },
  { label: "Austin", value: "austin" },
  { label: "Seattle", value: "seattle" },
];

function FilterSection({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="space-y-2">
      <p className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">
        {label}
      </p>
      {children}
    </div>
  );
}

function Chip({
  label,
  active,
  onClick,
}: {
  label: string;
  active: boolean;
  onClick: () => void;
}) {
  return (
    <button
      onClick={onClick}
      className={cn(
        "px-2 py-0.5 rounded-full text-xs font-medium border transition-colors duration-150 whitespace-nowrap",
        active
          ? "bg-[var(--autoapply-primary)] border-[var(--autoapply-primary)] text-white"
          : "border-border text-muted-foreground hover:text-foreground hover:border-white/30"
      )}
    >
      {label}
    </button>
  );
}

export function SidebarFilters({
  filters,
  isAnyFilterActive,
  techStackOptions,
  onRoleType,
  onLocation,
  onMinScore,
  onToggleTechStack,
  onRemoteOnly,
  onClear,
}: SidebarFiltersProps) {
  const [scoreExpanded, setScoreExpanded] = useState(false);

  return (
    <div className="flex flex-col h-full overflow-y-auto p-4 space-y-5">
      {/* Role type */}
      <FilterSection label="Role type">
        <div className="flex flex-wrap gap-1.5">
          {ROLE_OPTIONS.map((opt) => (
            <Chip
              key={opt.value}
              label={opt.label}
              active={filters.roleType === opt.value}
              onClick={() =>
                onRoleType(filters.roleType === opt.value ? "all" : opt.value)
              }
            />
          ))}
        </div>
      </FilterSection>

      <div className="border-t border-border" />

      {/* Location */}
      <FilterSection label="Location">
        <div className="flex flex-wrap gap-1.5">
          {LOCATION_OPTIONS.map((opt) => (
            <Chip
              key={opt.value}
              label={opt.label}
              active={filters.location === opt.value}
              onClick={() =>
                onLocation(filters.location === opt.value ? "all" : opt.value)
              }
            />
          ))}
        </div>
      </FilterSection>

      <div className="border-t border-border" />

      {/* Min match score */}
      <FilterSection label="Min match score">
        <button
          onClick={() => setScoreExpanded((o) => !o)}
          className={cn(
            "flex items-center justify-between w-full px-2 py-1 rounded-md text-xs border transition-colors",
            filters.minScore > 0
              ? "bg-[var(--autoapply-primary)]/10 border-[var(--autoapply-primary)]/40 text-[var(--autoapply-primary)]"
              : "border-border text-muted-foreground hover:text-foreground hover:border-white/30"
          )}
        >
          <span>{filters.minScore > 0 ? `${filters.minScore}+ score` : "Any score"}</span>
          <span className="text-[10px]">{scoreExpanded ? "▲" : "▼"}</span>
        </button>
        {scoreExpanded && (
          <div className="pt-1 px-1 space-y-1">
            <input
              type="range"
              min={0}
              max={100}
              step={5}
              value={filters.minScore}
              onChange={(e) => onMinScore(Number(e.target.value))}
              className="w-full accent-[var(--autoapply-primary)]"
            />
            <div className="flex justify-between text-[10px] text-muted-foreground">
              <span>0</span>
              <span className="font-medium text-foreground">{filters.minScore}</span>
              <span>100</span>
            </div>
          </div>
        )}
      </FilterSection>

      <div className="border-t border-border" />

      {/* Tech stack */}
      <FilterSection label="Tech stack">
        <div className="flex flex-wrap gap-1.5">
          {techStackOptions.map((tech) => (
            <Chip
              key={tech}
              label={tech}
              active={filters.techStack.includes(tech)}
              onClick={() => onToggleTechStack(tech)}
            />
          ))}
        </div>
      </FilterSection>

      <div className="border-t border-border" />

      {/* Remote only */}
      <FilterSection label="Remote">
        <Chip
          label="Remote only"
          active={filters.remoteOnly}
          onClick={() => onRemoteOnly(!filters.remoteOnly)}
        />
      </FilterSection>

      {/* Clear all */}
      {isAnyFilterActive && (
        <>
          <div className="border-t border-border" />
          <button
            onClick={onClear}
            className="flex items-center gap-1.5 text-xs text-muted-foreground hover:text-foreground transition-colors"
          >
            <X className="w-3 h-3" />
            Clear all filters
          </button>
        </>
      )}
    </div>
  );
}
