import React from 'react'

const baseInput =
  'w-full rounded-[10px] border border-border bg-white text-charcoal text-sm px-3.5 py-2.5 transition-all duration-200 outline-none focus:border-rose focus:ring-2 focus:ring-rose/15 placeholder:text-muted-light'

export default function Input({ label, error, hint, icon: Icon, type = 'text', className = '', containerClassName = '', ...props }) {
  return (
    <div className={`flex flex-col gap-1.5 ${containerClassName}`}>
      {label && (
        <label className="text-[0.75rem] font-semibold text-muted uppercase tracking-widest">
          {label}
        </label>
      )}
      <div className="relative">
        {Icon && (
          <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-muted-light flex pointer-events-none">
            <Icon size={15} />
          </span>
        )}
        <input
          type={type}
          className={[
            baseInput,
            Icon ? 'pl-10' : '',
            error ? '!border-red-500 !ring-red-200' : '',
            className,
          ].join(' ')}
          {...props}
        />
      </div>
      {error && <span className="text-[0.75rem] text-red-600">{error}</span>}
      {hint && !error && <span className="text-[0.75rem] text-muted">{hint}</span>}
    </div>
  )
}

export function Textarea({ label, error, hint, className = '', ...props }) {
  return (
    <div className="flex flex-col gap-1.5">
      {label && (
        <label className="text-[0.75rem] font-semibold text-muted uppercase tracking-widest">
          {label}
        </label>
      )}
      <textarea
        rows={3}
        className={[
          baseInput,
          'resize-y leading-relaxed',
          error ? '!border-red-500 !ring-red-200' : '',
          className,
        ].join(' ')}
        {...props}
      />
      {error && <span className="text-[0.75rem] text-red-600">{error}</span>}
      {hint && !error && <span className="text-[0.75rem] text-muted">{hint}</span>}
    </div>
  )
}

export function Select({ label, error, children, className = '', ...props }) {
  return (
    <div className="flex flex-col gap-1.5">
      {label && (
        <label className="text-[0.75rem] font-semibold text-muted uppercase tracking-widest">
          {label}
        </label>
      )}
      <select
        className={[
          baseInput,
          'appearance-none pr-9',
          error ? '!border-red-500' : '',
          className,
        ].join(' ')}
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 12 12'%3E%3Cpath fill='%238a7880' d='M6 8L1 3h10z'/%3E%3C/svg%3E")`,
          backgroundRepeat: 'no-repeat',
          backgroundPosition: 'right 14px center',
        }}
        {...props}
      >
        {children}
      </select>
      {error && <span className="text-[0.75rem] text-red-600">{error}</span>}
    </div>
  )
}