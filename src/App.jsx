import React, { useEffect } from 'react'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import LandingPage from './pages/LandingPage'
import LoginPage from './pages/LoginPage'
import RegisterPage from './pages/RegisterPage'
import DemoBanner from './components/ui/DemoBanner'
import ProtectedRoute from './components/auth/ProtectedRoute'
import DashboardPage from './pages/DashboardPage'
import useThemeStore from './store/themeStore'


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
              <div className="p-4">Profile setup coming soon...</div>
            </ProtectedRoute>
          }
        />
        <Route path="/dashboard" element={<DashboardPage />} />

        {/* Protected app routes (AKTIFKAN KODE DIBAWAH KETIKA FITUR SUDAH SIAP) 
        <Route path="/dashboard" element={<AppWithLayout><DashboardPage /></AppWithLayout>} />
        <Route path="/logs" element={<AppWithLayout><DailyLogPage /></AppWithLayout>} />
        <Route path="/appointments" element={<AppWithLayout><AppointmentsPage /></AppWithLayout>} />
        <Route path="/stats" element={<AppWithLayout><StatsPage /></AppWithLayout>} />
        <Route path="/partner-stats" element={<AppWithLayout><PartnerStatsPage /></AppWithLayout>} />*/}
      </Routes>
    </BrowserRouter>
  )
}

export default App