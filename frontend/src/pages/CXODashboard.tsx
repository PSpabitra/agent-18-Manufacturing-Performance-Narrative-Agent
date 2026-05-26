import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { listReports, ReportSummary, downloadPdfUrl } from '../api/apiClient'

export default function CXODashboard() {
  const [items, setItems] = useState<ReportSummary[]>([])
  useEffect(() => { listReports().then((r) => setItems(r.data)).catch(() => {}) }, [])
  const monthly = items.filter((r) => r.period_type === 'monthly')

  return (
    <div className="container">
      <h1>Executive Dashboard</h1>
      <p className="muted">Top-line manufacturing performance summaries for leadership review.</p>

      <div className="grid grid-3 mt-24">
        <div className="feature">
          <h3>📊 Total Reports</h3>
          <div className="kpi-value">{items.length}</div>
        </div>
        <div className="feature">
          <h3>📅 Monthly Reports</h3>
          <div className="kpi-value">{monthly.length}</div>
        </div>
        <Link to="/app/chat" className="feature">
          <h3>💬 Executive Q&A</h3>
          <div className="muted">Ask high-level performance questions.</div>
        </Link>
      </div>

      <div className="card mt-24">
        <h3>Latest Executive Summaries</h3>
        <table>
          <thead><tr><th>Plant</th><th>Period</th><th>Range</th><th>Summary</th><th>PDF</th></tr></thead>
          <tbody>
            {items.slice(0, 8).map((r) => (
              <tr key={r.id}>
                <td>{r.plant}</td>
                <td>{r.period_type}</td>
                <td>{r.period_start} → {r.period_end}</td>
                <td style={{ maxWidth: 460 }}>{(r.executive_summary || '').slice(0, 200)}{(r.executive_summary || '').length > 200 ? '...' : ''}</td>
                <td><a href={downloadPdfUrl(r.id)} target="_blank" rel="noreferrer">Open</a></td>
              </tr>
            ))}
            {items.length === 0 && <tr><td colSpan={5} className="muted">No reports yet.</td></tr>}
          </tbody>
        </table>
      </div>
    </div>
  )
}
