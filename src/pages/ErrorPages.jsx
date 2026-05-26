import React from 'react'
import { useNavigate, useRouteError, isRouteErrorResponse } from 'react-router-dom'
import { Heart, Home, ArrowLeft, WifiOff, ShieldAlert, Search, ServerCrash } from 'lucide-react'
import Button from '../components/ui/Button'

function ErrorLayout({ icon: Icon, code, title, subtitle, accentClass, children }) {
  const navigate = useNavigate()

  return (
    <div className="min-h-screen bg-bg-base flex flex-col items-center justify-center px-6 py-12 text-center">
      {/* Decorative blobs */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-24 -left-24 w-72 h-72 rounded-full bg-decor-a/30 blur-3xl" />
        <div className="absolute -bottom-24 -right-24 w-72 h-72 rounded-full bg-decor-b/30 blur-3xl" />
      </div>

      <div className="relative z-10 max-w-md w-full animate-fade-up">
        {/* Logo */}
        <div className="flex justify-center mb-8">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-brand-subtle to-brand flex items-center justify-center shadow-md">
            <Heart size={22} fill="white" color="white" />
          </div>
        </div>

        {/* Error icon */}
        <div className={`w-20 h-20 rounded-3xl flex items-center justify-center mx-auto mb-6 ${accentClass}`}>
          <Icon size={36} strokeWidth={1.5} />
        </div>

        {/* Code */}
        {code && (
          <p className="font-display text-[5rem] font-bold leading-none text-content-base/10 select-none mb-2">
            {code}
          </p>
        )}

        {/* Title & subtitle */}
        <h1 className="font-display text-2xl font-bold text-content-base mb-3">{title}</h1>
        <p className="text-content-subtle text-sm leading-relaxed mb-8 max-w-xs mx-auto">{subtitle}</p>

        {/* Actions */}
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          {children}
        </div>
      </div>
    </div>
  )
}

export function NotFoundPage() {
  const navigate = useNavigate()
  return (
    <ErrorLayout
      icon={Search}
      code="404"
      title="Page not found"
      subtitle="The page you're looking for doesn't exist or may have been moved. Let's get you back on track."
      accentClass="bg-sleep-subtle text-sleep"
    >
      <Button onClick={() => navigate(-1)} variant="secondary">
        <ArrowLeft size={15} />
        Go back
      </Button>
      <Button onClick={() => navigate('/dashboard')}>
        <Home size={15} />
        Dashboard
      </Button>
    </ErrorLayout>
  )
}

export function BadRequestPage() {
  const navigate = useNavigate()
  return (
    <ErrorLayout
      icon={ShieldAlert}
      code="400"
      title="Bad request"
      subtitle="Something went wrong with the request. This can happen when a link is malformed or data is missing."
      accentClass="bg-streak-subtle text-streak"
    >
      <Button onClick={() => navigate(-1)} variant="secondary">
        <ArrowLeft size={15} />
        Go back
      </Button>
      <Button onClick={() => navigate('/dashboard')}>
        <Home size={15} />
        Dashboard
      </Button>
    </ErrorLayout>
  )
}

export function ServerErrorPage() {
  const navigate = useNavigate()
  return (
    <ErrorLayout
      icon={ServerCrash}
      code="500"
      title="Something went wrong"
      subtitle="We're having trouble on our end. Please try again in a moment — we're working on it."
      accentClass="bg-brand-subtle text-brand-strong"
    >
      <Button onClick={() => window.location.reload()} variant="secondary">
        Try again
      </Button>
      <Button onClick={() => navigate('/dashboard')}>
        <Home size={15} />
        Dashboard
      </Button>
    </ErrorLayout>
  )
}

export function NetworkErrorPage() {
  const navigate = useNavigate()
  return (
    <ErrorLayout
      icon={WifiOff}
      code={null}
      title="No connection"
      subtitle="It looks like you're offline. Check your internet connection and try again."
      accentClass="bg-accent-subtle text-accent"
    >
      <Button onClick={() => window.location.reload()} variant="secondary">
        Retry
      </Button>
      <Button onClick={() => navigate('/dashboard')}>
        <Home size={15} />
        Dashboard
      </Button>
    </ErrorLayout>
  )
}

// React Router v6 error boundary component
export function RouterErrorPage() {
  const error = useRouteError()
  const navigate = useNavigate()

  if (isRouteErrorResponse(error)) {
    if (error.status === 404) return <NotFoundPage />
    if (error.status === 400) return <BadRequestPage />
    if (error.status >= 500) return <ServerErrorPage />
  }

  // Generic fallback
  return (
    <ErrorLayout
      icon={ShieldAlert}
      code={null}
      title="An error occurred"
      subtitle={error?.message || 'An unexpected error happened. Please try again or navigate back.'}
      accentClass="bg-brand-subtle text-brand-strong"
    >
      <Button onClick={() => navigate(-1)} variant="secondary">
        <ArrowLeft size={15} />
        Go back
      </Button>
      <Button onClick={() => navigate('/dashboard')}>
        <Home size={15} />
        Dashboard
      </Button>
    </ErrorLayout>
  )
}

export default RouterErrorPage