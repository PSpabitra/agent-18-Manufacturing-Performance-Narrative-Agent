import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth, Persona, PERSONA_LABELS, PERSONA_HOME } from '../context/AuthContext'

export default function LoginPage() {
  const { login } = useAuth()
  const nav = useNavigate()
  const [persona, setPersona] = useState<Persona | null>(null)
  const [username, setUsername] = useState('demo.user')

  function submit() {
    if (!persona) return
    login(persona, username || 'demo.user')
    nav(PERSONA_HOME[persona])
  }

  const personas: Persona[] = ['plant_manager', 'operations_director', 'mfg_excellence_lead', 'cxo', 'shift_supervisor']

  return (
    <div className="login-wrap">
      <div className="card" style={{ width: 460, maxWidth: '92vw' }}>
        <h2>Sign in</h2>
        <p className="muted">Select your role to access the dashboards you have permission for.</p>

        <div style={{ marginTop: 14 }}>
          <label className="kpi-label">Username</label>
          <input value={username} onChange={(e) => setUsername(e.target.value)} placeholder="your.name" />
        </div>

        <div style={{ marginTop: 18 }}>
          <label className="kpi-label">Choose Persona</label>
          <div className="persona-grid mt-12">
            {personas.map((p) => (
              <div
                key={p}
                className={`persona-card ${persona === p ? 'selected' : ''}`}
                onClick={() => setPersona(p)}
              >
                <div style={{ fontWeight: 600 }}>{PERSONA_LABELS[p]}</div>
                <div className="muted" style={{ fontSize: 12, marginTop: 4 }}>
                  {p === 'plant_manager' && 'Daily/weekly plant performance + reports'}
                  {p === 'operations_director' && 'Multi-plant rollup + monthly reports'}
                  {p === 'mfg_excellence_lead' && 'KPI thresholds, anomalies & governance'}
                  {p === 'cxo' && 'Executive summary + leadership reports'}
                  {p === 'shift_supervisor' && 'Shift KPIs + anomaly drilldown + chat'}
                </div>
              </div>
            ))}
          </div>
        </div>

        <div style={{ marginTop: 18 }}>
          <button onClick={submit} disabled={!persona}>Sign in</button>
        </div>
      </div>
    </div>
  )
}
