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
      <div className="flex flex-1 overflow-hidden">
        {/* Sidebar / Filters */}
        <aside className="hidden lg:flex flex-col w-56 shrink-0 border-r border-border overflow-y-auto p-4">
          <h2 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-3">
            Filters
          </h2>
        </aside>

        {/* Main content */}
        <main className="flex-1 overflow-y-auto">
          {children}
        </main>
      </div>
      <BatchStatus />
    </div>
  );
}
