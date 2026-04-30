import React from 'react'

const base =
  'inline-flex items-center justify-center gap-2 font-medium rounded-[10px] transition-all duration-200 disabled:opacity-55 disabled:cursor-not-allowed cursor-pointer'

const variants = {
  primary:   'bg-rose-deep text-white hover:bg-mauve border-0',
  secondary: 'bg-transparent text-rose-deep border border-rose-deep hover:bg-rose-deep/5',
  ghost:     'bg-transparent text-muted hover:bg-charcoal/5 border-0',
  sage:      'bg-sage text-white hover:opacity-90 border-0',
  danger:    'bg-transparent text-red-700 border border-red-700 hover:bg-red-700/5',
}

const sizes = {
  sm: 'px-3.5 py-1.5 text-xs',
  md: 'px-5 py-2.5 text-sm',
  lg: 'px-8 py-3.5 text-base',
}

export default function Button({
  children,
  variant = 'primary',
  size = 'md',
  fullWidth = false,
  isLoading = false,
  disabled = false,
  onClick,
  type = 'button',
  className = '',
  ...props
}) {
  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled || isLoading}
      className={[
        base,
        variants[variant] ?? variants.primary,
        sizes[size] ?? sizes.md,
        fullWidth ? 'w-full' : '',
        className,
      ].join(' ')}
      {...props}
    >
      {isLoading ? (
        <>
          <span className="w-3.5 h-3.5 border-2 border-current border-t-transparent rounded-full animate-spin" />
          Loading…
        </>
      ) : children}
    </button>
  )
}