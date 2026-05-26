import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth, Persona, PERSONA_LABELS, PERSONA_HOME } from '../context/AuthContext'

export default function LoginPage() {
  const { login } = useAuth()
  const nav = useNavigate()
  const [persona, setPersona] = useState<Persona | null>(null)
  const [username, setUsername] = useState('demo.executive')
  const [password, setPassword] = useState('••••••••')

  function submit(e: React.FormEvent) {
    e.preventDefault()
    if (!persona) return
    login(persona, username || 'demo.executive')
    nav('/app/dashboard')
  }

  const personas: Persona[] = ['plant_manager', 'operations_director', 'mfg_excellence_lead', 'cxo', 'shift_supervisor']

  return (
    <div className="login-wrap">
      <div className="card" style={{ width: 480, maxWidth: '92vw', padding: '40px' }}>
        <div style={{ textAlign: 'center', marginBottom: '32px' }}>
          <div style={{ fontSize: '32px', marginBottom: '12px' }}>⚙️</div>
          <h2 style={{ margin: 0, fontSize: '24px', fontWeight: 800 }}>Welcome Back</h2>
          <p className="muted" style={{ marginTop: '8px' }}>Sign in to Manufacturing Performance Narrative Agent</p>
        </div>

        <form onSubmit={submit}>
          <div style={{ marginBottom: '20px' }}>
            <label className="kpi-label" style={{ marginBottom: '8px', display: 'block' }}>Username</label>
            <input
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="e.g. john.doe"
              required
            />
          </div>

          <div style={{ marginBottom: '24px' }}>
            <label className="kpi-label" style={{ marginBottom: '8px', display: 'block' }}>Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Your password"
              required
            />
          </div>

          <div style={{ marginBottom: '24px' }}>
            <label className="kpi-label" style={{ marginBottom: '12px', display: 'block' }}>Select Role (Persona)</label>
            <div className="persona-grid">
              {personas.map((p) => (
                <div
                  key={p}
                  className={`persona-card ${persona === p ? 'selected' : ''}`}
                  onClick={() => setPersona(p)}
                  style={{ padding: '12px', textAlign: 'center' }}
                >
                  <div style={{ fontWeight: 600, fontSize: '13px' }}>{PERSONA_LABELS[p]}</div>
                </div>
              ))}
            </div>
          </div>

          <button
            type="submit"
            style={{ width: '100%', padding: '14px', fontSize: '16px' }}
            disabled={!persona}
          >
            Sign In
          </button>
        </form>

        <div style={{ marginTop: '24px', textAlign: 'center', fontSize: '13px' }}>
          <span className="muted">Don't have an account? </span>
          <a href="#" onClick={(e) => e.preventDefault()} style={{ fontWeight: 600 }}>Contact Administrator</a>
        </div>
      </div>
    </div>
  )
}
