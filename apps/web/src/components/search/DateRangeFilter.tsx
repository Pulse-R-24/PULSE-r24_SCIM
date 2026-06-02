export function DateRangeFilter({
  dateFrom,
  dateTo,
  onDateFromChange,
  onDateToChange,
}: {
  dateFrom: string
  dateTo: string
  onDateFromChange: (value: string) => void
  onDateToChange: (value: string) => void
}) {
  return (
    <div className="grid grid-cols-2 gap-3">
      <label className="space-y-1">
        <span className="text-xs font-semibold uppercase tracking-[0.16em] text-slate-500">From</span>
        <input suppressHydrationWarning
          type="date"
          value={dateFrom}
          onChange={(event) => onDateFromChange(event.target.value)}
          className="w-full rounded-lg border border-slate-700/60 bg-slate-950/70 px-3 py-2 text-sm text-slate-200"
        />
      </label>
      <label className="space-y-1">
        <span className="text-xs font-semibold uppercase tracking-[0.16em] text-slate-500">To</span>
        <input suppressHydrationWarning
          type="date"
          value={dateTo}
          onChange={(event) => onDateToChange(event.target.value)}
          className="w-full rounded-lg border border-slate-700/60 bg-slate-950/70 px-3 py-2 text-sm text-slate-200"
        />
      </label>
    </div>
  )
}
