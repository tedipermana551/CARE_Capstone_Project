import { Moon, Sun } from 'lucide-react'
import useThemeStore from '../../store/themeStore'

export default function ThemeToggle() {
const toggleTheme = useThemeStore((state) => state.toggleTheme)
const isDarkMode = useThemeStore((state) => state.isDarkMode)

return (
    <button
    onClick={toggleTheme}
    className="p-2 rounded-[10px] border border-border dark:border-border-dark text-charcoal dark:text-charcoal-dark hover:border-rose dark:hover:border-rose-dark transition-colors"
    aria-label="Toggle theme"
    >
    {isDarkMode ? <Sun size={16} /> : <Moon size={16} />}
    </button>
)
}