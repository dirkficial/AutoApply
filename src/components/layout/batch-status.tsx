export function BatchStatus() {
  return (
    <div className="h-8 border-t border-border bg-[var(--autoapply-bg)] flex items-center px-4 gap-4 text-xs text-muted-foreground shrink-0">
      <span>Last checked: —</span>
      <span className="text-border">·</span>
      <span>Next check in: —</span>
    </div>
  );
}
