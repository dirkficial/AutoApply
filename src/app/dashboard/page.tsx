import { getDashboardJobs } from "@/lib/db/jobs";
import { DashboardClient } from "@/components/dashboard/dashboard-client";

export const dynamic = "force-dynamic";

export default async function DashboardPage() {
  const jobs = await getDashboardJobs();
  return <DashboardClient initialJobs={jobs} />;
}
