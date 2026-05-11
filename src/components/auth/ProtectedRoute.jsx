import React, { useEffect, useState } from 'react'
import { Navigate } from 'react-router-dom'
import useAuthStore from '../../store/authStore'
import { Spinner } from '../ui/Card'

export default function ProtectedRoute({ children }) {
  const { isAuthenticated, fetchProfile, profile } = useAuthStore()
  const [checking, setChecking] = useState(true)

  useEffect(() => {
    if (isAuthenticated && !profile) {
      fetchProfile().finally(() => setChecking(false))
    } else {
      setChecking(false)
    }
  }, [isAuthenticated])

  if (checking) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-bg-base">
        <Spinner size={36} />
      </div>
    )
  }

  if (!isAuthenticated) return <Navigate to="/login" replace />

  return children
}
