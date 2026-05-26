import { Link } from 'react-router-dom'

export default function PlantManagerDashboard() {
  return (
    <div className="container">
      <h1>Plant Manager</h1>
      <p className="muted">Daily and weekly plant performance. Upload KPIs, view dashboards, and generate reports for your plant.</p>
      <div className="grid grid-3 mt-24">
        <Link to="/app/upload" className="feature">
          <h3>📤 Upload KPI File</h3>
          <div className="muted">Bring in today's or this week's KPI CSV.</div>
        </Link>
        <Link to="/app/dashboard" className="feature">
          <h3>📊 Plant Dashboard</h3>
          <div className="muted">Production, scrap, OEE, downtime, COPQ, expense.</div>
        </Link>
        <Link to="/app/reports/generate" className="feature">
          <h3>📝 Generate Report</h3>
          <div className="muted">Run the narrative agent for your plant.</div>
        </Link>
        <Link to="/app/reports/history" className="feature">
          <h3>🗂️ Reports History</h3>
          <div className="muted">Browse and download past reports.</div>
        </Link>
        <Link to="/app/chat" className="feature">
          <h3>💬 Ask the Agent</h3>
          <div className="muted">Get grounded answers about your plant's performance.</div>
        </Link>
      </div>
    </div>
  )
}
