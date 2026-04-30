import React from 'react'

export function Card({ children, className = '', hover = false, onClick }) {
  return (
    <div
      onClick={onClick}
      className={[
        'bg-white rounded-2xl border border-border shadow-sm p-6 transition-all duration-200',
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
          <p className="text-[1.9rem] font-bold text-charcoal leading-none">{value ?? '—'}</p>
          {subtext && <p className="text-[0.75rem] text-muted mt-1">{subtext}</p>}
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
  const styles = {
    error:   'bg-red-50 border border-red-200 text-red-800',
    success: 'bg-green-50 border border-green-200 text-green-800',
    info:    'bg-blue-50 border border-blue-200 text-blue-800',
  }
  return (
    <div className={`px-4 py-3 rounded-[10px] text-sm ${styles[type] ?? styles.error}`}>
      {children}
    </div>
  )
}

export function EmptyState({ icon: Icon, title, description, action }) {
  return (
    <div className="text-center py-12 px-6 text-muted">
      {Icon && (
        <div className="w-14 h-14 rounded-full bg-border flex items-center justify-center mx-auto mb-4 text-muted-light">
          <Icon size={24} />
        </div>
      )}
      <p className="font-semibold text-charcoal mb-1.5">{title}</p>
      {description && <p className="text-sm max-w-[280px] mx-auto mb-5">{description}</p>}
      {action}
    </div>
  )
}

export function Modal({ isOpen, onClose, title, children }) {
  if (!isOpen) return null
  return (
    <div
      onClick={onClose}
      className="fixed inset-0 bg-dark/50 backdrop-blur-sm flex items-center justify-center z-[1000] p-6"
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="bg-white rounded-3xl p-8 w-full max-w-[520px] max-h-[90vh] overflow-y-auto shadow-lg animate-fade-up"
      >
        {title && (
          <h2 className="font-display text-[1.4rem] font-semibold text-charcoal mb-6">{title}</h2>
        )}
        {children}
      </div>
    </div>
  )
}