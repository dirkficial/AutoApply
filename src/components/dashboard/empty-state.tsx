import { Inbox, CheckCircle2 } from "lucide-react";

type EmptyStateVariant = "no-jobs" | "all-decided";

interface EmptyStateProps {
  variant: EmptyStateVariant;
  onViewSkipped?: () => void;
}

export function EmptyState({ variant, onViewSkipped }: EmptyStateProps) {
  if (variant === "no-jobs") {
    return (
      <div className="flex flex-col items-center justify-center py-20 px-6 text-center">
        <div className="w-12 h-12 rounded-full bg-muted flex items-center justify-center mb-4">
          <Inbox className="w-6 h-6 text-muted-foreground" />
        </div>
        <p className="text-sm font-medium text-foreground">No new matches</p>
        <p className="text-xs text-muted-foreground mt-1">Next check in 3h 42m</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center justify-center py-20 px-6 text-center">
      <div className="w-12 h-12 rounded-full bg-muted flex items-center justify-center mb-4">
        <CheckCircle2 className="w-6 h-6 text-muted-foreground" />
      </div>
      <p className="text-sm font-medium text-foreground">
        You&apos;ve reviewed all jobs in this batch. Nice work.
      </p>
      {onViewSkipped && (
        <button
          onClick={onViewSkipped}
          className="mt-3 text-xs text-[var(--autoapply-primary)] hover:underline"
        >
          View skipped jobs
        </button>
      )}
    </div>
  );
}
