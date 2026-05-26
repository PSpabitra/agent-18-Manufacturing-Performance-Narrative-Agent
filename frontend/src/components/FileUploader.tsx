import { useRef, useState } from 'react'
import { uploadFile } from '../api/apiClient'

export default function FileUploader({ onUploaded }: { onUploaded?: (rows: number, filename: string) => void }) {
  const ref = useRef<HTMLInputElement>(null)
  const [busy, setBusy] = useState(false)
  const [msg, setMsg] = useState<{ kind: 'success' | 'error' | 'info'; text: string } | null>(null)

  async function handleSubmit() {
    const f = ref.current?.files?.[0]
    if (!f) { setMsg({ kind: 'error', text: 'Please select a CSV file.' }); return }
    setBusy(true); setMsg({ kind: 'info', text: 'Uploading and parsing...' })
    try {
      const res = await uploadFile(f)
      setMsg({ kind: 'success', text: `Parsed ${res.rows_parsed} rows from ${res.filename}.` })
      onUploaded?.(res.rows_parsed, res.filename)
    } catch (e: any) {
      const detail = e?.response?.data?.detail || e.message
      setMsg({ kind: 'error', text: `Upload failed: ${detail}` })
    } finally {
      setBusy(false)
    }
  }

  return (
    <div className="card">
      <h3>Upload KPI CSV</h3>
      <input ref={ref} type="file" accept=".csv" />
      <div className="mt-12">
        <button onClick={handleSubmit} disabled={busy}>{busy ? 'Uploading...' : 'Upload & Parse'}</button>
      </div>
      {msg && <div className={`alert ${msg.kind} mt-12`}>{msg.text}</div>}
    </div>
  )
}
