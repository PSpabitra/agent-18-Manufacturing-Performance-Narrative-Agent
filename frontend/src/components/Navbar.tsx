import { NavLink, useNavigate } from 'react-router-dom'
import { useAuth, PERSONA_LABELS, PERSONA_ROUTES } from '../context/AuthContext'

export default function Navbar() {
  const { persona, username, logout } = useAuth()
  const nav = useNavigate()

  const allowed = persona ? PERSONA_ROUTES[persona] : []
  const navItems: { to: string; label: string }[] = []
  if (persona === 'plant_manager') navItems.push({ to: '/app/plant-manager', label: 'Home' })
  if (persona === 'operations_director') navItems.push({ to: '/app/operations-director', label: 'Home' })
  if (persona === 'mfg_excellence_lead') navItems.push({ to: '/app/mfg-excellence', label: 'Home' })
  if (persona === 'cxo') navItems.push({ to: '/app/cxo', label: 'Home' })
  if (persona === 'shift_supervisor') navItems.push({ to: '/app/shift-supervisor', label: 'Home' })

  if (allowed.includes('/app/upload')) navItems.push({ to: '/app/upload', label: 'Upload' })
  if (allowed.includes('/app/dashboard')) navItems.push({ to: '/app/dashboard', label: 'Dashboard' })
  if (allowed.includes('/app/reports/generate')) navItems.push({ to: '/app/reports/generate', label: 'Generate Report' })
  if (allowed.includes('/app/reports/history')) navItems.push({ to: '/app/reports/history', label: 'Reports' })
  if (allowed.includes('/app/chat')) navItems.push({ to: '/app/chat', label: 'Chatbot' })

  return (
    <div className="navbar">
      <div className="brand">⚙️ MPN Agent</div>
      <nav>
        {navItems.map((n) => (
          <NavLink key={n.to} to={n.to} className={({ isActive }) => (isActive ? 'active' : '')}>
            {n.label}
          </NavLink>
        ))}
      </nav>
      <div className="flex items-center gap-12">
        {persona && <span className="muted">{username} · {PERSONA_LABELS[persona]}</span>}
        <button className="ghost" onClick={() => { logout(); nav('/') }}>Logout</button>
      </div>
    </div>
  )
}
