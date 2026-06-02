import { UploadCloud } from 'lucide-react'
import { useRef, useState } from 'react'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { Button } from '@/components/ui/Button'

interface EvidenceUploadDropzoneProps {
  reportId: string
  disabled?: boolean
}

async function uploadFileEvidence(reportId: string, file: File) {
  const safeName = file.name.replace(/[^a-zA-Z0-9._-]/g, '-')
  const path = `evidence/${reportId}/${Date.now()}-${safeName}`
  const bucket = 'evidence'

  const signed = await fetch('/api/uploads', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ bucket, path, mimeType: file.type || 'application/octet-stream', expiresIn: 300 }),
  })
  if (!signed.ok) {
    const err = await signed.json().catch(() => ({}))
    throw new Error(err.error || 'Failed to create upload URL')
  }

  const uploadData = await signed.json()
  if (!uploadData.signedUrl) {
    throw new Error('Upload API did not return a signed URL')
  }

  const uploaded = await fetch(uploadData.signedUrl, {
    method: 'PUT',
    headers: { 'Content-Type': file.type || 'application/octet-stream' },
    body: file,
  })
  if (!uploaded.ok) {
    throw new Error('Signed upload failed')
  }

  const registered = await fetch('/api/uploads', {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ bucket, path, mimeType: file.type || 'application/octet-stream', size: file.size }),
  })
  if (!registered.ok) {
    const err = await registered.json().catch(() => ({}))
    throw new Error(err.error || 'Failed to register upload')
  }
  const media = await registered.json()

  const attached = await fetch(`/api/reports/${reportId}/evidence`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ title: file.name, mediaId: media.id, description: `Uploaded file: ${file.name}` }),
  })
  if (!attached.ok) {
    const err = await attached.json().catch(() => ({}))
    throw new Error(err.error || 'Failed to attach uploaded evidence')
  }
  return attached.json()
}

export function EvidenceUploadDropzone({ reportId, disabled }: EvidenceUploadDropzoneProps) {
  const inputRef = useRef<HTMLInputElement>(null)
  const [error, setError] = useState<string>()
  const queryClient = useQueryClient()

  const mutation = useMutation({
    mutationFn: (file: File) => uploadFileEvidence(reportId, file),
    onSuccess: () => {
      setError(undefined)
      queryClient.invalidateQueries({ queryKey: ['report-evidence', reportId] })
      queryClient.invalidateQueries({ queryKey: ['evidence-library'] })
    },
    onError: (err: Error) => setError(err.message),
  })

  return (
    <div className="rounded-lg border border-dashed border-slate-700/80 bg-slate-950/40 p-4 text-center">
      <UploadCloud className="mx-auto h-7 w-7 text-slate-600" />
      <p className="mt-2 text-sm font-semibold text-slate-300">Upload file evidence</p>
      <p className="mt-1 text-xs text-slate-600">Uses the existing signed upload and media registration pipeline.</p>
      <input suppressHydrationWarning
        ref={inputRef}
        type="file"
        className="hidden"
        disabled={disabled}
        onChange={(event) => {
          const file = event.target.files?.[0]
          if (file) mutation.mutate(file)
          event.currentTarget.value = ''
        }}
      />
      <Button size="sm" className="mt-3" disabled={disabled} loading={mutation.isPending} onClick={() => inputRef.current?.click()}>
        Select File
      </Button>
      {error && <p className="mt-3 text-xs text-red-400">{error}</p>}
    </div>
  )
}
