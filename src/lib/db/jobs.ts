import { db } from "@/lib/db";

export type JobStatus =
  | "NEW"
  | "YES"
  | "SKIPPED"
  | "TAILORING"
  | "CONFIRMED"
  | "APPLIED"
  | "INTERVIEWING"
  | "REJECTED"
  | "OFFER";

export interface DashboardJob {
  id: string;
  company: string;
  title: string;
  location: string;
  isRemote: boolean;
  matchScore: number;
  summary: string;
  techStack: string[];
  datePosted: Date;
  status: JobStatus;
  applyUrl: string;
}

export async function getDashboardJobs(): Promise<DashboardJob[]> {
  const jobs = await db.job.findMany({
    orderBy: { fetchedAt: "desc" },
    include: { userJobs: true },
  });

  return jobs.map((job) => {
    const userJob = job.userJobs[0];
    return {
      id: job.id,
      company: job.companyName,
      title: job.title,
      location: job.location,
      isRemote: job.isRemote,
      matchScore: userJob?.matchScore ?? 0,
      summary: job.aiSummary ?? "",
      techStack: job.techStack,
      datePosted: job.datePosted ?? job.fetchedAt,
      status: (userJob?.status ?? "NEW") as JobStatus,
      applyUrl: job.url,
    };
  });
}
