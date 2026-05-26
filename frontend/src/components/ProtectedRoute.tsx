import { Navigate, useLocation } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { ReactNode } from 'react'

export default function ProtectedRoute({ children }: { children: ReactNode }) {
  const { persona, canAccess } = useAuth()
  const location = useLocation()
  if (!persona) return <Navigate to="/login" replace state={{ from: location.pathname }} />
  if (!canAccess(location.pathname)) return <Navigate to="/app/no-access" replace />
  return <>{children}</>
}
