interface ReviewCommentBoxProps {
  value: string
  onChange: (value: string) => void
}

export function ReviewCommentBox({ value, onChange }: ReviewCommentBoxProps) {
  return (
    <textarea
      value={value}
      onChange={(e) => onChange(e.target.value)}
      rows={3}
      placeholder="Add review comment..."
      className="w-full text-sm bg-slate-900/60 border border-slate-700/50 rounded-lg px-3 py-2 text-slate-200
                 placeholder:text-slate-600 resize-none focus:outline-none focus:ring-1 focus:ring-blue-500/50"
    />
  )
}
