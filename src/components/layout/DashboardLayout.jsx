import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import {
LayoutDashboard, BookOpen, Calendar, BarChart3, Users, LogOut,  Menu, X, UserCircle
} from 'lucide-react'
import useAuthStore from '../../store/authStore'
import ThemeToggle from '../ui/ThemeToggle'
import { MessageInboxPopup } from '../PartnerMessage'
import careLogo from '/CARE.svg'

function NavItem({ icon, label, active = false, onClick }) {
return (
    <button
    onClick={onClick}
    className={`w-full flex items-center gap-4 px-6 py-4 rounded-2xl font-bold text-sm transition-all ${
        active ? 'bg-rose-deep text-white shadow-lg shadow-rose-deep/20' : 'text-muted dark:text-muted-dark hover:bg-black/5 dark:hover:bg-white/5'
    }`}
    >
    {icon}
    {label}
    </button>
)
}

export default function DashboardLayout({ children, activePage = 'dashboard' }) {
const navigate = useNavigate()
const profile = useAuthStore((state) => state.profile)
const fetchProfile = useAuthStore((state) => state.fetchProfile)
const logout = useAuthStore((state) => state.logout)
const [sidebarOpen, setSidebarOpen] = useState(false)

const isPartner = profile?.role === 'husband'

useEffect(() => {
    fetchProfile()
}, [])

// Close sidebar on navigate (important on mobile)
const handleNav = (path) => {
    navigate(path)
    setSidebarOpen(false)
  }

return (
    <div className="min-h-screen bg-cream dark:bg-cream-dark font-sans">

      {/* NAVBAR */}
    <nav className="fixed top-0 left-0 right-0 bg-cream/90 dark:bg-dark/90 backdrop-blur-md border-b border-border dark:border-border-dark z-50 px-8 md:px-10 flex items-center justify-between h-16">
        <div className="flex items-center gap-3">
          {/* RESPONSIVE FIX R1: hamburger button — only visible on mobile */}
          <button
            onClick={() => setSidebarOpen(true)}
            className="md:hidden p-2 rounded-[10px] border border-border dark:border-border-dark text-charcoal dark:text-charcoal-dark hover:border-rose-deep/40 transition-colors"
            aria-label="Open menu"
          >
            <Menu size={20} />
          </button>

          <div className="flex items-center gap-2">
            <img src={careLogo} alt="Care Logo" className="w-auto h-12 md:h-14" />
            <span className="font-display font-bold text-lg md:text-xl text-charcoal dark:text-charcoal-dark">CARE</span>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <MessageInboxPopup />
          <ThemeToggle />
        </div>
    </nav>

    {/* RESPONSIVE FIX R1: mobile overlay backdrop — shown when sidebar is open */}
      {sidebarOpen && (
        <div
          onClick={() => setSidebarOpen(false)}
          className="fixed inset-0 bg-dark/40 backdrop-blur-sm z-30 md:hidden"
          aria-hidden="true"
        />
      )}

      <div className="flex pt-16">

        {/* SIDEBAR
            RESPONSIVE FIX R1:
            - Mobile: fixed drawer, slides in/out via translate-x, sits over content
            - Desktop (md+): sticky column, always visible, normal flow
        */}
        <aside
          className={[
            'fixed top-16 left-0 z-40 h-[calc(100vh-4rem)] w-[260px]',
            'bg-white dark:bg-dark border-r border-border dark:border-border-dark',
            'flex flex-col',
            'transition-transform duration-300 ease-in-out',
            // On md+: reset position to sticky and always translate-x-0
            'md:sticky md:translate-x-0 md:z-auto',
            // On mobile: off-canvas by default, slide in when open
            sidebarOpen ? 'translate-x-0' : '-translate-x-full',
          ].join(' ')}
        >
          {/* Close button — only shown on mobile */}
          <button
            onClick={() => setSidebarOpen(false)}
            className="md:hidden absolute top-3 right-3 p-1.5 rounded-full text-muted hover:text-charcoal dark:hover:text-charcoal-dark transition-colors"
            aria-label="Close menu"
          >
            <X size={18} />
          </button>

          <div>
            {/* PROFILE */}
            <div
              className="px-8 py-10 border-b border-border dark:border-border-dark cursor-pointer hover:bg-black/3 dark:hover:bg-white/3 transition-colors"
              onClick={() => handleNav('/profile')}
              title="View profile"
            >
              <div className="flex items-center gap-4">
                {profile?.avatar_url ? (
                  <img
                    src={profile.avatar_url}
                    alt={profile.full_name}
                    className="w-12 h-12 rounded-full object-cover border-2 border-rose-deep/20 shadow-sm"
                  />
                ) : (
                  <div className="w-12 h-12 rounded-full bg-rose-deep/10 flex items-center justify-center font-bold text-rose-deep text-lg border-2 border-rose-deep/20 shadow-sm uppercase">
                    {profile?.full_name?.charAt(0) || 'U'}
                  </div>
                )}
                <div>
                  <h3 className="font-bold text-charcoal dark:text-charcoal-dark text-sm leading-none">
                    {profile?.full_name || 'User'}
                  </h3>
                  <span className="inline-block px-2 py-1 bg-rose-deep/5 text-rose-deep text-[10px] font-bold rounded-full mt-2 uppercase tracking-wider">
                    {isPartner ? '👨 Partner' : '🤰 Mother'}
                  </span>
                </div>
              </div>
            </div>

            {/* NAVIGATION */}
            <nav className="p-4 space-y-1">
              <NavItem icon={<LayoutDashboard size={20} />} label="Dashboard"    active={activePage === 'dashboard'}    onClick={() => handleNav('/dashboard')} />
              <NavItem icon={<BookOpen size={20} />}        label="Daily Log"    active={activePage === 'logs'}         onClick={() => handleNav('/logs')} />
              <NavItem icon={<Calendar size={20} />}        label="Appointments" active={activePage === 'appointments'} onClick={() => handleNav('/appointments')} />
              <NavItem icon={<BarChart3 size={20} />}       label="My Stats"     active={activePage === 'stats'}        onClick={() => handleNav('/stats')} />
              <NavItem icon={<Users size={20} />}           label="Partner Stats"active={activePage === 'partner-stats'}onClick={() => handleNav('/partner-stats')} />
              <NavItem icon={<UserCircle size={20} />}      label="My Profile"  active={activePage === 'profile'}      onClick={() => handleNav('/profile')} />
            </nav>
          </div>

          {/* LOGOUT */}
          <div className="mt-auto p-6 border-t border-border dark:border-border-dark">
            <button
              onClick={async () => { await logout(); navigate('/') }}
              className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-muted dark:text-muted-dark hover:text-rose-deep hover:bg-rose-deep/5 transition-all font-semibold text-sm"
            >
              <LogOut size={18} />
              Sign out
            </button>
          </div>
        </aside>

        {/* MAIN CONTENT
            RESPONSIVE FIX R2: p-10 → p-4 sm:p-6 lg:p-10 so mobile isn't cramped.
            min-w-0 prevents flex children from overflowing the container.
        */}
        <main className="flex-1 p-4 sm:p-6 lg:p-10 overflow-y-auto min-w-0">
          {children}
        </main>

      </div>
    </div>
  )
}