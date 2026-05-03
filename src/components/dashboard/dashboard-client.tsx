"use client";

import { useState } from "react";
import { PanelLeft } from "lucide-react";
import { useSession, signOut } from "next-auth/react";
import Link from "next/link";
import { DashboardJob, JobStatus } from "@/lib/db/jobs";
import { useJobFilters } from "@/hooks/use-job-filters";
import { cn } from "@/lib/utils";
import { UserAvatar } from "@/components/ui/user-avatar";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import { SidebarFilters } from "./sidebar-filters";
import { JobFeed } from "./job-feed";

interface DashboardClientProps {
  initialJobs: DashboardJob[];
}

export function DashboardClient({ initialJobs }: DashboardClientProps) {
  const { data: session } = useSession();
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
  } = useJobFilters(initialJobs);

  const [statuses, setStatuses] = useState<Record<string, JobStatus>>({});
  const [sidebarOpen, setSidebarOpen] = useState(true);

  const newJobCount = filtered.filter(
    (j) => (statuses[j.id] ?? j.status) === "NEW"
  ).length;

  // Collect unique tech tags from all jobs for the filter sidebar
  const allTechStack = Array.from(
    new Set(initialJobs.flatMap((j) => j.techStack))
  ).sort();

  function handleAction(jobId: string, action: "YES" | "SKIPPED" | "REJECTED") {
    setStatuses((prev) => ({ ...prev, [jobId]: action }));
  }

  return (
    <div className="flex h-full overflow-hidden">
      {/* Sidebar */}
      <aside
        className={cn(
          "shrink-0 border-r border-border bg-[var(--autoapply-bg)] overflow-hidden transition-all duration-200 ease-out flex flex-col",
          sidebarOpen ? "w-56" : "w-0"
        )}
      >
        <div className="flex items-center justify-between px-4 pt-4 pb-2 shrink-0">
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
        <div className="flex-1 overflow-hidden">
          <SidebarFilters
            filters={filters}
            isAnyFilterActive={isAnyFilterActive}
            techStackOptions={allTechStack}
            onRoleType={setRoleType}
            onLocation={setLocation}
            onMinScore={setMinScore}
            onToggleTechStack={toggleTechStack}
            onRemoteOnly={setRemoteOnly}
            onClear={clearFilters}
          />
        </div>

        {/* User footer */}
        <div className="shrink-0 border-t border-border p-3 flex items-center gap-2.5">
          <DropdownMenu>
            <DropdownMenuTrigger className="shrink-0 rounded-full focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--autoapply-primary)]">
              <UserAvatar
                name={session?.user?.name}
                image={session?.user?.image}
                size="sm"
              />
            </DropdownMenuTrigger>
            <DropdownMenuContent side="top" align="start" className="w-44">
              <Link href="/profile">
                <DropdownMenuItem>Profile</DropdownMenuItem>
              </Link>
              <DropdownMenuSeparator />
              <DropdownMenuItem
                className="text-red-400 focus:text-red-400"
                onClick={() => signOut({ callbackUrl: "/sign-in" })}
              >
                Sign out
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
          <p className="flex-1 min-w-0 text-xs font-medium text-foreground truncate">
            {session?.user?.name ?? "—"}
          </p>
        </div>
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
          sortMode={sortMode}
          onSortChange={(mode) => setSortMode(mode)}
          onAction={handleAction}
          onCardClick={() => {}}
          totalNew={newJobCount}
          lastUpdated="just now"
        />
      </div>
    </div>
  );
}
