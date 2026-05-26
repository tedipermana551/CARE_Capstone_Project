import React, { useEffect } from 'react'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import LandingPage from './pages/LandingPage'
import LoginPage from './pages/LoginPage'
import RegisterPage from './pages/RegisterPage'
import DemoBanner from './components/ui/DemoBanner'
import ProtectedRoute from './components/auth/ProtectedRoute'
import DailyLogPage from './pages/DailyLogPage'
import AppointmentsPage from './pages/AppointmentsPage'
import ProfileSetupPage from './pages/ProfileSetupPage'
import DashboardPage from './pages/DashboardPage'
import StatsPage from './pages/StatsPage'
import PartnerStatsPage from './pages/PartnerStatsPage'
import useThemeStore from './store/themeStore'
import { NotFoundPage, BadRequestPage, ServerErrorPage } from './pages/ErrorPages'


function AppWithLayout({ children }) {
  return (
    <ProtectedRoute>
      <AppLayout>{children}</AppLayout>
    </ProtectedRoute>
  )
}

function App() {
  const initializeTheme = useThemeStore((state) => state.initializeTheme)

  useEffect(() => {
    initializeTheme()
  }, [])

  return (
    <BrowserRouter>
      <DemoBanner />
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route
          path="/profile-setup"
          element={
            <ProtectedRoute>
              <ProfileSetupPage />
            </ProtectedRoute>
          }
        />
        <Route path="/dashboard" element={<DashboardPage />} />
        <Route path="/stats" element={<StatsPage />} />
        <Route path="/partner-stats" element={<PartnerStatsPage />} />
        <Route path="/logs" element={<DailyLogPage />} />
        <Route path="/appointments" element={<AppointmentsPage />} />
        {/* Error pages */}
        <Route path="/400" element={<BadRequestPage />} />
        <Route path="/500" element={<ServerErrorPage />} />

        {/* 404 fallback */}
        <Route path="*" element={<NotFoundPage />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App