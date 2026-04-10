export function SkeletonCard() {
  return (
    <div className="rounded-lg border border-border bg-card p-4 space-y-3 animate-pulse">
      <div className="flex items-start gap-3">
        <div className="w-9 h-9 rounded-lg bg-muted shrink-0" />
        <div className="flex-1 space-y-1.5">
          <div className="h-3.5 bg-muted rounded w-1/3" />
          <div className="h-3 bg-muted rounded w-1/4" />
        </div>
        <div className="w-8 h-5 bg-muted rounded-full shrink-0" />
      </div>
      <div className="h-4 bg-muted rounded w-2/3" />
      <div className="space-y-1.5">
        <div className="h-3 bg-muted rounded w-full" />
        <div className="h-3 bg-muted rounded w-4/5" />
      </div>
      <div className="flex gap-1.5">
        <div className="h-5 w-16 bg-muted rounded" />
        <div className="h-5 w-12 bg-muted rounded" />
        <div className="h-5 w-20 bg-muted rounded" />
      </div>
      <div className="flex gap-2 pt-1">
        <div className="h-7 w-14 bg-muted rounded-md" />
        <div className="h-7 w-14 bg-muted rounded-md" />
        <div className="h-7 w-14 bg-muted rounded-md" />
      </div>
    </div>
  );
}
