import { useNavigate } from 'react-router-dom'
import { useAuth, PERSONA_LABELS } from '../context/AuthContext'

export default function Navbar() {
  const { persona, username, logout } = useAuth()
  const nav = useNavigate()

  return (
    <header className="header">
      <div className="flex items-center gap-12">
        <div className="brand" style={{ fontSize: '20px', display: 'flex', alignItems: 'center', gap: '8px' }}>
          <span style={{ fontSize: '24px' }}>⚙️</span>
          <span style={{ fontWeight: 800, color: 'var(--primary)' }}>MPN</span>
          <span style={{ fontWeight: 400, color: 'var(--text-muted)' }}>Agent</span>
        </div>
      </div>

      <div className="flex items-center gap-24">
        {persona && (
          <div className="flex items-center gap-12">
            <div style={{ textAlign: 'right' }}>
              <div style={{ fontWeight: 600, fontSize: '14px' }}>{username}</div>
              <div style={{ fontSize: '12px', color: 'var(--text-muted)' }}>{PERSONA_LABELS[persona]}</div>
            </div>
            <div style={{
              width: '36px',
              height: '36px',
              borderRadius: '50%',
              background: 'var(--panel-2)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontWeight: 700,
              color: 'var(--primary)',
              border: '1px solid var(--border)'
            }}>
              {username?.charAt(0).toUpperCase()}
            </div>
          </div>
        )}
        <button className="ghost" style={{ padding: '8px 16px' }} onClick={() => { logout(); nav('/') }}>
          Logout
        </button>
      </div>
    </header>
  )
}
