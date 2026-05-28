import React, { useEffect, useState } from 'react'
import { Navigate } from 'react-router-dom'
import useAuthStore from '../../store/authStore'
import { Spinner } from '../ui/Card'

export default function ProtectedRoute({ children }) {
  const { isAuthenticated, fetchProfile, profile } = useAuthStore()

  // FIX: initialise checking to true ONLY when we actually need to fetch the profile.
  // Previously the else-branch called setChecking(false) synchronously inside useEffect,
  // which triggered a cascading render. By initialising the state correctly based on
  // the current condition, the else-branch is eliminated entirely — we only ever
  // setChecking(false) after an async fetchProfile() resolves, which is safe.
  const needsFetch = isAuthenticated && !profile
  const [checking, setChecking] = useState(needsFetch)

  useEffect(() => {
    if (!needsFetch) return          // nothing async needed — no setState called
    fetchProfile().finally(() => setChecking(false))
  }, [isAuthenticated])             // re-evaluate if auth status changes

  if (checking) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-cream dark:bg-cream-dark">
        <Spinner size={36} />
      </div>
    )
  }

  if (!isAuthenticated) return <Navigate to="/login" replace />

  return children
}