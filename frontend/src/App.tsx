import { Routes, Route, Navigate, useLocation } from 'react-router-dom'
import LandingPage from './pages/LandingPage'
import LoginPage from './pages/LoginPage'
import UploadPage from './pages/UploadPage'
import DashboardPage from './pages/DashboardPage'
import ReportGeneratePage from './pages/ReportGeneratePage'
import ReportsHistoryPage from './pages/ReportsHistoryPage'
import ChatbotPage from './pages/ChatbotPage'
import PlantManagerDashboard from './pages/PlantManagerDashboard'
import OperationsDirectorDashboard from './pages/OperationsDirectorDashboard'
import MfgExcellenceDashboard from './pages/MfgExcellenceDashboard'
import CXODashboard from './pages/CXODashboard'
import ShiftSupervisorDashboard from './pages/ShiftSupervisorDashboard'
import ProtectedRoute from './components/ProtectedRoute'
import Navbar from './components/Navbar'
import { useAuth } from './context/AuthContext'

function AppShell({ children }: { children: React.ReactNode }) {
  return (
    <div className="app-shell">
      <Navbar />
      {children}
    </div>
  )
}

function NoAccess() {
  const { persona } = useAuth()
  return (
    <div className="container">
      <h1>Access Denied</h1>
      <p className="muted">Your persona ({persona}) does not have access to this page.</p>
    </div>
  )
}

export default function App() {
  const location = useLocation()
  // Hide navbar on public routes
  const isPublic = location.pathname === '/' || location.pathname === '/login'

  if (isPublic) {
    return (
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    )
  }

  return (
    <AppShell>
      <Routes>
        <Route path="/app/no-access" element={<NoAccess />} />

        <Route path="/app/plant-manager" element={<ProtectedRoute><PlantManagerDashboard /></ProtectedRoute>} />
        <Route path="/app/operations-director" element={<ProtectedRoute><OperationsDirectorDashboard /></ProtectedRoute>} />
        <Route path="/app/mfg-excellence" element={<ProtectedRoute><MfgExcellenceDashboard /></ProtectedRoute>} />
        <Route path="/app/cxo" element={<ProtectedRoute><CXODashboard /></ProtectedRoute>} />
        <Route path="/app/shift-supervisor" element={<ProtectedRoute><ShiftSupervisorDashboard /></ProtectedRoute>} />

        <Route path="/app/upload" element={<ProtectedRoute><UploadPage /></ProtectedRoute>} />
        <Route path="/app/dashboard" element={<ProtectedRoute><DashboardPage /></ProtectedRoute>} />
        <Route path="/app/reports/generate" element={<ProtectedRoute><ReportGeneratePage /></ProtectedRoute>} />
        <Route path="/app/reports/history" element={<ProtectedRoute><ReportsHistoryPage /></ProtectedRoute>} />
        <Route path="/app/chat" element={<ProtectedRoute><ChatbotPage /></ProtectedRoute>} />

        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </AppShell>
  )
}
