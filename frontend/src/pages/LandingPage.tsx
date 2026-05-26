import { useNavigate } from 'react-router-dom'

export default function LandingPage() {
  const nav = useNavigate()
  return (
    <div className="landing">
      <div className="hero">
        <div className="muted" style={{ letterSpacing: 4, fontSize: 12, marginBottom: 14 }}>
          AI AGENT FOR MANUFACTURING
        </div>
        <h1>Manufacturing Performance Narrative Agent</h1>
        <p>
          Turn raw KPI data into leadership-ready performance narratives in minutes.
          Automatically analyze production, scrap, reliability, COPQ, downtime, OEE, and
          expense — and generate daily, weekly, and monthly reports with grounded insights.
        </p>
        <button className="cta" onClick={() => nav('/login')}>Get Started →</button>
      </div>

      <div className="container">
        <div className="grid grid-3">
          <div className="feature">
            <h3>🚀 Automated Narratives</h3>
            <div className="muted">Daily, weekly, and monthly reports generated automatically with consistent leadership-friendly language.</div>
          </div>
          <div className="feature">
            <h3>📊 KPI Analysis</h3>
            <div className="muted">Variance vs target, vs budget, vs previous period. OEE, scrap, COPQ, downtime, MTBF/MTTR — all covered.</div>
          </div>
          <div className="feature">
            <h3>🔍 Anomaly Detection</h3>
            <div className="muted">Rule-based thresholds plus z-score and IQR statistical detection for outliers.</div>
          </div>
          <div className="feature">
            <h3>📄 DOCX & PDF Output</h3>
            <div className="muted">Downloadable reports with executive summary, KPI scorecard, anomalies, drivers, recommendations.</div>
          </div>
          <div className="feature">
            <h3>💬 Grounded Chatbot</h3>
            <div className="muted">Ask questions and get answers backed by stored KPI data — no hallucinated numbers.</div>
          </div>
          <div className="feature">
            <h3>🛡️ Audit-Ready</h3>
            <div className="muted">Every agent step is logged. Configurable thresholds and source-grounded outputs.</div>
          </div>
        </div>

        <div className="mt-24 muted" style={{ textAlign: 'center', padding: 40 }}>
          Manufacturing Performance Narrative Agent · Powered by FastAPI · MySQL · ChromaDB · Mistral / Ollama
        </div>
      </div>
    </div>
  )
}
