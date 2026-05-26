import { createContext, useContext, useState, ReactNode, useEffect } from 'react'

export type Persona =
  | 'plant_manager'
  | 'operations_director'
  | 'mfg_excellence_lead'
  | 'cxo'
  | 'shift_supervisor'

export const PERSONA_LABELS: Record<Persona, string> = {
  plant_manager: 'Plant Manager',
  operations_director: 'Operations Director',
  mfg_excellence_lead: 'Manufacturing Excellence Lead',
  cxo: 'CXO / Leadership',
  shift_supervisor: 'Shift Supervisor',
}

export const PERSONA_ROUTES: Record<Persona, string[]> = {
  plant_manager: ['/app/plant-manager', '/app/upload', '/app/dashboard', '/app/reports', '/app/reports/generate', '/app/reports/history', '/app/chat'],
  operations_director: ['/app/operations-director', '/app/dashboard', '/app/reports', '/app/reports/generate', '/app/reports/history', '/app/chat'],
  mfg_excellence_lead: ['/app/mfg-excellence', '/app/upload', '/app/dashboard', '/app/reports', '/app/reports/generate', '/app/reports/history', '/app/chat'],
  cxo: ['/app/cxo', '/app/reports', '/app/reports/history', '/app/chat'],
  shift_supervisor: ['/app/shift-supervisor', '/app/dashboard', '/app/chat'],
}

export const PERSONA_HOME: Record<Persona, string> = {
  plant_manager: '/app/plant-manager',
  operations_director: '/app/operations-director',
  mfg_excellence_lead: '/app/mfg-excellence',
  cxo: '/app/cxo',
  shift_supervisor: '/app/shift-supervisor',
}

interface AuthState {
  persona: Persona | null
  username: string | null
  login: (persona: Persona, username: string) => void
  logout: () => void
  canAccess: (path: string) => boolean
}

const AuthContext = createContext<AuthState | null>(null)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [persona, setPersona] = useState<Persona | null>(null)
  const [username, setUsername] = useState<string | null>(null)

  useEffect(() => {
    const p = localStorage.getItem('persona') as Persona | null
    const u = localStorage.getItem('username')
    if (p) setPersona(p)
    if (u) setUsername(u)
  }, [])

  const login = (p: Persona, u: string) => {
    localStorage.setItem('persona', p)
    localStorage.setItem('username', u)
    setPersona(p)
    setUsername(u)
  }
  const logout = () => {
    localStorage.removeItem('persona')
    localStorage.removeItem('username')
    setPersona(null)
    setUsername(null)
  }
  const canAccess = (path: string) => {
    if (!persona) return false
    return PERSONA_ROUTES[persona].some((p) => path === p || path.startsWith(p + '/'))
  }

  return (
    <AuthContext.Provider value={{ persona, username, login, logout, canAccess }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth(): AuthState {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth must be used inside AuthProvider')
  return ctx
}
