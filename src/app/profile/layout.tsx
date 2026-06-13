import { TopBar } from '@/components/layout/top-bar'
import { BatchStatus } from '@/components/layout/batch-status'

export default function ProfileLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex flex-col h-screen bg-[var(--autoapply-bg)]">
      <TopBar />
      <main className="flex-1 overflow-y-auto">
        {children}
      </main>
      <BatchStatus />
    </div>
  )
}
