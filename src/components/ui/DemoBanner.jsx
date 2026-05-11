import React, { useState } from 'react'
import { FlaskConical, X, ChevronDown, ChevronUp } from 'lucide-react'

const useMock = import.meta.env.VITE_USE_MOCK === 'true'

const ACCOUNTS = [
  {
    role: 'mother',
    name: 'Sarah Johnson',
    email: 'sarah@demo.com',
    password: 'any password',
    emoji: '🤱',
    note: 'Mother · 28 weeks pregnant',
  },
  {
    role: 'husband',
    name: 'James Johnson',
    email: 'james@demo.com',
    password: 'any password',
    emoji: '👨',
    note: 'Husband · Partner account',
  },
]

export default function DemoBanner() {
  const [dismissed, setDismissed] = useState(false)
  const [expanded, setExpanded] = useState(false)

  if (!useMock || dismissed) return null

  return (
    <div className="fixed bottom-4 left-1/2 -translate-x-1/2 z-[999] w-[min(480px,90vw)] shadow-lg">
      {/* Main bar */}
      <div className="flex items-center gap-3 px-4 py-3 bg-charcoal text-white rounded-2xl text-sm font-medium">
        <FlaskConical size={15} className="text-streak flex-shrink-0" />
        <span className="flex-1">
          <span className="text-streak font-semibold">Demo mode</span>
          {' '}— use any password with the emails below
        </span>
        <button
          onClick={() => setExpanded((v) => !v)}
          className="text-white/60 hover:text-white transition-colors cursor-pointer flex items-center gap-1 text-xs"
        >
          Accounts {expanded ? <ChevronDown size={13} /> : <ChevronUp size={13} />}
        </button>
        <button
          onClick={() => setDismissed(true)}
          className="text-white/50 hover:text-white transition-colors cursor-pointer ml-1"
        >
          <X size={14} />
        </button>
      </div>

      {/* Expandable accounts panel */}
      {expanded && (
        <div className="mt-1.5 bg-warm-white rounded-2xl border border-border shadow-md overflow-hidden">
          {ACCOUNTS.map((acc, i) => (
            <div
              key={acc.role}
              className={`px-4 py-3.5 ${i < ACCOUNTS.length - 1 ? 'border-b border-stroke' : ''}`}
            >
              <div className="flex items-center gap-2.5 mb-1.5">
                <span className="text-xl">{acc.emoji}</span>
                <div>
                  <p className="font-semibold text-charcoal text-sm">{acc.name}</p>
                  <p className="text-xs text-muted">{acc.note}</p>
                </div>
              </div>
              <div className="flex gap-3 ml-9">
                <div>
                  <p className="text-[0.65rem] font-semibold text-muted uppercase tracking-wider mb-0.5">Email</p>
                  <code className="text-xs bg-cream px-2 py-0.5 rounded text-charcoal font-mono">{acc.email}</code>
                </div>
                <div>
                  <p className="text-[0.65rem] font-semibold text-muted uppercase tracking-wider mb-0.5">Password</p>
                  <code className="text-xs bg-cream px-2 py-0.5 rounded text-muted font-mono">{acc.password}</code>
                </div>
                {acc.role === 'husband' && (
                  <div>
                    <p className="text-[0.65rem] font-semibold text-muted uppercase tracking-wider mb-0.5">Partner code</p>
                    <code className="text-xs bg-cream px-2 py-0.5 rounded text-rose-deep font-mono tracking-wider">SARAH42</code>
                  </div>
                )}
                {acc.role === 'mother' && (
                  <div>
                    <p className="text-[0.65rem] font-semibold text-muted uppercase tracking-wider mb-0.5">Partner code</p>
                    <code className="text-xs bg-cream px-2 py-0.5 rounded text-rose-deep font-mono tracking-wider">JAMES99</code>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
