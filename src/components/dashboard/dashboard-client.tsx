"use client";

import { useState } from "react";
import { PanelLeft } from "lucide-react";
import { mockJobs, mockPreferences, JobStatus } from "@/lib/mock-data";
import { useJobFilters } from "@/hooks/use-job-filters";
import { cn } from "@/lib/utils";
import { SidebarFilters } from "./sidebar-filters";
import { JobFeed } from "./job-feed";
import { SortMode } from "./sort-toggle";

export function DashboardClient() {
  const {
    filters,
    sortMode,
    setSortMode,
    filtered,
    isAnyFilterActive,
    clearFilters,
    setRoleType,
    setLocation,
    setMinScore,
    toggleTechStack,
    setRemoteOnly,
  } = useJobFilters(mockJobs);

  const [statuses, setStatuses] = useState<Record<string, JobStatus>>({});
  const [sidebarOpen, setSidebarOpen] = useState(true);

  const newJobCount = filtered.filter(
    (j) => (statuses[j.id] ?? j.status) === "NEW"
  ).length;

  function handleAction(jobId: string, action: "YES" | "SKIPPED" | "REJECTED") {
    setStatuses((prev) => ({ ...prev, [jobId]: action }));
  }

  return (
    <div className="flex h-full overflow-hidden">
      {/* Sidebar */}
      <aside
        className={cn(
          "shrink-0 border-r border-border bg-[var(--autoapply-bg)] overflow-hidden transition-all duration-200 ease-out",
          sidebarOpen ? "w-56" : "w-0"
        )}
      >
        <div className="flex items-center justify-between px-4 pt-4 pb-2">
          <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
            Filters
          </p>
          <button
            onClick={() => setSidebarOpen(false)}
            className="text-muted-foreground hover:text-foreground transition-colors"
            aria-label="Close sidebar"
          >
            <PanelLeft className="w-4 h-4" />
          </button>
        </div>
        <SidebarFilters
          filters={filters}
          isAnyFilterActive={isAnyFilterActive}
          techStackOptions={mockPreferences.techStack}
          onRoleType={setRoleType}
          onLocation={setLocation}
          onMinScore={setMinScore}
          onToggleTechStack={toggleTechStack}
          onRemoteOnly={setRemoteOnly}
          onClear={clearFilters}
        />
      </aside>

      {/* Main content */}
      <div className="flex flex-col flex-1 overflow-hidden">
        {/* Toggle button when sidebar is closed */}
        {!sidebarOpen && (
          <div className="px-4 pt-3 shrink-0">
            <button
              onClick={() => setSidebarOpen(true)}
              className="flex items-center gap-1.5 text-xs text-muted-foreground hover:text-foreground transition-colors"
              aria-label="Open sidebar"
            >
              <PanelLeft className="w-4 h-4" />
              Filters
            </button>
          </div>
        )}
        <JobFeed
          jobs={filtered}
          statuses={statuses}
          sortMode={sortMode as SortMode}
          onSortChange={(mode) => setSortMode(mode)}
          onAction={handleAction}
          onCardClick={() => {/* Phase 3: open focus view */}}
          totalNew={newJobCount}
          lastUpdated="12 min ago"
        />
      </div>
    </div>
  );
}
