import { ReportDetail, downloadDocxUrl, downloadPdfUrl } from '../api/apiClient'

export default function ReportViewer({ report }: { report: ReportDetail }) {
  return (
    <div className="grid gap-16">
      <div className="card">
        <div className="flex between items-center">
          <div>
            <h2>Report #{report.report_id} — {report.plant}</h2>
            <div className="muted">{report.period_type} · {report.period_start} → {report.period_end}</div>
          </div>
          <div className="flex gap-12">
            <a href={downloadDocxUrl(report.report_id)} target="_blank" rel="noreferrer"><button className="ghost">Download DOCX</button></a>
            <a href={downloadPdfUrl(report.report_id)} target="_blank" rel="noreferrer"><button>Download PDF</button></a>
          </div>
        </div>
      </div>

      <div className="card">
        <h3>Executive Summary</h3>
        <p>{report.executive_summary || '—'}</p>
      </div>

      {report.kpi_scorecard && (
        <div className="card">
          <h3>KPI Scorecard</h3>
          <div className="scroll-x">
            <table>
              <thead><tr><th>KPI</th><th>Value</th></tr></thead>
              <tbody>
                {Object.entries(report.kpi_scorecard).map(([k, v]) => (
                  <tr key={k}><td>{k.replace(/_/g, ' ')}</td><td>{v ?? '—'}</td></tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {report.anomalies && report.anomalies.length > 0 && (
        <div className="card">
          <h3>Anomalies ({report.anomalies.length})</h3>
          <div className="scroll-x">
            <table>
              <thead>
                <tr><th>Type</th><th>Line</th><th>Date</th><th>Severity</th><th>Message</th></tr>
              </thead>
              <tbody>
                {report.anomalies.slice(0, 25).map((a, i) => (
                  <tr key={i}>
                    <td>{a.type}</td>
                    <td>{a.line || '—'}</td>
                    <td>{a.date || '—'}</td>
                    <td><span className={`badge ${a.severity || 'low'}`}>{a.severity || 'low'}</span></td>
                    <td>{a.message}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {report.drivers && report.drivers.length > 0 && (
        <div className="card">
          <h3>Key Drivers</h3>
          <ul>
            {report.drivers.map((d: any, i: number) => <li key={i}>{d.note}</li>)}
          </ul>
        </div>
      )}

      {report.recommendations && report.recommendations.length > 0 && (
        <div className="card">
          <h3>Recommendations</h3>
          <ul>
            {report.recommendations.map((r, i) => <li key={i}>{r}</li>)}
          </ul>
        </div>
      )}

      {report.full_narrative && (
        <div className="card">
          <h3>Full Narrative</h3>
          <pre style={{ whiteSpace: 'pre-wrap', fontFamily: 'inherit', margin: 0 }}>{report.full_narrative}</pre>
        </div>
      )}
    </div>
  )
}
