import { NavLink } from 'react-router-dom'
import { useAuth, PERSONA_HOME } from '../context/AuthContext'

export default function Sidebar() {
  const { persona } = useAuth()

  const navItems = [
    // { to: persona ? PERSONA_HOME[persona] : '/app/dashboard', label: 'Home', icon: '�' },
    { to: '/app/dashboard', label: 'Dashboard', icon: '⚡' },
    { to: '/app/upload', label: 'Upload', icon: '📤' },
    { to: '/app/reports/generate', label: 'Generate Report', icon: '📝' },
    { to: '/app/reports/history', label: 'Reports', icon: '📚' },
    { to: '/app/chat', label: 'Chatbot', icon: '🤖' },
  ]

  return (
    <aside className="sidebar">
      <div className="flex-column gap-8">
        {navItems.map((n) => (
          <NavLink
            key={n.to}
            to={n.to}
            className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}
          >
            <span style={{ fontSize: '18px' }}>{n.icon}</span>
            <span>{n.label}</span>
          </NavLink>
        ))}
      </div>

      <div style={{ marginTop: 'auto', padding: '12px', borderTop: '1px solid var(--border)', fontSize: '12px', color: 'var(--text-muted)' }}>
        Persona: <span style={{ fontWeight: 600 }}>{persona?.replace('_', ' ')}</span>
      </div>
    </aside>
  )
}
