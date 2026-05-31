import { Eye, FilePenLine } from 'lucide-react'
import { cn } from '@/lib/utils'

interface ReportMarkdownEditorProps {
  value: string
  disabled?: boolean
  preview: boolean
  onPreviewChange: (value: boolean) => void
  onChange: (value: string) => void
}

function renderPreview(markdown: string) {
  return markdown.split('\n').map((line, index) => {
    if (line.startsWith('# ')) {
      return <h1 key={index} className="text-xl font-black text-slate-100 mt-4 first:mt-0">{line.slice(2)}</h1>
    }
    if (line.startsWith('## ')) {
      return <h2 key={index} className="text-base font-bold text-slate-200 mt-4 first:mt-0">{line.slice(3)}</h2>
    }
    if (line.startsWith('- ')) {
      return <p key={index} className="text-sm text-slate-300 leading-7 pl-3">• {line.slice(2)}</p>
    }
    if (!line.trim()) {
      return <div key={index} className="h-3" />
    }
    return <p key={index} className="text-sm text-slate-300 leading-7">{line}</p>
  })
}

export function ReportMarkdownEditor({
  value,
  disabled,
  preview,
  onPreviewChange,
  onChange,
}: ReportMarkdownEditorProps) {
  return (
    <div className="rounded-lg border border-white/10 bg-white/[0.025] overflow-hidden">
      <div className="flex items-center justify-between border-b border-white/10 bg-white/[0.03] px-3 py-2">
        <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">Body Markdown</p>
        <div className="flex items-center gap-1">
          <button
            type="button"
            onClick={() => onPreviewChange(false)}
            className={cn('rounded-md p-2 text-slate-500 hover:text-slate-200', !preview && 'bg-blue-500/15 text-blue-300')}
            title="Edit"
          >
            <FilePenLine className="w-4 h-4" />
          </button>
          <button
            type="button"
            onClick={() => onPreviewChange(true)}
            className={cn('rounded-md p-2 text-slate-500 hover:text-slate-200', preview && 'bg-blue-500/15 text-blue-300')}
            title="Preview"
          >
            <Eye className="w-4 h-4" />
          </button>
        </div>
      </div>

      {preview ? (
        <div className="min-h-[420px] p-4">
          {value.trim() ? renderPreview(value) : <p className="text-sm text-slate-600">No preview content.</p>}
        </div>
      ) : (
        <textarea
          value={value}
          disabled={disabled}
          onChange={(event) => onChange(event.target.value)}
          placeholder="Write the intelligence report in markdown..."
          className="min-h-[420px] w-full resize-y bg-slate-950/50 p-4 font-mono text-sm leading-7 text-slate-200 outline-none
                     placeholder:text-slate-600 disabled:opacity-60"
        />
      )}
    </div>
  )
}
