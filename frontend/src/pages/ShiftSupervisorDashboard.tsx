import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { listKpis, KPIRecord } from '../api/apiClient'

export default function ShiftSupervisorDashboard() {
  const [shift, setShift] = useState('A')
  const [rows, setRows] = useState<KPIRecord[]>([])
  const [busy, setBusy] = useState(false)

  async function load() {
    setBusy(true)
    try {
      const r = await listKpis({ shift })
      setRows(r.data)
    } finally { setBusy(false) }
  }
  useEffect(() => { load() }, [])

  // anomaly-like row flags
  const flagged = rows.filter(
    (r) =>
      (r.scrap_percent && r.scrap_percent > 3) ||
      (r.oee && r.oee < 85) ||
      (r.downtime_minutes && r.downtime_minutes > 60)
  )

  return (
    <div className="container">
      <h1>Shift Supervisor — Shift {shift}</h1>
      <p className="muted">Shift-level KPIs with anomaly drilldown and chatbot support.</p>

      <div className="card mt-12">
        <div className="flex gap-12 items-center">
          <div className="kpi-label">Select shift</div>
          <select value={shift} onChange={(e) => setShift(e.target.value)} style={{ width: 120 }}>
            <option value="A">A</option>
            <option value="B">B</option>
            <option value="C">C</option>
          </select>
          <button onClick={load} disabled={busy}>{busy ? '...' : 'Refresh'}</button>
          <Link to="/app/chat"><button className="ghost">Open Chat</button></Link>
        </div>
      </div>

      <div className="grid grid-3 mt-24">
        <div className="feature"><h3>Rows in scope</h3><div className="kpi-value">{rows.length}</div></div>
        <div className="feature"><h3>Anomaly-flagged rows</h3><div className="kpi-value" style={{ color: flagged.length > 0 ? 'var(--danger)' : 'var(--accent)' }}>{flagged.length}</div></div>
        <div className="feature">
          <h3>Health</h3>
          <div className="kpi-value" style={{ color: flagged.length === 0 ? 'var(--accent)' : 'var(--warn)' }}>
            {flagged.length === 0 ? 'OK' : `${flagged.length} issues`}
          </div>
        </div>
      </div>

      <div className="card mt-24">
        <h3>Flagged Rows</h3>
        <div className="scroll-x">
          <table>
            <thead>
              <tr><th>Date</th><th>Plant</th><th>Line</th><th>Scrap%</th><th>OEE</th><th>Downtime</th><th>Reason</th></tr>
            </thead>
            <tbody>
              {flagged.map((r) => (
                <tr key={r.id}>
                  <td>{r.metric_date}</td><td>{r.plant}</td><td>{r.line}</td>
                  <td>{r.scrap_percent}</td><td>{r.oee}</td><td>{r.downtime_minutes}</td>
                  <td>{r.downtime_reason || '—'}</td>
                </tr>
              ))}
              {flagged.length === 0 && <tr><td colSpan={7} className="muted">No flagged rows.</td></tr>}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
