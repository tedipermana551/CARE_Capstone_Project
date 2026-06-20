import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom' 
import { ArrowRight, Lock, Mail, Heart } from 'lucide-react'
import AppLayout from '../components/layout/AppLayout'
import useAuthStore from '../store/authStore'

export default function LoginPage() {
  const navigate = useNavigate()
  const login = useAuthStore((state) => state.login)
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')

  const handleSubmit = async (e) => {
    e.preventDefault()
    setIsLoading(true)
    setError('')
    const result = await login({ email, password })
    setIsLoading(false)
    if (result.success) {
      navigate('/dashboard')
    } else {
      setError(result.error || 'Invalid credentials. Please try again.')
    }
  }

  return (
    <AppLayout>
      <div className="relative min-h-[calc(100vh-4rem)] flex items-center justify-center px-6 py-12 overflow-hidden">
        
        {/* Background Gradients */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-lg h-[500px] bg-rose-deep/20 dark:bg-rose-deep-dark/10 rounded-full blur-[100px] -z-10 pointer-events-none" />
        <div className="absolute bottom-0 right-0 w-[400px] h-[400px] bg-purple-500/10 dark:bg-purple-500/10 rounded-full blur-[80px] -z-10 pointer-events-none" />

        <div className="w-full max-w-md relative z-10 animate-fade-up">
          
          {/* Form Card */}
          <div className="bg-white/80 dark:bg-[#1a1a1a]/80 backdrop-blur-2xl border border-white/50 dark:border-border-dark/50 shadow-2xl rounded-[2.5rem] p-8 md:p-10 relative overflow-hidden">
            
            {/* Decorative top corner blur */}
            <div className="absolute -top-10 -right-10 w-32 h-32 bg-gradient-to-br from-rose-deep/30 to-purple-400/30 blur-2xl rounded-full pointer-events-none"></div>

            <Link
              to="/"
              className="inline-flex items-center text-sm font-medium text-muted dark:text-muted-dark hover:text-rose-deep dark:hover:text-rose-deep transition-colors mb-8"
            >
              ← Back to home
            </Link>

            <div className="mb-8">
              <div className="w-12 h-12 rounded-2xl bg-rose-deep/10 dark:bg-rose-deep-dark/10 flex items-center justify-center mb-6">
                <Heart size={24} className="text-rose-deep dark:text-rose-deep-dark fill-rose-deep/20" />
              </div>
              <h1 className="font-display text-4xl font-bold text-charcoal dark:text-charcoal-dark mb-2 tracking-tight">
                Welcome back
              </h1>
              <p className="text-muted dark:text-muted-dark text-sm">
                Sign in to continue tracking your beautiful journey.
              </p>
            </div>

            <form className="space-y-5" onSubmit={handleSubmit}>
              
              {error && (
                <div className="px-4 py-3 rounded-xl text-sm bg-red-50/80 dark:bg-red-900/10 border border-red-200 dark:border-red-900/30 text-red-600 dark:text-red-400 backdrop-blur-sm">
                  {error}
                </div>
              )}

              <div>
                <label className="block text-[11px] font-bold tracking-widest text-muted dark:text-muted-dark mb-2 uppercase">
                  Email
                </label>
                <div className="group relative flex items-center">
                  <Mail size={18} className="absolute left-4 text-muted dark:text-muted-dark group-focus-within:text-rose-deep transition-colors" />
                  <input
                    type="email"
                    placeholder="you@example.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full bg-white dark:bg-[#2a2a2a] border border-border/50 dark:border-border-dark/50 rounded-2xl py-3.5 pl-12 pr-4 text-sm text-charcoal dark:text-charcoal-dark placeholder:text-muted/60 dark:placeholder:text-muted-dark/60 focus:outline-none focus:ring-2 focus:ring-rose-deep/20 focus:border-rose-deep/50 transition-all shadow-sm"
                    required 
                  />
                </div>
              </div>

              <div>
                <label className="block text-[11px] font-bold tracking-widest text-muted dark:text-muted-dark mb-2 uppercase">
                  Password
                </label>
                <div className="group relative flex items-center">
                  <Lock size={18} className="absolute left-4 text-muted dark:text-muted-dark group-focus-within:text-rose-deep transition-colors" />
                  <input
                    type="password"
                    placeholder="Your password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full bg-white dark:bg-[#2a2a2a] border border-border/50 dark:border-border-dark/50 rounded-2xl py-3.5 pl-12 pr-4 text-sm text-charcoal dark:text-charcoal-dark placeholder:text-muted/60 dark:placeholder:text-muted-dark/60 focus:outline-none focus:ring-2 focus:ring-rose-deep/20 focus:border-rose-deep/50 transition-all shadow-sm"
                    required
                  />
                </div>
              </div>

              <div className="pt-2">
                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full flex items-center justify-center gap-2 px-8 py-4 bg-charcoal dark:bg-white text-white dark:text-charcoal rounded-2xl text-sm font-bold shadow-lg shadow-charcoal/20 dark:shadow-white/20 hover:scale-[1.02] active:scale-95 transition-all disabled:opacity-70 disabled:hover:scale-100"
                >
                  {isLoading ? 'Signing in...' : <>Sign in <ArrowRight size={18} /></>}
                </button>
              </div>

            </form>

          </div>

          <p className="text-center text-sm font-medium text-muted dark:text-muted-dark mt-8">
            Don't have an account?{' '}
            <Link
              to="/register"
              className="text-rose-deep dark:text-rose-deep-dark font-bold hover:underline transition-all"
            >
              Create one
            </Link>
          </p>

        </div>
      </div>
    </AppLayout>
  )
}