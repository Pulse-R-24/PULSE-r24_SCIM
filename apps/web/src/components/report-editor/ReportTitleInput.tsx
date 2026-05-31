interface ReportTitleInputProps {
  value: string
  disabled?: boolean
  onChange: (value: string) => void
}

export function ReportTitleInput({ value, disabled, onChange }: ReportTitleInputProps) {
  return (
    <input
      value={value}
      disabled={disabled}
      onChange={(event) => onChange(event.target.value)}
      placeholder="Report title"
      className="w-full rounded-lg border border-slate-700/60 bg-slate-950/70 px-4 py-3 text-xl font-black text-slate-100
                 placeholder:text-slate-600 focus:outline-none focus:ring-2 focus:ring-blue-500/40 disabled:opacity-60"
    />
  )
}
