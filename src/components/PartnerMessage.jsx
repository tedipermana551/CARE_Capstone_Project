/**
 * PartnerMessage components
 * ─────────────────────────────────────────────────────────────────────────
 * Messages live inside DailyLog.partner_message — NOT a standalone endpoint.
 *
 * Reading  → GET /api/logs/partner/messages/
 *            Items: { id, date, mood, partner_message, has_message,
 *                     sender_display_name, sender_nickname, ... }
 *
 * Sending  → PATCH /api/logs/<today>/ { partner_message: text }
 *            (or POST if no log exists yet today)
 *
 * Exports:
 *   MessageInboxPopup  — bell icon button in DashboardLayout navbar
 *   SendMessageWidget  — compose card on the Dashboard page
 */

import React, { useState, useEffect, useRef } from 'react'
import { Send, MessageCircle, X, Heart, Inbox } from 'lucide-react'
import { messageApi } from '../api/services'
import { Spinner } from './ui/Card'
import Button from './ui/Button'
import { format, parseISO } from 'date-fns'
import useAuthStore from '../store/authStore'

// ── Helpers ───────────────────────────────────────────────────────────────

function safeDate(dateStr) {
  try { return dateStr ? format(parseISO(dateStr), 'MMM d') : '' }
  catch { return '' }
}

// ── Message bubble ────────────────────────────────────────────────────────

function MessageBubble({ item }) {
  const text   = item.partner_message || ''
  const date   = item.date || item.created_at || ''
  const sender = item.sender_display_name || item.sender_nickname || 'Partner'

  return (
    <div className="flex flex-col items-start mb-4 last:mb-0">
      <p className="text-[0.65rem] text-muted dark:text-muted-dark mb-1 px-1">
        {sender} · {safeDate(date)}
      </p>
      <div className="max-w-[90%] px-4 py-2.5 rounded-2xl rounded-bl-sm bg-[#FAF7F4] dark:bg-[#1B1B1B] border border-border dark:border-border-dark text-sm text-charcoal dark:text-charcoal-dark leading-relaxed">
        {text}
      </div>
    </div>
  )
}

// ── Inbox popup (used in DashboardLayout navbar) ──────────────────────────

export function MessageInboxPopup() {
  const { profile } = useAuthStore()
  const [open, setOpen]               = useState(false)
  const [messages, setMessages]       = useState([])
  const [isLoading, setIsLoading]     = useState(false)
  const [fetchedOnce, setFetchedOnce] = useState(false)
  const popupRef = useRef()

  const fetchMessages = async () => {
    setIsLoading(true)
    try {
      const { data } = await messageApi.inbox()
      setMessages(Array.isArray(data.data) ? data.data.filter(m => m.partner_message) : [])
    } catch {
      setMessages([])
    } finally {
      setIsLoading(false)
      setFetchedOnce(true)
    }
  }

  // Poll every 30 s while partner is linked
  useEffect(() => {
    if (!profile?.partner) return
    fetchMessages()
    const interval = setInterval(fetchMessages, 30_000)
    return () => clearInterval(interval)
  }, [profile?.partner])

  // Close on outside click
  useEffect(() => {
    const handler = (e) => {
      if (popupRef.current && !popupRef.current.contains(e.target)) setOpen(false)
    }
    document.addEventListener('mousedown', handler)
    return () => document.removeEventListener('mousedown', handler)
  }, [])

  // Only render when partner is linked
  if (!profile?.partner) return null

  const handleOpen = () => {
    setOpen((o) => {
      if (!o && !fetchedOnce) fetchMessages()
      return !o
    })
  }

  const unreadCount = messages.length

  return (
    <div className="relative" ref={popupRef}>
      {/* Bell button */}
      <button
        onClick={handleOpen}
        className="relative flex items-center gap-1.5 px-3 py-2 rounded-[10px] border border-border dark:border-border-dark bg-white dark:bg-dark hover:border-rose-deep/40 text-muted dark:text-muted-dark hover:text-rose-deep transition-all duration-200"
        title="Messages from partner"
      >
        <MessageCircle size={16} />
        <span className="text-xs font-medium hidden sm:inline">Messages</span>
        {unreadCount > 0 && (
          <span className="absolute -top-1.5 -right-1.5 min-w-[1rem] h-4 px-0.5 rounded-full bg-rose-deep text-white text-[0.6rem] font-bold flex items-center justify-center">
            {unreadCount > 9 ? '9+' : unreadCount}
          </span>
        )}
      </button>

      {/* Dropdown */}
      {open && (
        <div className="absolute right-0 top-full mt-2 w-80 bg-white dark:bg-dark rounded-2xl border border-border dark:border-border-dark shadow-xl z-[500] animate-fade-up overflow-hidden">
          {/* Header */}
          <div className="flex items-center justify-between px-4 py-3 border-b border-border dark:border-border-dark">
            <div className="flex items-center gap-2">
              <Heart size={14} className="text-rose-deep" fill="currentColor" />
              <span className="text-sm font-semibold text-charcoal dark:text-charcoal-dark">
                Notes from {profile.partner?.full_name?.split(' ')[0] || 'Partner'}
              </span>
            </div>
            <button
              onClick={() => setOpen(false)}
              className="text-muted hover:text-charcoal dark:hover:text-charcoal-dark transition-colors"
            >
              <X size={16} />
            </button>
          </div>

          {/* Message list */}
          <div className="max-h-72 overflow-y-auto px-4 py-3">
            {isLoading ? (
              <div className="flex justify-center py-6">
                <Spinner size={24} />
              </div>
            ) : messages.length === 0 ? (
              <div className="text-center py-8">
                <Inbox size={28} className="text-muted dark:text-muted-dark mx-auto mb-2 opacity-50" />
                <p className="text-sm text-muted dark:text-muted-dark">No messages yet.</p>
                <p className="text-xs text-muted dark:text-muted-dark mt-1 opacity-70">
                  Your partner hasn't sent a note yet.
                </p>
              </div>
            ) : (
              messages.map((m) => <MessageBubble key={m.id} item={m} />)
            )}
          </div>
        </div>
      )}
    </div>
  )
}