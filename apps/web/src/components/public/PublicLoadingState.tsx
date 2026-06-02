export function PublicLoadingState() {
  return (
    <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
      {Array.from({ length: 6 }).map((_, index) => (
        <div key={index} className="h-72 animate-pulse rounded-2xl bg-white/70 shadow-sm" />
      ))}
    </div>
  )
}
