import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { ArrowRight, Lock, Mail, User, Sparkles } from 'lucide-react'
import AppLayout from '../components/layout/AppLayout'
import useAuthStore from '../store/authStore'

export default function RegisterPage() {
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
      <div className="relative min-h-[calc(100vh-4rem)] flex items-center justify-center px-6 py-12 overflow-hidden">
        
        {/* Background Gradients */}
        <div className="absolute top-0 right-1/4 w-[500px] h-[500px] bg-rose-deep/15 dark:bg-rose-deep-dark/10 rounded-full blur-[100px] -z-10 pointer-events-none" />
        <div className="absolute bottom-10 left-1/4 w-[400px] h-[400px] bg-purple-500/10 dark:bg-purple-500/10 rounded-full blur-[80px] -z-10 pointer-events-none" />

        <div className="w-full max-w-md relative z-10 animate-fade-up">
          
          {/* Form Card */}
          <div className="bg-white/80 dark:bg-[#1a1a1a]/80 backdrop-blur-2xl border border-white/50 dark:border-border-dark/50 shadow-2xl rounded-[2.5rem] p-8 md:p-10 relative overflow-hidden">
            
            {/* Decorative blur */}
            <div className="absolute -top-10 -left-10 w-32 h-32 bg-gradient-to-br from-purple-400/30 to-rose-deep/30 blur-2xl rounded-full pointer-events-none"></div>

            <Link
              to="/"
              className="inline-flex items-center text-sm font-medium text-muted dark:text-muted-dark hover:text-rose-deep dark:hover:text-rose-deep transition-colors mb-6"
            >
              ← Back to home
            </Link>

            <div className="mb-8">
              <div className="w-12 h-12 rounded-2xl bg-purple-500/10 dark:bg-purple-500/20 flex items-center justify-center mb-6">
                <Sparkles size={24} className="text-purple-500 dark:text-purple-400" />
              </div>
              <h1 className="font-display text-4xl font-bold text-charcoal dark:text-charcoal-dark mb-2 tracking-tight">
                Create account
              </h1>
              <p className="text-muted dark:text-muted-dark text-sm">
                Begin your beautiful pregnancy journey with CARE.
              </p>
            </div>

            <form className="space-y-4" onSubmit={handleSubmit}>
              
              {error && (
                <div className="px-4 py-3 rounded-xl text-sm bg-red-50/80 dark:bg-red-900/10 border border-red-200 dark:border-red-900/30 text-red-600 dark:text-red-400 backdrop-blur-sm">
                  {error}
                </div>
              )}

              {/* Full Name */}
              <div>
                <label className="block text-[11px] font-bold tracking-widest text-muted dark:text-muted-dark mb-1.5 uppercase">
                  Full Name
                </label>
                <div className="group relative flex items-center">
                  <User size={18} className="absolute left-4 text-muted dark:text-muted-dark group-focus-within:text-purple-500 transition-colors" />
                  <input
                    type="text"
                    placeholder="Your full name"
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    className="w-full bg-white dark:bg-[#2a2a2a] border border-border/50 dark:border-border-dark/50 rounded-2xl py-3 pl-12 pr-4 text-sm text-charcoal dark:text-charcoal-dark placeholder:text-muted/60 dark:placeholder:text-muted-dark/60 focus:outline-none focus:ring-2 focus:ring-purple-500/20 focus:border-purple-500/50 transition-all shadow-sm"
                    required
                  />
                </div>
              </div>

              {/* Email */}
              <div>
                <label className="block text-[11px] font-bold tracking-widest text-muted dark:text-muted-dark mb-1.5 uppercase">
                  Email
                </label>
                <div className="group relative flex items-center">
                  <Mail size={18} className="absolute left-4 text-muted dark:text-muted-dark group-focus-within:text-purple-500 transition-colors" />
                  <input
                    type="email"
                    placeholder="you@example.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full bg-white dark:bg-[#2a2a2a] border border-border/50 dark:border-border-dark/50 rounded-2xl py-3 pl-12 pr-4 text-sm text-charcoal dark:text-charcoal-dark placeholder:text-muted/60 dark:placeholder:text-muted-dark/60 focus:outline-none focus:ring-2 focus:ring-purple-500/20 focus:border-purple-500/50 transition-all shadow-sm"
                    required
                  />
                </div>
              </div>

              {/* Password */}
              <div>
                <label className="block text-[11px] font-bold tracking-widest text-muted dark:text-muted-dark mb-1.5 uppercase">
                  Password
                </label>
                <div className="group relative flex items-center">
                  <Lock size={18} className="absolute left-4 text-muted dark:text-muted-dark group-focus-within:text-purple-500 transition-colors" />
                  <input
                    type="password"
                    placeholder="Minimum 8 characters"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full bg-white dark:bg-[#2a2a2a] border border-border/50 dark:border-border-dark/50 rounded-2xl py-3 pl-12 pr-4 text-sm text-charcoal dark:text-charcoal-dark placeholder:text-muted/60 dark:placeholder:text-muted-dark/60 focus:outline-none focus:ring-2 focus:ring-purple-500/20 focus:border-purple-500/50 transition-all shadow-sm"
                    required
                  />
                </div>
              </div>

              {/* Confirm Password */}
              <div>
                <label className="block text-[11px] font-bold tracking-widest text-muted dark:text-muted-dark mb-1.5 uppercase">
                  Confirm Password
                </label>
                <div className="group relative flex items-center">
                  <Lock size={18} className="absolute left-4 text-muted dark:text-muted-dark group-focus-within:text-purple-500 transition-colors" />
                  <input
                    type="password"
                    placeholder="Repeat your password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    className="w-full bg-white dark:bg-[#2a2a2a] border border-border/50 dark:border-border-dark/50 rounded-2xl py-3 pl-12 pr-4 text-sm text-charcoal dark:text-charcoal-dark placeholder:text-muted/60 dark:placeholder:text-muted-dark/60 focus:outline-none focus:ring-2 focus:ring-purple-500/20 focus:border-purple-500/50 transition-all shadow-sm"
                    required
                  />
                </div>
              </div>

              <div className="pt-4">
                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full flex items-center justify-center gap-2 px-8 py-4 bg-charcoal dark:bg-white text-white dark:text-charcoal rounded-2xl text-sm font-bold shadow-lg shadow-charcoal/20 dark:shadow-white/20 hover:scale-[1.02] active:scale-95 transition-all disabled:opacity-70 disabled:hover:scale-100"
                >
                  {isLoading ? 'Creating account...' : <>Create account <ArrowRight size={18} /></>}
                </button>
              </div>

            </form>
          </div>

          <p className="text-center text-sm font-medium text-muted dark:text-muted-dark mt-8">
            Already have an account?{' '}
            <Link
              to="/login"
              className="text-purple-500 dark:text-purple-400 font-bold hover:underline transition-all"
            >
              Sign in
            </Link>
          </p>

        </div>
      </div>
    </AppLayout>
  )
}