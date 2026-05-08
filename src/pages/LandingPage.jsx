import React from 'react'
import { Link } from 'react-router-dom'
import { Heart, Activity, Calendar, Users, ArrowRight, Star, Moon, Sun } from 'lucide-react'
import careLogo from '/CARE.svg'
import useThemeStore from '../store/themeStore'

const features = [
  { icon: Activity, title: 'Daily Wellness Logs',    desc: 'Track mood, sleep, exercise, and symptoms every day to build a comprehensive picture of your journey.',    color: '#e8899a' },
  { icon: Calendar, title: 'Appointment Manager',    desc: 'Never miss a prenatal check-up. Schedule and manage all your medical appointments in one place.',            color: '#8aab96' },
  { icon: Users,    title: 'Partner Connection',     desc: 'Link with your partner so they can follow along, view your logs, and stay informed and involved.',           color: '#c4b5d4' },
  { icon: Star,     title: 'Rich Statistics',        desc: 'Beautiful charts and insights on your mood trends, sleep patterns, and activity levels over time.',          color: '#e8b86d' },
]

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-cream dark:bg-cream-dark overflow-x-hidden">

      {/* Nav */}
      <nav className="fixed top-0 left-0 right-0 bg-cream/90 dark:bg-cream-dark/90 backdrop-blur-md border-b border-border dark:border-border-dark z-50 px-8 md:px-10 flex items-center justify-between h-16">
        <div className="flex items-center gap-2.5">
          <div className="w-14 h-6 flex items-center justify-center">
            <img src={careLogo} alt="Care Logo" className="w-auto h-14" />
          </div>
          <span className="font-display font-bold text-xl text-charcoal dark:text-charcoal-dark">CARE</span>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={useThemeStore((state) => state.toggleTheme)}
            className="p-2 rounded-[10px] border border-border dark:border-border-dark text-charcoal dark:text-charcoal-dark hover:border-rose dark:hover:border-rose-dark transition-colors"
            aria-label="Toggle theme"
          >
            {useThemeStore((state) => state.isDarkMode) ? <Sun size={16} /> : <Moon size={16} />}
          </button>
          <Link to="/login" className="px-5 py-2 rounded-[10px] border border-border dark:border-border-dark text-sm font-medium text-charcoal dark:text-charcoal-dark hover:border-rose dark:hover:border-rose-dark transition-colors no-underline">
            Sign in
          </Link>
          <Link to="/register" className="px-5 py-2 rounded-[10px] bg-rose-deep dark:bg-rose-deep-dark text-white text-sm font-medium hover:opacity-90 transition-opacity no-underline">
            Get started
          </Link>
        </div>
      </nav>

      {/* Hero */}
      <section className="min-h-screen flex items-center justify-center px-6 pt-24 pb-16 relative overflow-hidden">
        <div className="absolute w-[600px] h-[600px] rounded-full bg-[radial-gradient(circle,rgba(242,196,206,0.35)_0%,transparent_70%)] -top-24 -right-48 pointer-events-none" />
        <div className="absolute w-[400px] h-[400px] rounded-full bg-[radial-gradient(circle,rgba(138,171,150,0.2)_0%,transparent_70%)] -bottom-12 -left-24 pointer-events-none" />

        <div className="max-w-2xl text-center relative animate-fade-up">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-rose-deep/10 dark:bg-rose-deep-dark/10 text-rose-deep dark:text-rose-deep-dark text-xs font-semibold mb-7 tracking-wide uppercase">
            <Heart size={12} fill="currentColor" /> Your Pregnancy Companion
          </div>

          <h1 className="font-display text-[clamp(2.6rem,6vw,4rem)] font-bold leading-[1.18] text-charcoal dark:text-charcoal-dark mb-6">
            Every moment of your
            <span className="block italic text-rose-deep dark:text-rose-deep-dark">journey matters</span>
          </h1>

          <p className="text-lg text-muted dark:text-muted-dark leading-relaxed max-w-[500px] mx-auto mb-10">
            CARE helps expectant mothers and their partners track wellness, manage appointments, and share the beautiful experience of pregnancy together.
          </p>

          <div className="flex gap-3.5 justify-center flex-wrap">
            <Link
              to="/register"
              className="inline-flex items-center gap-2 px-8 py-3.5 bg-rose-deep dark:bg-rose-deep-dark text-white rounded-xl text-base font-semibold shadow-[0_4px_20px_rgba(192,82,106,0.35)] hover:-translate-y-0.5 hover:shadow-[0_8px_30px_rgba(192,82,106,0.45)] transition-all duration-200 no-underline"
            >
              Start your journey <ArrowRight size={17} />
            </Link>
            <Link
              to="/login"
              className="inline-flex items-center gap-2 px-8 py-3.5 bg-white dark:bg-dark text-charcoal dark:text-charcoal-dark rounded-xl text-base font-semibold border border-border dark:border-border-dark hover:border-rose dark:hover:border-rose-dark transition-colors no-underline"
            >
              Sign in
            </Link>
          </div>

          <div className="flex justify-center gap-10 mt-14 flex-wrap">
            {[{ n: '9 months', l: 'of moments captured' }, { n: '2 hearts', l: 'connected together' }, { n: '∞ love', l: 'every single day' }].map(s => (
              <div key={s.n} className="text-center">
                <div className="font-display text-2xl font-bold text-charcoal dark:text-charcoal-dark">{s.n}</div>
                <div className="text-xs text-muted dark:text-muted-dark mt-0.5">{s.l}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="px-6 md:px-10 py-20 max-w-[1100px] mx-auto">
        <div className="text-center mb-14">
          <h2 className="font-display text-[clamp(1.8rem,4vw,2.6rem)] font-bold text-charcoal dark:text-charcoal-dark mb-4">
            Everything you need,
            <span className="italic text-rose-deep dark:text-rose-deep-dark"> nothing you don't</span>
          </h2>
          <p className="text-muted dark:text-muted-dark text-lg max-w-md mx-auto">
            Simple, thoughtful tools designed for the most important journey of your life.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {features.map((f) => (
            <div
              key={f.title}
              className="bg-white dark:bg-dark rounded-2xl p-7 border border-border dark:border-border-dark shadow-sm hover:-translate-y-1 hover:shadow-md transition-all duration-200"
            >
              <div
                className="w-12 h-12 rounded-[14px] flex items-center justify-center mb-5"
                style={{ background: `${f.color}18`, color: f.color }}
              >
                <f.icon size={22} />
              </div>
              <h3 className="font-display text-[1.05rem] font-semibold text-charcoal dark:text-charcoal-dark mb-2.5">{f.title}</h3>
              <p className="text-muted dark:text-muted-dark text-sm leading-relaxed">{f.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="mx-6 md:mx-10 mb-20 px-6 py-20 text-center bg-gradient-to-br from-blush/30 dark:from-blush-dark/30 to-lavender/25 dark:to-lavender-dark/25 rounded-3xl border border-border dark:border-border-dark">
        <h2 className="font-display text-[clamp(1.8rem,4vw,2.4rem)] font-bold text-charcoal dark:text-charcoal-dark mb-4">Ready to begin?</h2>
        <p className="text-muted dark:text-muted-dark mb-8 text-lg">Join CARE and document every precious milestone together.</p>
        <Link
          to="/register"
          className="inline-flex items-center gap-2 px-9 py-3.5 bg-rose-deep dark:bg-rose-deep-dark text-white rounded-xl text-base font-semibold shadow-[0_4px_20px_rgba(192,82,106,0.35)] hover:opacity-90 transition-opacity no-underline"
        >
          Create your free account <ArrowRight size={17} />
        </Link>
      </section>

      {/* Footer */}
      <footer className="px-8 py-6 border-t border-border dark:border-border-dark flex justify-between items-center text-muted dark:text-muted-dark text-xs flex-wrap gap-3">
        <div className="flex items-center gap-2">
          <Heart size={13} fill="#e8899a" color="#e8899a" />
          <span>CARE Pregnancy Tracker</span>
        </div>
        <span>Made with love for expectant families</span>
      </footer>
    </div>
  )
}