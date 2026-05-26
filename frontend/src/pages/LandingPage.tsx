import { useNavigate } from 'react-router-dom'

export default function LandingPage() {
  const nav = useNavigate()
  return (
    <div className="landing">
      {/* Navigation Bar */}
      <header className="container" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '20px 24px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <span style={{ fontSize: '24px' }}>⚙️</span>
          <span style={{ fontWeight: 800, color: 'var(--primary)', fontSize: '20px' }}>MPN</span>
          <span style={{ fontWeight: 400, color: 'var(--text-muted)', fontSize: '20px' }}>Agent</span>
        </div>
        <button className="ghost" onClick={() => nav('/login')}>Sign In</button>
      </header>

      {/* Hero Section */}
      <div className="hero">
        <div className="muted" style={{ letterSpacing: 4, fontSize: 12, marginBottom: 14 }}>
          AI-POWERED MANUFACTURING ANALYTICS
        </div>
        <h1>Bridge the Gap Between Raw KPI Data and Executive Decison-Making</h1>
        <p>
          Manufacturing Performance Narrative Agent (MPNA) transforms complex sensor and production data
          into clear, actionable narratives. Empower your leadership with AI-driven insights that grounded
          in your actual shop-floor reality.
        </p>
        <div style={{ display: 'flex', gap: '16px', justifyContent: 'center' }}>
          <button className="cta" onClick={() => nav('/login')}>Get Started for Free</button>
          <button className="ghost" onClick={() => nav('/login')} style={{ border: 'none', fontWeight: 700 }}>Watch Demo Video</button>
        </div>
      </div>

      <div className="container">
        {/* Core Features */}
        <div style={{ textAlign: 'center', marginBottom: '48px' }}>
          <h2 style={{ fontSize: '32px' }}>Everything you need to manage plant performance</h2>
        </div>

        <div className="grid grid-3">
          <div className="feature">
            <div style={{ fontSize: '32px', marginBottom: '16px' }}>🚀</div>
            <h3>Automated Narratives</h3>
            <div className="muted" style={{ lineHeight: '1.6' }}>
              Say goodbye to manual report writing. Our agent synthesizes complex KPI variances into
              executive summaries that sound like they were written by your best plant manager.
            </div>
          </div>
          <div className="feature">
            <div style={{ fontSize: '32px', marginBottom: '16px' }}>📊</div>
            <h3>Deep KPI Analysis</h3>
            <div className="muted" style={{ lineHeight: '1.6' }}>
              Automated variance analysis across Production, Scrap, OEE, Downtime, and COPQ.
              Understand exactly *why* your numbers are trending the way they are.
            </div>
          </div>
          <div className="feature">
            <div style={{ fontSize: '32px', marginBottom: '16px' }}>🔍</div>
            <h3>Anomaly Detection</h3>
            <div className="muted" style={{ lineHeight: '1.6' }}>
              Advanced statistical modeling detects outliers before they become systemic problems.
              Integrated Z-Score and IQR detection provide early warning signals.
            </div>
          </div>
          <div className="feature">
            <div style={{ fontSize: '32px', marginBottom: '16px' }}>💬</div>
            <h3>Grounded Chatbot</h3>
            <div className="muted" style={{ lineHeight: '1.6' }}>
              Ask questions naturally. "Why did Line B scrap increase yesterday?"
              The agent queries your stored data to provide answers you can trust.
            </div>
          </div>
          <div className="feature">
            <div style={{ fontSize: '32px', marginBottom: '16px' }}>📄</div>
            <h3>Multi-Format Export</h3>
            <div className="muted" style={{ lineHeight: '1.6' }}>
              Download professional DOCX and PDF reports ready for board meetings.
              Beautiful charts, scorecard tables, and structured text included.
            </div>
          </div>
          <div className="feature">
            <div style={{ fontSize: '32px', marginBottom: '16px' }}>🛡️</div>
            <h3>Enterprise Security</h3>
            <div className="muted" style={{ lineHeight: '1.6' }}>
              Role-based access control (RBAC) ensures your sensitive data is only seen by the
              right people, from shift supervisors to CXOs.
            </div>
          </div>
        </div>

        {/* How it Works */}
        <div style={{ marginTop: '96px', textAlign: 'center' }}>
          <h2 style={{ fontSize: '36px', marginBottom: '48px' }}>Three Steps to Better Reports</h2>
          <div className="grid grid-3 gap-24">
            <div style={{ padding: '24px' }}>
              <div style={{ width: '48px', height: '48px', borderRadius: '50%', background: 'var(--primary)', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 24px', fontWeight: 800 }}>1</div>
              <h3>Upload & Connect</h3>
              <p className="muted">Upload your KPI CSVs or connect directly to your shopfloor database. Our system cleans and organizes the data automatically.</p>
            </div>
            <div style={{ padding: '24px' }}>
              <div style={{ width: '48px', height: '48px', borderRadius: '50%', background: 'var(--primary)', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 24px', fontWeight: 800 }}>2</div>
              <h3>Agent Analysis</h3>
              <p className="muted">The MPN Agent analyzes variances, identifies anomalies, and cross-references data to find root causes and trends.</p>
            </div>
            <div style={{ padding: '24px' }}>
              <div style={{ width: '48px', height: '48px', borderRadius: '50%', background: 'var(--primary)', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 24px', fontWeight: 800 }}>3</div>
              <h3>Generate & Iterate</h3>
              <p className="muted">Get a perfect draft in seconds. Use the AI Chatbot to drill deeper or download the final report in your preferred format.</p>
            </div>
          </div>
        </div>

        {/* Trust Section */}
        <div style={{ marginTop: '96px', padding: '64px', background: 'var(--panel)', borderRadius: '24px', border: '1px solid var(--border)', textAlign: 'center' }}>
          <h2 style={{ marginBottom: '24px' }}>Ready to optimize your performance narratives?</h2>
          <p className="muted" style={{ maxWidth: '600px', margin: '0 auto 32px', fontSize: '18px' }}>
            Join forward-thinking manufacturing leaders who are using AI to save 10+ hours a week on reporting.
          </p>
          <button className="cta" style={{ padding: '16px 40px', fontSize: '18px' }} onClick={() => nav('/login')}>
            Start Your Journey
          </button>
        </div>

        {/* Footer */}
        <div className="mt-24 muted" style={{ textAlign: 'center', padding: '60px 0', borderTop: '1px solid var(--border)', marginTop: '96px' }}>
          <div style={{ display: 'flex', justifyContent: 'center', gap: '24px', marginBottom: '24px' }}>
            <a href="#" className="muted">Product</a>
            <a href="#" className="muted">Features</a>
            <a href="#" className="muted">Pricing</a>
            <a href="#" className="muted">Privacy</a>
            <a href="#" className="muted">Terms</a>
          </div>
          <div style={{ marginBottom: '12px' }}>
            ⚙️ Manufacturing Performance Narrative Agent
          </div>
          <div>
            Powered by FastAPI · MySQL · ChromaDB · Mistral AI
          </div>
        </div>
      </div>
    </div>
  )
}
