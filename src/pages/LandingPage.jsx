import React from 'react'
import { Link } from 'react-router-dom'
import { Heart, Activity, Calendar, Users, ArrowRight, Star, Moon, Sun, CheckCircle, Clock } from 'lucide-react'
import careLogo from '/CARE.svg'
import useThemeStore from '../store/themeStore'

const features = [
  { icon: Activity, title: 'Daily Wellness Logs',    desc: 'Track mood, sleep, exercise, and symptoms every day to build a comprehensive picture of your journey.',    color: 'text-rose-deep dark:text-rose-deep-dark', bg: 'bg-rose-deep/10 dark:bg-rose-deep-dark/10' },
  { icon: Calendar, title: 'Appointment Manager',    desc: 'Never miss a prenatal check-up. Schedule and manage all your medical appointments in one place.',            color: 'text-emerald-500', bg: 'bg-emerald-500/10' },
  { icon: Users,    title: 'Partner Connection',     desc: 'Link with your partner so they can follow along, view your logs, and stay informed and involved.',           color: 'text-purple-500', bg: 'bg-purple-500/10' },
  { icon: Star,     title: 'Rich Statistics',        desc: 'Beautiful charts and insights on your mood trends, sleep patterns, and activity levels over time.',          color: 'text-amber-500', bg: 'bg-amber-500/10' },
]

export default function LandingPage() {
  const toggleTheme = useThemeStore((state) => state.toggleTheme)
  const isDarkMode = useThemeStore((state) => state.isDarkMode)

  return (
    <div className="min-h-screen bg-cream dark:bg-cream-dark overflow-hidden font-sans selection:bg-rose-deep/20">
      
      {/* Navigation - Glassmorphic */}
      <nav className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-6 py-4 md:px-12 bg-cream/70 dark:bg-dark/70 backdrop-blur-xl border-b border-border/50 dark:border-border-dark/50">
        <div className="flex items-center gap-3">
          <img src={careLogo} alt="Care Logo" className="w-10 h-10 object-contain drop-shadow-sm" />
          <span className="font-display font-bold text-2xl tracking-tight text-charcoal dark:text-charcoal-dark">CARE</span>
        </div>
        <div className="flex items-center gap-4">
          <button
            onClick={toggleTheme}
            className="p-2.5 rounded-full bg-white dark:bg-[#2a2a2a] border border-border/50 dark:border-border-dark/50 text-charcoal dark:text-charcoal-dark hover:shadow-md transition-all duration-300"
            aria-label="Toggle theme"
          >
            {isDarkMode ? <Sun size={18} /> : <Moon size={18} />}
          </button>
          <Link to="/login" className="hidden sm:inline-flex px-6 py-2.5 rounded-full text-sm font-semibold text-charcoal dark:text-charcoal-dark hover:bg-black/5 dark:hover:bg-white/5 transition-colors no-underline">
            Log in
          </Link>
          <Link to="/register" className="px-6 py-2.5 rounded-full bg-charcoal dark:bg-white text-white dark:text-charcoal text-sm font-semibold hover:scale-105 transition-transform duration-300 shadow-lg shadow-charcoal/20 dark:shadow-white/20 no-underline">
            Get Started
          </Link>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative pt-32 pb-20 md:pt-40 md:pb-28 px-6 md:px-12 max-w-7xl mx-auto">
        {/* Background Gradients */}
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[800px] h-[800px] bg-rose-deep/10 dark:bg-rose-deep-dark/10 rounded-full blur-3xl -z-10 animate-pulse" />
        <div className="absolute top-20 right-0 w-[400px] h-[400px] bg-lavender/30 dark:bg-lavender-dark/20 rounded-full blur-3xl -z-10" />
        <div className="absolute bottom-0 left-10 w-[500px] h-[500px] bg-blush/30 dark:bg-blush-dark/20 rounded-full blur-3xl -z-10" />

        <div className="flex flex-col lg:flex-row items-center gap-16">
          {/* Hero Content */}
          <div className="flex-1 text-center lg:text-left z-10 animate-fade-up">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/80 dark:bg-[#2a2a2a]/80 backdrop-blur-sm border border-rose-deep/20 dark:border-rose-deep-dark/20 text-rose-deep dark:text-rose-deep-dark text-sm font-medium mb-8 shadow-sm">
              <Star size={14} className="fill-rose-deep dark:fill-rose-deep-dark" />
              <span>Loved by 10,000+ expectant mothers</span>
            </div>
            
            <h1 className="font-display text-5xl md:text-6xl lg:text-7xl font-bold text-charcoal dark:text-charcoal-dark leading-[1.1] mb-6 tracking-tight">
              Embrace every moment of your <span className="text-transparent bg-clip-text bg-gradient-to-r from-rose-deep to-purple-500">pregnancy journey</span>
            </h1>
            
            <p className="text-lg md:text-xl text-muted dark:text-muted-dark mb-10 max-w-2xl mx-auto lg:mx-0 leading-relaxed">
              Your intelligent, calming companion. Track wellness, manage appointments, and share the beautiful experience of pregnancy with your partner.
            </p>
            
            <div className="flex flex-col sm:flex-row items-center gap-4 justify-center lg:justify-start">
              <Link to="/register" className="w-full sm:w-auto px-8 py-4 rounded-full bg-rose-deep dark:bg-rose-deep-dark text-white font-semibold text-lg hover:shadow-xl hover:shadow-rose-deep/30 hover:-translate-y-1 transition-all duration-300 flex items-center justify-center gap-2 no-underline">
                Start Tracking Free <ArrowRight size={20} />
              </Link>
              <Link to="/login" className="w-full sm:w-auto px-8 py-4 rounded-full bg-white dark:bg-[#2a2a2a] text-charcoal dark:text-charcoal-dark border border-border/50 dark:border-border-dark/50 font-semibold text-lg hover:bg-black/5 dark:hover:bg-white/5 transition-colors flex items-center justify-center no-underline">
                Sign In
              </Link>
            </div>

            {/* Quick Stats */}
            <div className="mt-12 flex items-center justify-center lg:justify-start gap-8 border-t border-border/50 dark:border-border-dark/50 pt-8">
              <div>
                <p className="text-3xl font-bold text-charcoal dark:text-charcoal-dark">4.9/5</p>
                <p className="text-sm text-muted dark:text-muted-dark flex items-center gap-1 mt-1"><Star size={12} className="fill-amber-400 text-amber-400"/> App Rating</p>
              </div>
              <div className="w-px h-12 bg-border/50 dark:bg-border-dark/50"></div>
              <div>
                <p className="text-3xl font-bold text-charcoal dark:text-charcoal-dark">1M+</p>
                <p className="text-sm text-muted dark:text-muted-dark mt-1">Logs Created</p>
              </div>
            </div>
          </div>

          {/* Hero Visual / Mockups */}
          <div className="flex-1 relative w-full max-w-lg lg:max-w-none">
            <div className="relative w-full aspect-[4/5] md:aspect-square bg-gradient-to-br from-white/60 to-white/20 dark:from-[#2a2a2a]/60 dark:to-[#2a2a2a]/20 backdrop-blur-2xl rounded-[3rem] border border-white/40 dark:border-white/10 shadow-2xl flex items-center justify-center p-8">
              
              {/* Central Phone Mockup */}
              <div className="w-full max-w-[280px] aspect-[1/2.1] bg-white dark:bg-dark rounded-[2.5rem] shadow-2xl border-[6px] border-gray-100 dark:border-[#1a1a1a] relative overflow-hidden flex flex-col">
                <div className="w-1/3 h-5 bg-gray-100 dark:bg-[#1a1a1a] absolute top-0 left-1/2 -translate-x-1/2 rounded-b-xl z-20"></div>
                
                {/* Mockup App Content */}
                <div className="p-5 pt-10 flex-1 bg-cream/30 dark:bg-cream-dark/30 relative">
                  <div className="flex items-center justify-between mb-6">
                    <div>
                      <p className="text-[10px] text-muted dark:text-muted-dark uppercase tracking-wider font-semibold">Week 24</p>
                      <p className="font-bold text-charcoal dark:text-charcoal-dark text-base">Hello, Sarah</p>
                    </div>
                    <div className="w-9 h-9 rounded-full bg-white dark:bg-[#2a2a2a] shadow-sm flex items-center justify-center text-rose-deep border border-border/50 dark:border-border-dark/50">
                      <Heart size={16} className="fill-rose-deep/20" />
                    </div>
                  </div>
                  
                  <div className="bg-gradient-to-br from-rose-deep to-[#9370DB] rounded-[1.25rem] p-5 text-white mb-5 shadow-lg shadow-rose-deep/20 relative overflow-hidden">
                    <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full blur-2xl -translate-y-1/2 translate-x-1/3"></div>
                    <p className="text-[11px] opacity-90 mb-1.5 font-medium tracking-wide">Baby's Size</p>
                    <p className="font-bold text-xl mb-1">Ear of Corn 🌽</p>
                    <p className="text-[11px] opacity-80 mt-2 font-medium">~ 11.8 inches, 1.3 lbs</p>
                  </div>

                  <p className="font-bold text-charcoal dark:text-charcoal-dark text-xs mb-3">Today's Tasks</p>
                  <div className="space-y-2.5">
                    {[1, 2, 3].map(i => (
                      <div key={i} className="bg-white dark:bg-[#2a2a2a] p-3.5 rounded-2xl flex items-center gap-3 shadow-sm border border-border/30 dark:border-border-dark/30">
                        <div className="w-4 h-4 rounded-full border-2 border-rose-deep/50 dark:border-rose-deep-dark/50"></div>
                        <div className="h-2 bg-gray-100 dark:bg-gray-800 rounded-full w-24"></div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Floating Cards */}
              <div className="absolute top-12 -left-6 md:-left-12 bg-white dark:bg-[#2a2a2a] p-3.5 pr-6 rounded-2xl shadow-xl shadow-black/5 border border-border/50 dark:border-border-dark/50 flex items-center gap-3.5 animate-bounce" style={{animationDuration: '3.5s'}}>
                <div className="w-10 h-10 rounded-xl bg-emerald-500/10 flex items-center justify-center text-emerald-500">
                  <CheckCircle size={20} />
                </div>
                <div>
                  <p className="text-[10px] text-muted dark:text-muted-dark uppercase tracking-wider font-semibold mb-0.5">Vitamins</p>
                  <p className="font-bold text-charcoal dark:text-charcoal-dark text-sm">Taken Today</p>
                </div>
              </div>

              <div className="absolute bottom-24 -right-6 md:-right-12 bg-white dark:bg-[#2a2a2a] p-3.5 pr-6 rounded-2xl shadow-xl shadow-black/5 border border-border/50 dark:border-border-dark/50 flex items-center gap-3.5 animate-bounce" style={{animationDuration: '4s', animationDelay: '1s'}}>
                <div className="w-10 h-10 rounded-xl bg-purple-500/10 flex items-center justify-center text-purple-500">
                  <Clock size={20} />
                </div>
                <div>
                  <p className="text-[10px] text-muted dark:text-muted-dark uppercase tracking-wider font-semibold mb-0.5">Next Checkup</p>
                  <p className="font-bold text-charcoal dark:text-charcoal-dark text-sm">Tomorrow, 10 AM</p>
                </div>
              </div>

            </div>
          </div>
        </div>
      </section>

      {/* Features Section - Clean Layout */}
      <section className="py-24 bg-white/50 dark:bg-dark/50 relative z-10 border-t border-b border-border/50 dark:border-border-dark/50">
        <div className="max-w-7xl mx-auto px-6 md:px-12">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-rose-deep/10 dark:bg-rose-deep-dark/10 text-rose-deep dark:text-rose-deep-dark text-xs font-bold mb-4 tracking-widest uppercase">
              Features
            </div>
            <h2 className="font-display text-4xl md:text-5xl font-bold text-charcoal dark:text-charcoal-dark mb-6 tracking-tight">
              Effortless tracking, <span className="text-transparent bg-clip-text bg-gradient-to-r from-rose-deep to-purple-500">powerful insights</span>
            </h2>
            <p className="text-lg text-muted dark:text-muted-dark">
              We've designed CARE to be your beautiful, stress-free hub for everything you need during your pregnancy.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {features.map((feature, idx) => (
              <div key={idx} className="bg-white dark:bg-[#1a1a1a] p-8 rounded-[2rem] border border-border/50 dark:border-border-dark/50 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 group">
                <div className={`w-14 h-14 rounded-[1.25rem] ${feature.bg} flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300`}>
                  <feature.icon size={28} className={feature.color} />
                </div>
                <h3 className="text-xl font-bold text-charcoal dark:text-charcoal-dark mb-3">{feature.title}</h3>
                <p className="text-muted dark:text-muted-dark leading-relaxed text-sm">
                  {feature.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Social Proof / Quote Section */}
      <section className="py-24 px-6 md:px-12 max-w-4xl mx-auto text-center relative z-10">
        <div className="w-16 h-16 rounded-full bg-rose-deep/10 dark:bg-rose-deep-dark/10 flex items-center justify-center mx-auto mb-8">
          <Heart className="text-rose-deep dark:text-rose-deep-dark" fill="currentColor" size={24} />
        </div>
        <h3 className="text-2xl md:text-4xl font-display font-medium text-charcoal dark:text-charcoal-dark leading-[1.4] mb-10 italic">
          "CARE made my pregnancy journey so much easier to understand. Sharing my daily updates with my partner kept us incredibly close during the 9 months."
        </h3>
        <div className="flex items-center justify-center gap-4">
          <div className="w-14 h-14 rounded-full bg-gradient-to-br from-rose-400 to-purple-400 shadow-md border-2 border-white dark:border-dark"></div>
          <div className="text-left">
            <p className="font-bold text-lg text-charcoal dark:text-charcoal-dark">Emily R.</p>
            <p className="text-sm text-muted dark:text-muted-dark font-medium">New Mother</p>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-6 md:px-12 max-w-6xl mx-auto relative z-10 mb-20">
        <div className="relative rounded-[3rem] overflow-hidden bg-gradient-to-br from-charcoal to-[#1a1a1a] dark:from-[#2a2a2a] dark:to-[#1a1a1a] text-white py-20 px-8 text-center shadow-2xl">
          <div className="absolute top-0 right-0 w-96 h-96 bg-rose-deep/20 rounded-full blur-3xl -translate-y-1/2 translate-x-1/3"></div>
          <div className="absolute bottom-0 left-0 w-96 h-96 bg-purple-500/20 rounded-full blur-3xl translate-y-1/3 -translate-x-1/3"></div>
          
          <div className="relative z-10 max-w-2xl mx-auto">
            <h2 className="font-display text-4xl md:text-5xl font-bold mb-6 tracking-tight">Ready to start your guided journey?</h2>
            <p className="text-gray-300 text-lg mb-10">
              Join thousands of parents who use CARE to document, track, and celebrate their pregnancy.
            </p>
            <Link to="/register" className="inline-flex items-center gap-2 px-10 py-4 bg-white text-charcoal rounded-full font-bold text-lg hover:scale-105 transition-transform duration-300 shadow-xl shadow-white/10 no-underline">
              Create Free Account <ArrowRight size={20} />
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border/50 dark:border-border-dark/50 bg-white/30 dark:bg-[#1a1a1a]/30 backdrop-blur-sm relative z-10">
        <div className="max-w-7xl mx-auto px-6 md:px-12 py-12 flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 flex items-center justify-center bg-white dark:bg-[#2a2a2a] rounded-xl shadow-sm border border-border/50 dark:border-border-dark/50">
              <img src={careLogo} alt="Care Logo" className="w-6 h-6 opacity-90" />
            </div>
            <span className="font-display font-bold text-xl text-charcoal dark:text-charcoal-dark tracking-tight">CARE</span>
          </div>
          
          <div className="text-sm text-muted dark:text-muted-dark flex items-center gap-2 font-medium">
            Made with <Heart size={16} className="text-rose-deep fill-rose-deep animate-pulse" /> for expectant families
          </div>

          <div className="flex gap-8 text-sm text-muted dark:text-muted-dark font-medium">
            <Link to="#" className="hover:text-rose-deep transition-colors no-underline">Privacy</Link>
            <Link to="#" className="hover:text-rose-deep transition-colors no-underline">Terms</Link>
            <Link to="#" className="hover:text-rose-deep transition-colors no-underline">Contact</Link>
          </div>
        </div>
      </footer>
    </div>
  )
}