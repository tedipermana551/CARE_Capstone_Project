import React from 'react'
import { Link, useNavigate } from 'react-router-dom' 
import { ArrowRight, Lock, Mail } from 'lucide-react'
import AppLayout from '../components/layout/AppLayout'

export default function LoginPage() {
const navigate = useNavigate(); 

const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Login sukses!");
    navigate('/dashboard');
};

return (
    <AppLayout>
      {/* Form */}
    <div className="min-h-screen flex items-center justify-center px-6 pt-24">
        <div className="w-full max-w-md">

        <Link
            to="/"
            className="text-sm text-muted dark:text-muted-dark hover:underline no-underline"
        >
            ← Back to home
        </Link>

        <h1 className="font-display text-5xl font-bold text-charcoal dark:text-charcoal-dark mt-8 mb-3">
            Welcome back
        </h1>

        <p className="text-muted dark:text-muted-dark mb-10">
            Sign in to continue your journey
        </p>

        <form className="space-y-5" onSubmit={handleSubmit}>

            <div>
            <label className="block text-xs font-semibold tracking-[3px] text-muted dark:text-muted-dark mb-2">
                EMAIL
            </label>

            <div className="flex items-center gap-3 px-4 py-4 bg-white dark:bg-dark border border-border dark:border-border-dark rounded-xl">
                <Mail size={18} className="text-muted dark:text-muted-dark" />

                <input
                type="email"
                placeholder="you@example.com"
                className="w-full bg-transparent outline-none text-charcoal dark:text-charcoal-dark placeholder:text-muted dark:placeholder:text-muted-dark"
                required 
                />
            </div>
            </div>

            <div>
            <label className="block text-xs font-semibold tracking-[3px] text-muted dark:text-muted-dark mb-2">
                PASSWORD
            </label>

            <div className="flex items-center gap-3 px-4 py-4 bg-white dark:bg-dark border border-border dark:border-border-dark rounded-xl">
                <Lock size={18} className="text-muted dark:text-muted-dark" />

                <input
                type="password"
                placeholder="Your password"
                className="w-full bg-transparent outline-none text-charcoal dark:text-charcoal-dark placeholder:text-muted dark:placeholder:text-muted-dark"
                required
                />
            </div>
            </div>

            <button
            type="submit"
            className="w-full flex items-center justify-center gap-2 px-8 py-4 bg-rose-deep dark:bg-rose-deep-dark text-white rounded-xl text-base font-semibold shadow-[0_4px_20px_rgba(192,82,106,0.35)] hover:opacity-90 transition-opacity"
            >
            Sign in <ArrowRight size={18} />
            </button>
        </form>

        <p className="text-center text-muted dark:text-muted-dark mt-8">
            Don’t have an account?{' '}
            <Link
            to="/register"
            className="text-rose-deep dark:text-rose-deep-dark font-semibold no-underline"
            >
            Create one
            </Link>
        </p>

        </div>
    </div>
    </AppLayout>
)
}