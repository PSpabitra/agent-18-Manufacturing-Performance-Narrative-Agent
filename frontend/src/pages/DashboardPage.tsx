import { useEffect, useMemo, useState } from 'react'
import { listKpis, KPIRecord } from '../api/apiClient'
import KPICard from '../components/KPICard'

export default function DashboardPage() {
  const [plant, setPlant] = useState('')
  const [line, setLine] = useState('')
  const [shift, setShift] = useState('')
  const [periodType, setPeriodType] = useState('')
  const [start, setStart] = useState('')
  const [end, setEnd] = useState('')
  const [rows, setRows] = useState<KPIRecord[]>([])
  const [loading, setLoading] = useState(false)
  const [err, setErr] = useState<string | null>(null)

  async function load() {
    setLoading(true); setErr(null)
    try {
      const r = await listKpis({
        plant: plant || undefined, line: line || undefined, shift: shift || undefined,
        period_type: periodType || undefined,
        start_date: start || undefined, end_date: end || undefined, limit: 1000,
      })
      setRows(r.data)
    } catch (e: any) {
      setErr(e?.response?.data?.detail || e.message)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { load() }, [])

  const agg = useMemo(() => {
    const sum = (k: keyof KPIRecord) => rows.reduce((s, r) => s + (typeof r[k] === 'number' ? (r[k] as number) : 0), 0)
    const avg = (k: keyof KPIRecord) => {
      const vals = rows.map((r) => r[k]).filter((v) => typeof v === 'number') as number[]
      return vals.length ? +(vals.reduce((a, b) => a + b, 0) / vals.length).toFixed(2) : null
    }
    const exp_act = sum('expense_actual'), exp_bud = sum('expense_budget')
    const expVar = exp_bud ? +(((exp_act - exp_bud) / exp_bud) * 100).toFixed(2) : null
    return {
      production: +sum('production_volume').toFixed(0),
      target: +sum('target_volume').toFixed(0),
      scrap_pct: avg('scrap_percent'),
      oee: avg('oee'),
      downtime: +sum('downtime_minutes').toFixed(0),
      copq: +sum('copq').toFixed(0),
      expVar,
    }
  }, [rows])

  return (
    <div className="container">
      <h1>KPI Dashboard</h1>

      <div className="card">
        <div className="grid grid-4 gap-12">
          <div>
            <div className="kpi-label">Plant</div>
            <input value={plant} onChange={(e) => setPlant(e.target.value)} placeholder="e.g. Plant-1" />
          </div>
          <div>
            <div className="kpi-label">Line</div>
            <input value={line} onChange={(e) => setLine(e.target.value)} placeholder="e.g. Line-A" />
          </div>
          <div>
            <div className="kpi-label">Shift</div>
            <input value={shift} onChange={(e) => setShift(e.target.value)} placeholder="A / B / C" />
          </div>
          <div>
            <div className="kpi-label">Period Type</div>
            <select value={periodType} onChange={(e) => setPeriodType(e.target.value)}>
              <option value="">all</option>
              <option value="daily">daily</option>
              <option value="weekly">weekly</option>
              <option value="monthly">monthly</option>
            </select>
          </div>
          <div>
            <div className="kpi-label">Start Date</div>
            <input type="date" value={start} onChange={(e) => setStart(e.target.value)} />
          </div>
          <div>
            <div className="kpi-label">End Date</div>
            <input type="date" value={end} onChange={(e) => setEnd(e.target.value)} />
          </div>
          <div style={{ display: 'flex', alignItems: 'flex-end' }}>
            <button onClick={load} disabled={loading}>{loading ? 'Loading...' : 'Apply'}</button>
          </div>
        </div>
        {err && <div className="alert error mt-12">{err}</div>}
      </div>

      <div className="grid grid-4 mt-24">
        <KPICard label="Production Volume" value={agg.production.toLocaleString()} hint={`Target: ${agg.target.toLocaleString()}`} />
        <KPICard label="Scrap %" value={agg.scrap_pct ?? '—'} tone={agg.scrap_pct && agg.scrap_pct > 3 ? 'bad' : 'good'} />
        <KPICard label="OEE %" value={agg.oee ?? '—'} tone={agg.oee && agg.oee >= 85 ? 'good' : 'bad'} />
        <KPICard label="Downtime (min)" value={agg.downtime.toLocaleString()} />
        <KPICard label="COPQ" value={agg.copq.toLocaleString()} />
        <KPICard label="Expense Variance %" value={agg.expVar ?? '—'} tone={agg.expVar && agg.expVar > 5 ? 'bad' : 'good'} />
        <KPICard label="Rows" value={rows.length} />
      </div>

      <div className="card mt-24">
        <h3>KPI Rows ({rows.length})</h3>
        <div className="scroll-x">
          <table>
            <thead>
              <tr>
                <th>Date</th><th>Plant</th><th>Line</th><th>Shift</th>
                <th>Prod</th><th>Target</th><th>Scrap %</th><th>OEE</th>
                <th>Downtime</th><th>COPQ</th><th>Exp Act</th><th>Exp Bud</th>
              </tr>
            </thead>
            <tbody>
              {rows.slice(0, 200).map((r) => (
                <tr key={r.id}>
                  <td>{r.metric_date}</td><td>{r.plant}</td><td>{r.line}</td><td>{r.shift}</td>
                  <td>{r.production_volume}</td><td>{r.target_volume}</td>
                  <td>{r.scrap_percent}</td><td>{r.oee}</td>
                  <td>{r.downtime_minutes}</td><td>{r.copq}</td>
                  <td>{r.expense_actual}</td><td>{r.expense_budget}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
