"use client";

import { useMemo, useState } from "react";
import { MockJob } from "@/lib/mock-data";

export type RoleType = "all" | "frontend" | "backend" | "fullstack" | "devops" | "mlai";
export type LocationFilter =
  | "all"
  | "remote"
  | "hybrid"
  | "onsite"
  | "sf"
  | "nyc"
  | "austin"
  | "seattle";
export type SortMode = "best" | "newest";

export interface Filters {
  roleType: RoleType;
  location: LocationFilter;
  minScore: number;
  techStack: string[];
  remoteOnly: boolean;
}

const DEFAULT_FILTERS: Filters = {
  roleType: "all",
  location: "all",
  minScore: 0,
  techStack: [],
  remoteOnly: false,
};

function matchesRole(job: MockJob, roleType: RoleType): boolean {
  if (roleType === "all") return true;
  const title = job.title.toLowerCase();
  switch (roleType) {
    case "frontend":
      return title.includes("frontend") || title.includes("front-end") || title.includes("front end");
    case "backend":
      return title.includes("backend") || title.includes("back-end") || title.includes("back end");
    case "fullstack":
      return title.includes("full stack") || title.includes("full-stack") || title.includes("fullstack");
    case "devops":
      return (
        title.includes("devops") ||
        title.includes("sre") ||
        title.includes("platform") ||
        title.includes("infrastructure")
      );
    case "mlai":
      return (
        title.includes("ml") ||
        title.includes("ai") ||
        title.includes("machine learning") ||
        title.includes("data scientist")
      );
    default:
      return true;
  }
}

function matchesLocation(job: MockJob, location: LocationFilter): boolean {
  if (location === "all") return true;
  const loc = job.location.toLowerCase();
  switch (location) {
    case "remote":
      return job.isRemote;
    case "hybrid":
      return loc.includes("hybrid");
    case "onsite":
      return !job.isRemote && !loc.includes("hybrid");
    case "sf":
      return loc.includes("san francisco") || loc.includes("sf");
    case "nyc":
      return loc.includes("new york") || loc.includes("nyc");
    case "austin":
      return loc.includes("austin");
    case "seattle":
      return loc.includes("seattle");
    default:
      return true;
  }
}

export function useJobFilters(jobs: MockJob[]) {
  const [filters, setFilters] = useState<Filters>(DEFAULT_FILTERS);
  const [sortMode, setSortMode] = useState<SortMode>("best");

  const filtered = useMemo(() => {
    const result = jobs.filter((job) => {
      if (!matchesRole(job, filters.roleType)) return false;
      if (!matchesLocation(job, filters.location)) return false;
      if (job.matchScore < filters.minScore) return false;
      if (filters.remoteOnly && !job.isRemote) return false;
      if (filters.techStack.length > 0) {
        const jobStackLower = job.techStack.map((s) => s.toLowerCase());
        const hasMatch = filters.techStack.some((t) =>
          jobStackLower.includes(t.toLowerCase())
        );
        if (!hasMatch) return false;
      }
      return true;
    });

    return [...result].sort((a, b) =>
      sortMode === "best"
        ? b.matchScore - a.matchScore
        : b.datePosted.getTime() - a.datePosted.getTime()
    );
  }, [jobs, filters, sortMode]);

  const isAnyFilterActive =
    filters.roleType !== "all" ||
    filters.location !== "all" ||
    filters.minScore > 0 ||
    filters.techStack.length > 0 ||
    filters.remoteOnly;

  function clearFilters() {
    setFilters(DEFAULT_FILTERS);
  }

  function setRoleType(roleType: RoleType) {
    setFilters((f) => ({ ...f, roleType }));
  }

  function setLocation(location: LocationFilter) {
    setFilters((f) => ({ ...f, location }));
  }

  function setMinScore(minScore: number) {
    setFilters((f) => ({ ...f, minScore }));
  }

  function toggleTechStack(tech: string) {
    setFilters((f) => ({
      ...f,
      techStack: f.techStack.includes(tech)
        ? f.techStack.filter((t) => t !== tech)
        : [...f.techStack, tech],
    }));
  }

  function setRemoteOnly(remoteOnly: boolean) {
    setFilters((f) => ({ ...f, remoteOnly }));
  }

  return {
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
  };
}
