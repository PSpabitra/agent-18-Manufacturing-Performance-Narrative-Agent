import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth, Persona, PERSONA_LABELS, PERSONA_HOME } from '../context/AuthContext'

export default function LoginPage() {
  const { login } = useAuth()
  const nav = useNavigate()
  const [username, setUsername] = useState('plant.manager')
  const [password, setPassword] = useState('Password123')
  const [errorMsg, setErrorMsg] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)

  async function submit(e: React.FormEvent) {
    e.preventDefault()
    setErrorMsg(null)
    setLoading(true)
    try {
      await login(username, password)
      nav('/app/dashboard')
    } catch (err: any) {
      setErrorMsg(err.response?.data?.detail || 'Invalid username or password')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="login-wrap">
      <div className="card" style={{ width: 480, maxWidth: '92vw', padding: '40px' }}>
        <div style={{ textAlign: 'center', marginBottom: '32px' }}>
          <div style={{ fontSize: '32px', marginBottom: '12px' }}>⚙️</div>
          <h2 style={{ margin: 0, fontSize: '24px', fontWeight: 800 }}>Welcome To</h2>
          <p className="muted" style={{ marginTop: '8px' }}>Sign in to Manufacturing Performance Narrative Agent</p>
        </div>

        <form onSubmit={submit}>
          {errorMsg && (
            <div style={{ padding: '12px', marginBottom: '20px', backgroundColor: 'var(--danger)', color: 'white', borderRadius: '8px', fontSize: '14px', textAlign: 'center' }}>
              {errorMsg}
            </div>
          )}

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

          <button
            type="submit"
            style={{ width: '100%', padding: '14px', fontSize: '16px' }}
            disabled={loading}
          >
            {loading ? 'Signing In...' : 'Sign In'}
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
