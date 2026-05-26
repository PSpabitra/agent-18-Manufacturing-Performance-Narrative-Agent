import { useEffect, useMemo, useState } from 'react'
import { listKpis, KPIRecord } from '../api/apiClient'
import KPICard from '../components/KPICard'
import { Filter, Search, RotateCcw, ChevronLeft, ChevronRight } from 'lucide-react'

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

  // Pagination state
  const [currentPage, setCurrentPage] = useState(1)
  const pageSize = 10

  async function load() {
    setLoading(true); setErr(null); setCurrentPage(1)
    try {
      const r = await listKpis({
        plant: plant || undefined, line: line || undefined, shift: shift || undefined,
        period_type: periodType || undefined,
        start_date: start || undefined, end_date: end || undefined
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

  // Pagination logic
  const totalPages = Math.ceil(rows.length / pageSize)
  const paginatedRows = useMemo(() => {
    const startIdx = (currentPage - 1) * pageSize
    return rows.slice(startIdx, startIdx + pageSize)
  }, [rows, currentPage])

  return (
    <div className="container">
      <div className="flex items-center justify-between gap-12 mb-24">
        <h1>KPI Dashboard</h1>
        <div className="flex gap-8">
          <button className="ghost" onClick={() => {
            setPlant(''); setLine(''); setShift(''); setPeriodType(''); setStart(''); setEnd('');
            setTimeout(load, 0);
          }} title="Reset Filters">
            <RotateCcw className="w-4 h-4" />
          </button>
          <button onClick={load} disabled={loading} className="flex items-center gap-8">
            <Search className="w-4 h-4" />
            {loading ? 'Loading...' : 'Apply Filters'}
          </button>
        </div>
      </div>

      <div className="card" style={{ padding: '16px 24px' }}>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '16px', alignItems: 'flex-end' }}>
          <div style={{ flex: '1 1 140px' }}>
            <label className="kpi-label flex items-center gap-4" style={{ marginBottom: '6px', fontSize: '11px' }}>
              <Filter className="w-3 h-3" /> Plant
            </label>
            <input value={plant} onChange={(e) => setPlant(e.target.value)} placeholder="All Plants" style={{ height: '36px' }} />
          </div>
          <div style={{ flex: '1 1 120px' }}>
            <label className="kpi-label" style={{ marginBottom: '6px', fontSize: '11px' }}>Line</label>
            <input value={line} onChange={(e) => setLine(e.target.value)} placeholder="All Lines" style={{ height: '36px' }} />
          </div>
          <div style={{ flex: '0 1 100px' }}>
            <label className="kpi-label" style={{ marginBottom: '6px', fontSize: '11px' }}>Shift</label>
            <input value={shift} onChange={(e) => setShift(e.target.value)} placeholder="Any" style={{ height: '36px' }} />
          </div>
          <div style={{ flex: '1 1 120px' }}>
            <label className="kpi-label" style={{ marginBottom: '6px', fontSize: '11px' }}>Period</label>
            <select value={periodType} onChange={(e) => setPeriodType(e.target.value)} style={{ height: '36px' }}>
              <option value="">All Periods</option>
              <option value="daily">Daily</option>
              <option value="weekly">Weekly</option>
              <option value="monthly">Monthly</option>
            </select>
          </div>
          <div style={{ flex: '1 1 150px' }}>
            <label className="kpi-label" style={{ marginBottom: '6px', fontSize: '11px' }}>Start Date</label>
            <input type="date" value={start} onChange={(e) => setStart(e.target.value)} style={{ height: '36px' }} />
          </div>
          <div style={{ flex: '1 1 150px' }}>
            <label className="kpi-label" style={{ marginBottom: '6px', fontSize: '11px' }}>End Date</label>
            <input type="date" value={end} onChange={(e) => setEnd(e.target.value)} style={{ height: '36px' }} />
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
        <h3 className="flex items-center justify-between">
          <span>KPI Rows ({rows.length})</span>
          <span className="muted" style={{ fontSize: '12px' }}>
            Page {currentPage} of {totalPages || 1}
          </span>
        </h3>
        <div className="scroll-x">
          <table style={{ marginBottom: '16px' }}>
            <thead>
              <tr>
                <th>Date</th><th>Plant</th><th>Line</th><th>Shift</th>
                <th>Prod</th><th>Target</th><th>Scrap %</th><th>OEE</th>
                <th>Downtime</th><th>COPQ</th><th>Exp Act</th><th>Exp Bud</th>
              </tr>
            </thead>
            <tbody>
              {paginatedRows.map((r) => (
                <tr key={r.id}>
                  <td>{r.metric_date}</td><td>{r.plant}</td><td>{r.line}</td><td>{r.shift}</td>
                  <td>{r.production_volume}</td><td>{r.target_volume}</td>
                  <td>{r.scrap_percent}</td><td>{r.oee}</td>
                  <td>{r.downtime_minutes}</td><td>{r.copq}</td>
                  <td>{r.expense_actual}</td><td>{r.expense_budget}</td>
                </tr>
              ))}
              {paginatedRows.length === 0 && !loading && (
                <tr>
                  <td colSpan={12} style={{ textAlign: 'center', padding: '40px', color: 'var(--text-muted)' }}>
                    No records found for the selected filters.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {totalPages > 1 && (
          <div className="flex items-center justify-center gap-12 mt-12">
            <button
              className="ghost"
              style={{ padding: '6px 12px' }}
              disabled={currentPage === 1}
              onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
            >
              <ChevronLeft className="w-4 h-4" /> Previous
            </button>
            <div className="flex gap-4">
              {[...Array(totalPages)].map((_, i) => {
                const p = i + 1
                // Show first, last, and pages around current
                if (p === 1 || p === totalPages || (p >= currentPage - 1 && p <= currentPage + 1)) {
                  return (
                    <button
                      key={p}
                      onClick={() => setCurrentPage(p)}
                      style={{
                        padding: '6px 12px',
                        minWidth: '36px',
                        background: currentPage === p ? 'var(--primary)' : 'transparent',
                        color: currentPage === p ? 'white' : 'var(--text)',
                        border: '1px solid var(--border)'
                      }}
                    >
                      {p}
                    </button>
                  )
                }
                if (p === currentPage - 2 || p === currentPage + 2) {
                  return <span key={p} style={{ padding: '6px' }}>...</span>
                }
                return null
              })}
            </div>
            <button
              className="ghost"
              style={{ padding: '6px 12px' }}
              disabled={currentPage === totalPages}
              onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
            >
              Next <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        )}
      </div>
    </div>
  )
}
