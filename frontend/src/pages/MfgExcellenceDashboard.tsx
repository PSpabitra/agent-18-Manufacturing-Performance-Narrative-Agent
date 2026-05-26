import { Link } from 'react-router-dom'

export default function MfgExcellenceDashboard() {
  return (
    <div className="container">
      <h1>Manufacturing Excellence Lead</h1>
      <p className="muted">Threshold configuration, anomaly review, and governance. Configure thresholds via the backend <code>.env</code> file: SCRAP_THRESHOLD_PCT, OEE_TARGET, DOWNTIME_HIGH_MIN, EXPENSE_VARIANCE_PCT, PRODUCTION_VARIANCE_PCT.</p>
      <div className="grid grid-3 mt-24">
        <Link to="/app/upload" className="feature">
          <h3>📤 Data Quality</h3>
          <div className="muted">Upload and validate new KPI batches.</div>
        </Link>
        <Link to="/app/dashboard" className="feature">
          <h3>🔍 KPI Inspector</h3>
          <div className="muted">Drill into KPI rows by plant, line, shift.</div>
        </Link>
        <Link to="/app/reports/generate" className="feature">
          <h3>📝 Run Narrative Agent</h3>
          <div className="muted">Generate and review reports.</div>
        </Link>
        <Link to="/app/reports/history" className="feature">
          <h3>🗂️ Governance View</h3>
          <div className="muted">Audit history of generated reports.</div>
        </Link>
        <Link to="/app/chat" className="feature">
          <h3>💬 Diagnostic Q&A</h3>
          <div className="muted">Ask "why" questions about anomalies.</div>
        </Link>
      </div>

      <div className="card mt-24">
        <h3>Current Thresholds (from server config)</h3>
        <div className="muted">Edit backend <code>.env</code> and restart the API to change these.</div>
        <table className="mt-12">
          <thead><tr><th>Threshold</th><th>Purpose</th></tr></thead>
          <tbody>
            <tr><td>SCRAP_THRESHOLD_PCT</td><td>Anomaly if scrap_percent &gt; value</td></tr>
            <tr><td>OEE_TARGET</td><td>Anomaly if OEE &lt; value</td></tr>
            <tr><td>DOWNTIME_HIGH_MIN</td><td>Anomaly if downtime_minutes &gt; value</td></tr>
            <tr><td>EXPENSE_VARIANCE_PCT</td><td>Anomaly if expense variance &gt; value</td></tr>
            <tr><td>PRODUCTION_VARIANCE_PCT</td><td>Anomaly if production variance &lt; value</td></tr>
          </tbody>
        </table>
      </div>
    </div>
  )
}
