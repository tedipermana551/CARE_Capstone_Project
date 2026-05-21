import React, { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import {
LayoutDashboard, BookOpen, Calendar, BarChart3, Users, LogOut
} from 'lucide-react'
import useAuthStore from '../../store/authStore'
import useThemeStore from '../../store/themeStore'
import ThemeToggle from '../ui/ThemeToggle'
import careLogo from '/CARE.svg'

function NavItem({ icon, label, active = false, onClick }) {
return (
    <button
    onClick={onClick}
    className={`w-full flex items-center gap-4 px-6 py-4 rounded-2xl font-bold text-sm transition-all ${
        active ? 'bg-rose-deep text-white shadow-lg shadow-rose-deep/20' : 'text-muted dark:text-muted-dark hover:bg-black/5'
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
const initializeTheme = useThemeStore((state) => state.initializeTheme)

const isPartner = profile?.role === 'husband'

useEffect(() => {
    fetchProfile()
    initializeTheme()
}, [])

return (
    <div className="min-h-screen bg-[#FDF8F3] dark:bg-dark font-sans">

      {/* NAVBAR */}
    <nav className="fixed top-0 left-0 right-0 bg-[#FDF8F3]/90 dark:bg-dark/90 backdrop-blur-md border-b border-border dark:border-border-dark z-50 px-8 md:px-10 flex items-center justify-between h-16">
        <div className="flex items-center gap-2.5">
        <img src={careLogo} alt="Care Logo" className="w-auto h-14" />
        <span className="font-display font-bold text-xl text-charcoal dark:text-charcoal-dark">CARE</span>
        </div>
        <ThemeToggle />
    </nav>

    <div className="flex pt-16">

        {/* SIDEBAR */}
        <aside className="w-[260px] bg-white dark:bg-dark border-r border-border dark:border-border-dark flex flex-col sticky top-16 h-[calc(100vh-4rem)]">
        <div>
            {/* PROFILE */}
            <div className="px-8 py-10 border-b border-border dark:border-border-dark">
            <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-full bg-rose-deep/10 flex items-center justify-center font-bold text-rose-deep text-lg border-2 border-rose-deep/20 shadow-sm uppercase">
                {profile?.full_name?.charAt(0) || 'U'}
                </div>
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
            <NavItem icon={<LayoutDashboard size={20} />} label="Dashboard" active={activePage === 'dashboard'} onClick={() => navigate('/dashboard')} />
            <NavItem icon={<BookOpen size={20} />} label="Daily Log" active={activePage === 'logs'} onClick={() => navigate('/logs')} />
            <NavItem icon={<Calendar size={20} />} label="Appointments" active={activePage === 'appointments'} onClick={() => navigate('/appointments')} />
            <NavItem icon={<BarChart3 size={20} />} label="My Stats" active={activePage === 'stats'} onClick={() => navigate('/stats')} />
            <NavItem icon={<Users size={20} />} label="Partner Stats" active={activePage === 'partner-stats'} onClick={() => navigate('/partner-stats')} />
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

        {/* MAIN CONTENT */}
        <main className="flex-1 p-10 overflow-y-auto">
        {children}
        </main>

    </div>
    </div>
)
}