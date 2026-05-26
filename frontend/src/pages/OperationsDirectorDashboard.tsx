import { Link } from 'react-router-dom'

export default function OperationsDirectorDashboard() {
  return (
    <div className="container">
      <h1>Operations Director</h1>
      <p className="muted">Multi-plant rollup view. Compare plants and generate monthly leadership reports.</p>
      <div className="grid grid-3 mt-24">
        <Link to="/app/dashboard" className="feature">
          <h3>🏭 Multi-Plant Dashboard</h3>
          <div className="muted">Filter across plants and lines.</div>
        </Link>
        <Link to="/app/reports/generate" className="feature">
          <h3>📅 Monthly Reports</h3>
          <div className="muted">Generate monthly narratives for any plant.</div>
        </Link>
        <Link to="/app/reports/history" className="feature">
          <h3>🗂️ Reports History</h3>
          <div className="muted">All historical narratives across plants.</div>
        </Link>
        <Link to="/app/chat" className="feature">
          <h3>💬 Cross-Plant Q&A</h3>
          <div className="muted">Compare plants via the agent.</div>
        </Link>
      </div>
    </div>
  )
}
