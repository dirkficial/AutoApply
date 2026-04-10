import { TopBar } from "@/components/layout/top-bar";
import { BatchStatus } from "@/components/layout/batch-status";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex flex-col h-screen bg-[var(--autoapply-bg)]">
      <TopBar />
      <main className="flex-1 overflow-hidden">
        {children}
      </main>
      <BatchStatus />
    </div>
  );
}
