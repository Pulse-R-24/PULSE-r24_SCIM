import type { ReactNode } from 'react'

function renderInline(text: string) {
  return text
    .replace(/\*\*([^*]+)\*\*/g, '$1')
    .replace(/\*([^*]+)\*/g, '$1')
    .replace(/`([^`]+)`/g, '$1')
    .replace(/\[([^\]]+)\]\([^)]+\)/g, '$1')
}

export function PublicMarkdownRenderer({ markdown }: { markdown: string }) {
  const lines = markdown.split(/\r?\n/)
  const elements: ReactNode[] = []
  let listItems: string[] = []

  function flushList() {
    if (listItems.length === 0) return
    elements.push(
      <ul key={`list-${elements.length}`} className="my-6 list-disc space-y-2 pl-6 text-slate-700">
        {listItems.map((item, index) => <li key={index}>{renderInline(item)}</li>)}
      </ul>
    )
    listItems = []
  }

  lines.forEach((line, index) => {
    const trimmed = line.trim()
    if (!trimmed) {
      flushList()
      return
    }

    if (trimmed.startsWith('- ') || trimmed.startsWith('* ')) {
      listItems.push(trimmed.slice(2))
      return
    }

    flushList()

    if (trimmed.startsWith('### ')) {
      elements.push(<h3 key={index} className="mb-3 mt-8 text-xl font-black text-slate-950">{renderInline(trimmed.slice(4))}</h3>)
      return
    }
    if (trimmed.startsWith('## ')) {
      elements.push(<h2 key={index} className="mb-4 mt-10 text-2xl font-black text-slate-950">{renderInline(trimmed.slice(3))}</h2>)
      return
    }
    if (trimmed.startsWith('# ')) {
      elements.push(<h2 key={index} className="mb-4 mt-10 text-3xl font-black text-slate-950">{renderInline(trimmed.slice(2))}</h2>)
      return
    }
    if (trimmed.startsWith('> ')) {
      elements.push(
        <blockquote key={index} className="my-6 border-l-4 border-rose-700 bg-rose-50 px-5 py-4 text-slate-700">
          {renderInline(trimmed.slice(2))}
        </blockquote>
      )
      return
    }

    elements.push(<p key={index} className="my-5 text-base leading-8 text-slate-700">{renderInline(trimmed)}</p>)
  })

  flushList()

  return <div className="public-article">{elements}</div>
}
