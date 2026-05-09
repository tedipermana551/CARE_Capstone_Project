import React from 'react'
import { Link } from 'react-router-dom'
import {
ArrowRight,
Lock,
Mail,
User,
Moon,
Sun,
} from 'lucide-react'

import useThemeStore from '../store/themeStore'
import careLogo from '/CARE.svg'

export default function RegisterPage() {
return (
    <div className="min-h-screen bg-cream dark:bg-cream-dark transition-colors duration-300">

      {/* Navbar */}
    <nav className="fixed top-0 left-0 right-0 bg-cream/90 dark:bg-cream-dark/90 backdrop-blur-md border-b border-border dark:border-border-dark z-50 px-8 md:px-10 flex items-center justify-between h-16">
        <div className="flex items-center gap-2.5">
        <img src={careLogo} alt="CARE Logo" className="w-auto h-14" />

        <span className="font-display font-bold text-xl text-charcoal dark:text-charcoal-dark">
            CARE
        </span>
        </div>

        <button
        onClick={useThemeStore((state) => state.toggleTheme)}
        className="p-2 rounded-[10px] border border-border dark:border-border-dark text-charcoal dark:text-charcoal-dark"
        >
        {useThemeStore((state) => state.isDarkMode)
            ? <Sun size={16} />
            : <Moon size={16} />
        }
        </button>
    </nav>

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
            Create account
        </h1>

        <p className="text-muted dark:text-muted-dark mb-10">
            Begin your pregnancy journey with CARE
        </p>

        <form className="space-y-5">

            {/* Full Name */}
            <div>
            <label className="block text-xs font-semibold tracking-[3px] text-muted dark:text-muted-dark mb-2">
                FULL NAME
            </label>

            <div className="flex items-center gap-3 px-4 py-4 bg-white dark:bg-dark border border-border dark:border-border-dark rounded-xl">
                <User size={18} className="text-muted dark:text-muted-dark" />

                <input
                type="text"
                placeholder="Your full name"
                className="w-full bg-transparent outline-none text-charcoal dark:text-charcoal-dark placeholder:text-muted dark:placeholder:text-muted-dark"
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

                <input
                type="email"
                placeholder="you@example.com"
                className="w-full bg-transparent outline-none text-charcoal dark:text-charcoal-dark placeholder:text-muted dark:placeholder:text-muted-dark"
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

                <input
                type="password"
                placeholder="Minimum 8 characters"
                className="w-full bg-transparent outline-none text-charcoal dark:text-charcoal-dark placeholder:text-muted dark:placeholder:text-muted-dark"
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

                <input
                type="password"
                placeholder="Repeat your password"
                className="w-full bg-transparent outline-none text-charcoal dark:text-charcoal-dark placeholder:text-muted dark:placeholder:text-muted-dark"
                />
            </div>
            </div>

            {/* Button */}
            <button
            type="submit"
            className="w-full flex items-center justify-center gap-2 px-8 py-4 bg-rose-deep dark:bg-rose-deep-dark text-white rounded-xl text-base font-semibold shadow-[0_4px_20px_rgba(192,82,106,0.35)] hover:opacity-90 transition-opacity"
            >
            Create account <ArrowRight size={18} />
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
    </div>
)
}