import { useEffect, useState } from 'react'
import { listReports, getReport, ReportSummary, ReportDetail, downloadDocxUrl, downloadPdfUrl } from '../api/apiClient'
import ReportViewer from '../components/ReportViewer'

export default function ReportsHistoryPage() {
  const [items, setItems] = useState<ReportSummary[]>([])
  const [selected, setSelected] = useState<ReportDetail | null>(null)
  const [err, setErr] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)

  async function load() {
    setLoading(true); setErr(null)
    try {
      const r = await listReports()
      setItems(r.data)
    } catch (e: any) {
      setErr(e?.response?.data?.detail || e.message)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { load() }, [])

  async function open(id: number) {
    setLoading(true); setErr(null)
    try {
      const r = await getReport(id)
      setSelected(r)
    } catch (e: any) {
      setErr(e?.response?.data?.detail || e.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="container">
      <h1>Reports History</h1>
      {err && <div className="alert error">{err}</div>}

      <div className="card">
        <div className="flex items-center justify-between mb-12">
          <h3>Generated Reports ({items.length})</h3>
          {loading && <div style={{ color: 'var(--primary)', fontWeight: 600 }}>Loading...</div>}
        </div>
        <div className="scroll-x">
          <table>
            <thead>
              <tr>
                <th>ID</th><th>Plant</th><th>Period</th><th>Range</th>
                <th>Executive Summary</th><th>Created</th><th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {items.map((r) => (
                <tr key={r.id}>
                  <td>{r.id}</td>
                  <td>{r.plant}</td>
                  <td>{r.period_type}</td>
                  <td>{r.period_start} → {r.period_end}</td>
                  <td style={{ maxWidth: 360 }}>{(r.executive_summary || '').slice(0, 140)}{(r.executive_summary || '').length > 140 ? '...' : ''}</td>
                  <td>{r.created_at?.slice(0, 16).replace('T', ' ')}</td>
                  <td>
                    <div className="flex gap-12">
                      <button className="ghost" onClick={() => open(r.id)} disabled={loading}>View</button>
                      <a href={downloadDocxUrl(r.id)} target="_blank" rel="noreferrer"><button className="ghost">DOCX</button></a>
                      <a href={downloadPdfUrl(r.id)} target="_blank" rel="noreferrer"><button className="ghost">PDF</button></a>
                    </div>
                  </td>
                </tr>
              ))}
              {items.length === 0 && !loading && (
                <tr><td colSpan={7} className="muted" style={{ textAlign: 'center', padding: '40px' }}>No reports yet. Generate one from the Generate Report page.</td></tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {selected && <div className="mt-24"><ReportViewer report={selected} /></div>}
    </div>
  )
}
