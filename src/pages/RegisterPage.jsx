import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import {
  ArrowRight,
  Lock,
  Mail,
  User,
} from 'lucide-react'

import AppLayout from '../components/layout/AppLayout'
import useAuthStore from '../store/authStore'  // FIX: was never imported

export default function RegisterPage() {
  // FIX: Form had no state — all fields were uncontrolled static inputs.
  // Adding state for every field and a submission handler.
  const navigate = useNavigate()
  const register = useAuthStore((state) => state.register)
  const [fullName, setFullName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [error, setError] = useState('')
  const [isLoading, setIsLoading] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')

    if (password !== confirmPassword) {
      setError('Passwords do not match.')
      return
    }
    if (password.length < 8) {
      setError('Password must be at least 8 characters.')
      return
    }

    setIsLoading(true)
    const result = await register({
      full_name: fullName,
      email,
      password,
      confirm_password: confirmPassword,
    })
    setIsLoading(false)

    if (result.success) {
      if (result.needsSetup) {
        navigate('/profile-setup')
      } else {
        navigate('/dashboard')
      }
    } else {
      setError(result.error || 'Registration failed. Please try again.')
    }
  }

  return (
    <AppLayout>
      {/* Form */}
      <div className="min-h-[calc(100vh-4rem)] flex items-center justify-center px-6 py-10">
        <div className="w-full max-w-md">

          <Link
            to="/"
            className="text-sm text-muted dark:text-muted-dark hover:underline no-underline"
          >
            ← Back to home
          </Link>

          <h1 className="font-display text-5xl font-bold text-charcoal dark:text-charcoal-dark mt-8 mb-3">
            Create account
          </h1>

          <p className="text-muted dark:text-muted-dark mb-10">
            Begin your pregnancy journey with CARE
          </p>

          {/* FIX: added onSubmit handler */}
          <form className="space-y-5" onSubmit={handleSubmit}>

            {/* Error display */}
            {error && (
              <div className="px-4 py-3 rounded-[10px] text-sm bg-red-50 border border-red-200 text-red-800">
                {error}
              </div>
            )}

            {/* Full Name */}
            <div>
              <label className="block text-xs font-semibold tracking-[3px] text-muted dark:text-muted-dark mb-2">
                FULL NAME
              </label>

              <div className="flex items-center gap-3 px-4 py-4 bg-white dark:bg-dark border border-border dark:border-border-dark rounded-xl">
                <User size={18} className="text-muted dark:text-muted-dark" />
                {/* FIX: added value and onChange */}
                <input
                  type="text"
                  placeholder="Your full name"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  className="w-full bg-transparent outline-none text-charcoal dark:text-charcoal-dark placeholder:text-muted dark:placeholder:text-muted-dark"
                  required
                />
              </div>
            </div>

            {/* Email */}
            <div>
              <label className="block text-xs font-semibold tracking-[3px] text-muted dark:text-muted-dark mb-2">
                EMAIL
              </label>

              <div className="flex items-center gap-3 px-4 py-4 bg-white dark:bg-dark border border-border dark:border-border-dark rounded-xl">
                <Mail size={18} className="text-muted dark:text-muted-dark" />
                {/* FIX: added value and onChange */}
                <input
                  type="email"
                  placeholder="you@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full bg-transparent outline-none text-charcoal dark:text-charcoal-dark placeholder:text-muted dark:placeholder:text-muted-dark"
                  required
                />
              </div>
            </div>

            {/* Password */}
            <div>
              <label className="block text-xs font-semibold tracking-[3px] text-muted dark:text-muted-dark mb-2">
                PASSWORD
              </label>

              <div className="flex items-center gap-3 px-4 py-4 bg-white dark:bg-dark border border-border dark:border-border-dark rounded-xl">
                <Lock size={18} className="text-muted dark:text-muted-dark" />
                {/* FIX: added value and onChange */}
                <input
                  type="password"
                  placeholder="Minimum 8 characters"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full bg-transparent outline-none text-charcoal dark:text-charcoal-dark placeholder:text-muted dark:placeholder:text-muted-dark"
                  required
                />
              </div>
            </div>

            {/* Confirm Password */}
            <div>
              <label className="block text-xs font-semibold tracking-[3px] text-muted dark:text-muted-dark mb-2">
                CONFIRM PASSWORD
              </label>

              <div className="flex items-center gap-3 px-4 py-4 bg-white dark:bg-dark border border-border dark:border-border-dark rounded-xl">
                <Lock size={18} className="text-muted dark:text-muted-dark" />
                {/* FIX: added value and onChange */}
                <input
                  type="password"
                  placeholder="Repeat your password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="w-full bg-transparent outline-none text-charcoal dark:text-charcoal-dark placeholder:text-muted dark:placeholder:text-muted-dark"
                  required
                />
              </div>
            </div>

            {/* Button */}
            <button
              type="submit"
              disabled={isLoading}
              className="w-full flex items-center justify-center gap-2 px-8 py-4 bg-rose-deep dark:bg-rose-deep-dark text-white rounded-xl text-base font-semibold shadow-[0_4px_20px_rgba(192,82,106,0.35)] hover:opacity-90 transition-opacity disabled:opacity-55"
            >
              {isLoading ? 'Creating account…' : <> Create account <ArrowRight size={18} /> </>}
            </button>
          </form>

          <p className="text-center text-muted dark:text-muted-dark mt-8">
            Already have an account?{' '}
            <Link
              to="/login"
              className="text-rose-deep dark:text-rose-deep-dark font-semibold no-underline"
            >
              Sign in
            </Link>
          </p>

        </div>
      </div>
    </AppLayout>
  )
}
