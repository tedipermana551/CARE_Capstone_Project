import { Link } from 'react-router-dom'
import { Heart } from 'lucide-react'
import careLogo from '/CARE.svg'
import ThemeToggle from '../ui/ThemeToggle'

export default function AppLayout({ children }) {
return (
    <div className="min-h-screen bg-cream dark:bg-cream-dark transition-colors duration-300">

      {/* Navbar */}
    <nav className="fixed top-0 left-0 right-0 bg-cream/90 dark:bg-cream-dark/90 backdrop-blur-md border-b border-border dark:border-border-dark z-50 px-8 md:px-10 flex items-center justify-between h-16">

        <Link
        to="/"
        className="flex items-center gap-2.5 no-underline"
        >
        <img
            src={careLogo}
            alt="CARE Logo"
            className="w-auto h-14"
        />

        <span className="font-display font-bold text-xl text-charcoal dark:text-charcoal-dark">
            CARE
        </span>
        </Link>

        <ThemeToggle />
    </nav>

      {/* Content */}
    <main className="pt-20">
        {children}
    </main>

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