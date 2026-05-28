import React from 'react'

export function Card({ children, className = '', hover = false, onClick }) {
  return (
    <div
      onClick={onClick}
      className={[
        'bg-white dark:bg-dark rounded-2xl border border-border dark:border-border-dark shadow-sm p-6 transition-all duration-200',
        hover ? 'hover:-translate-y-0.5 hover:shadow-md cursor-pointer' : '',
        onClick ? 'cursor-pointer' : '',
        className,
      ].join(' ')}
    >
      {children}
    </div>
  )
}

export function StatCard({ label, value, icon: Icon, color = '#e8899a', subtext }) {
  return (
    <Card className="!p-5">
      <div className="flex justify-between items-start">
        <div>
          <p className="text-[0.72rem] font-semibold text-muted uppercase tracking-widest mb-1.5">{label}</p>
          {/* FIX: was "text-charcoal" only — missing "dark:text-charcoal-dark" → value text was dark in dark mode */}
          <p className="text-[1.9rem] font-bold text-charcoal dark:text-charcoal-dark leading-none">{value ?? '—'}</p>
          {subtext && <p className="text-[0.75rem] text-muted dark:text-muted-dark mt-1">{subtext}</p>}
        </div>
        {Icon && (
          <div
            className="w-11 h-11 rounded-xl flex items-center justify-center flex-shrink-0"
            style={{ background: `${color}20`, color }}
          >
            <Icon size={20} />
          </div>
        )}
      </div>
    </Card>
  )
}

export function Badge({ children, variant = 'rose', className = '' }) {
  const styles = {
    rose:     'bg-rose/15 text-rose-deep',
    sage:     'bg-sage/15 text-[#3d7a56]',
    amber:    'bg-amber/15 text-[#a67c00]',
    muted:    'bg-charcoal/7 text-muted',
    lavender: 'bg-lavender/20 text-[#6b5a8a]',
  }
  return (
    <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[0.72rem] font-semibold ${styles[variant] ?? styles.muted} ${className}`}>
      {children}
    </span>
  )
}

export function Spinner({ size = 24, className = '' }) {
  return (
    <div
      className={`rounded-full border-[2.5px] border-rose/20 border-t-rose animate-spin ${className}`}
      style={{ width: size, height: size }}
    />
  )
}

export function Divider({ className = '' }) {
  return <div className={`h-px bg-border ${className}`} />
}

export function Alert({ type = 'error', children }) {
  // FIX: All variants used hardcoded light-mode Tailwind colors with no dark: alternatives.
  // In dark mode the alert was unreadable (light background, dark text on dark page).
  const styles = {
    error:   'bg-red-50 dark:bg-red-950/40 border border-red-200 dark:border-red-800 text-red-800 dark:text-red-300',
    success: 'bg-green-50 dark:bg-green-950/40 border border-green-200 dark:border-green-800 text-green-800 dark:text-green-300',
    info:    'bg-blue-50 dark:bg-blue-950/40 border border-blue-200 dark:border-blue-800 text-blue-800 dark:text-blue-300',
  }
  return (
    <div className={`px-4 py-3 rounded-[10px] text-sm ${styles[type] ?? styles.error}`}>
      {children}
    </div>
  )
}

export function EmptyState({ icon: Icon, title, description, action }) {
  return (
    <div className="text-center py-12 px-6 text-muted dark:text-muted-dark">
      {Icon && (
        <div className="w-14 h-14 rounded-full bg-border dark:bg-border-dark flex items-center justify-center mx-auto mb-4 text-muted-light">
          <Icon size={24} />
        </div>
      )}
      <p className="font-semibold text-charcoal dark:text-charcoal-dark mb-1.5">{title}</p>
      {description && <p className="text-sm max-w-[280px] mx-auto mb-5 text-muted dark:text-muted-dark">{description}</p>}
      {action}
    </div>
  )
}

export function Modal({ isOpen, onClose, title, children }) {
  if (!isOpen) return null
  return (
    <div
      onClick={onClose}
      className="fixed inset-0 bg-dark/50 backdrop-blur-sm flex items-center justify-center z-[1000] p-3 sm:p-6"
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="bg-white dark:bg-dark border border-border dark:border-border-dark rounded-2xl sm:rounded-3xl p-5 sm:p-8 w-full max-w-[520px] max-h-[90vh] overflow-y-auto shadow-lg animate-fade-up"
      >
        {title && (
          <h2 className="font-display text-[1.4rem] font-semibold text-charcoal dark:text-charcoal-dark mb-6">{title}</h2>
        )}
        {children}
      </div>
    </div>
  )
}
