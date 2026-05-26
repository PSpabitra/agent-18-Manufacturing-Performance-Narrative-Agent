import { useState } from 'react'
import { generateReport, ReportDetail } from '../api/apiClient'
import ReportViewer from '../components/ReportViewer'

export default function ReportGeneratePage() {
  const [plant, setPlant] = useState('Plant-1')
  const [periodType, setPeriodType] = useState('weekly')
  const [start, setStart] = useState('2026-05-01')
  const [end, setEnd] = useState('2026-05-07')
  const [busy, setBusy] = useState(false)
  const [err, setErr] = useState<string | null>(null)
  const [report, setReport] = useState<ReportDetail | null>(null)

  async function submit() {
    setBusy(true); setErr(null); setReport(null)
    try {
      const r = await generateReport({ plant, period_type: periodType, period_start: start, period_end: end })
      setReport(r)
    } catch (e: any) {
      setErr(e?.response?.data?.detail || e.message)
    } finally {
      setBusy(false)
    }
  }

  return (
    <div className="container">
      <h1>Generate Performance Report</h1>
      <p className="muted">Pick the plant and period. The agent will run analysis, detect anomalies, generate the narrative with the LLM, and create DOCX + PDF.</p>

      <div className="card">
        <div className="grid grid-4 gap-12">
          <div>
            <div className="kpi-label">Plant</div>
            <input value={plant} onChange={(e) => setPlant(e.target.value)} />
          </div>
          <div>
            <div className="kpi-label">Period Type</div>
            <select value={periodType} onChange={(e) => setPeriodType(e.target.value)}>
              <option value="daily">daily</option>
              <option value="weekly">weekly</option>
              <option value="monthly">monthly</option>
            </select>
          </div>
          <div>
            <div className="kpi-label">Period Start</div>
            <input type="date" value={start} onChange={(e) => setStart(e.target.value)} />
          </div>
          <div>
            <div className="kpi-label">Period End</div>
            <input type="date" value={end} onChange={(e) => setEnd(e.target.value)} />
          </div>
        </div>
        <div className="mt-12">
          <button onClick={submit} disabled={busy}>{busy ? 'Generating (this can take ~30-60s)...' : 'Generate Report'}</button>
        </div>
        {err && <div className="alert error mt-12">{err}</div>}
      </div>

      {report && <div className="mt-24"><ReportViewer report={report} /></div>}
    </div>
  )
}
