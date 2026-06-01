/**
 * ProfilePage — /profile
 *
 * Displays user profile details and allows editing nickname, about, and avatar.
 *
 * Backend endpoints used:
 *   GET    /api/profile/me/
 *   GET    /api/profile/my-code/
 *   PATCH  /api/profile/me/        — JSON: { nickname, about }
 *   PATCH  /api/profile/avatar/    — multipart/form-data: { avatar: <File> }
 *   DELETE /api/profile/avatar/
 *   DELETE /api/profile/unlink-partner/
 */

import React, { useState, useRef, useEffect } from 'react'
import {
  Camera, Edit3, Save, X, User, AtSign, Shield,
  Heart, Link2, Copy, CheckCheck, Unlink, Trash2,
} from 'lucide-react'
import { profileApi } from '../api/services'
import useAuthStore from '../store/authStore'
import { Card, Spinner, Alert } from '../components/ui/Card'
import Button from '../components/ui/Button'
import DashboardLayout from '../components/layout/DashboardLayout'

// ── Avatar ────────────────────────────────────────────────────────────────

function AvatarDisplay({ avatarUrl, name, size = 'lg' }) {
  const initials = (name || 'U')
    .split(' ')
    .map((n) => n[0])
    .join('')
    .toUpperCase()
    .slice(0, 2)

  const cls = size === 'lg'
    ? 'w-24 h-24 text-2xl ring-4 ring-rose-deep/20'
    : 'w-10 h-10 text-base ring-2 ring-rose-deep/15'

  return avatarUrl ? (
    <img
      src={avatarUrl}
      alt={name}
      className={`${cls} rounded-full object-cover`}
    />
  ) : (
    <div className={`${cls} rounded-full bg-gradient-to-br from-blush to-lavender flex items-center justify-center font-bold text-rose-deep`}>
      {initials}
    </div>
  )
}

// ── Info row ──────────────────────────────────────────────────────────────

function InfoRow({ icon: Icon, label, value, accent = 'bg-rose-deep/10 text-rose-deep' }) {
  return (
    <div className="flex items-start gap-3 py-3.5 border-b border-border dark:border-border-dark last:border-0">
      <div className={`mt-0.5 w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 ${accent}`}>
        <Icon size={15} />
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-[0.72rem] font-semibold text-muted dark:text-muted-dark uppercase tracking-widest mb-0.5">{label}</p>
        <p className="text-sm text-charcoal dark:text-charcoal-dark font-medium break-words">
          {value || <span className="text-muted dark:text-muted-dark italic font-normal">Not set</span>}
        </p>
      </div>
    </div>
  )
}

// ── Edit modal ────────────────────────────────────────────────────────────

function EditProfileModal({ profile, onClose, onSaved }) {
  const [form, setForm] = useState({
    nickname: profile?.nickname || '',
    about: profile?.about || '',
  })
  const [avatarFile, setAvatarFile] = useState(null)
  const [avatarPreview, setAvatarPreview] = useState(profile?.avatar_url || null)
  const [removeAvatar, setRemoveAvatar] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')
  const fileRef = useRef()

  const handleAvatarChange = (e) => {
    const file = e.target.files[0]
    if (!file) return
    setAvatarFile(file)
    setRemoveAvatar(false)
    setAvatarPreview(URL.createObjectURL(file))
  }

  const handleRemoveAvatar = () => {
    setAvatarFile(null)
    setAvatarPreview(null)
    setRemoveAvatar(true)
  }

  const handleSave = async () => {
    setIsLoading(true)
    setError('')
    try {
      // Step 1: delete avatar if user asked to remove it
      if (removeAvatar && profile?.avatar_url) {
        await profileApi.deleteAvatar()
      }
      // Step 2: upload new avatar if one was selected
      if (avatarFile) {
        await profileApi.uploadAvatar(avatarFile)
      }
      // Step 3: save text fields only if changed
      const payload = {}
      if (form.nickname !== (profile?.nickname || '')) payload.nickname = form.nickname
      if (form.about    !== (profile?.about    || '')) payload.about    = form.about
      if (Object.keys(payload).length > 0) {
        await profileApi.update(payload)
      }
      // Step 4: re-fetch so avatar_url is fresh from server
      const { data } = await profileApi.me()
      onSaved(data.data)
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to save. Please try again.')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div
      onClick={onClose}
      className="fixed inset-0 bg-dark/50 backdrop-blur-sm flex items-center justify-center z-[1000] p-3 sm:p-6"
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="bg-white dark:bg-dark border border-border dark:border-border-dark rounded-3xl w-full max-w-[480px] max-h-[90vh] overflow-y-auto shadow-lg animate-fade-up"
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 pt-6 pb-5 border-b border-border dark:border-border-dark">
          <h2 className="font-display text-[1.3rem] font-semibold text-charcoal dark:text-charcoal-dark">Edit Profile</h2>
          <button onClick={onClose} className="text-muted hover:text-charcoal dark:hover:text-charcoal-dark transition-colors p-1">
            <X size={20} />
          </button>
        </div>

        <div className="px-6 py-6 flex flex-col gap-5">
          {error && <Alert type="error">{error}</Alert>}

          {/* Avatar upload */}
          <div className="flex flex-col items-center gap-3">
            <div className="relative">
              <AvatarDisplay avatarUrl={avatarPreview} name={profile?.full_name} size="lg" />
              <button
                onClick={() => fileRef.current?.click()}
                className="absolute -bottom-1 -right-1 w-8 h-8 bg-rose-deep rounded-full flex items-center justify-center shadow-md hover:bg-mauve transition-colors"
                title="Upload photo"
              >
                <Camera size={14} color="white" />
              </button>
            </div>
            <input
              ref={fileRef}
              type="file"
              accept="image/jpeg,image/png,image/webp"
              onChange={handleAvatarChange}
              className="hidden"
            />
            <div className="flex items-center gap-3">
              <p className="text-xs text-muted dark:text-muted-dark">JPG, PNG, or WebP · max 2 MB</p>
              {(avatarPreview) && (
                <button
                  onClick={handleRemoveAvatar}
                  className="text-xs text-red-500 hover:text-red-600 flex items-center gap-1 transition-colors"
                >
                  <Trash2 size={11} /> Remove
                </button>
              )}
            </div>
          </div>

          {/* Nickname */}
          <div>
            <label className="block text-[0.72rem] font-semibold text-muted dark:text-muted-dark uppercase tracking-widest mb-2">
              Nickname
            </label>
            <input
              type="text"
              value={form.nickname}
              onChange={(e) => setForm({ ...form, nickname: e.target.value })}
              placeholder="Your nickname (optional)"
              maxLength={50}
              className="w-full px-4 py-2.5 rounded-[10px] border border-border dark:border-border-dark bg-[#FAF7F4] dark:bg-[#1B1B1B] text-sm text-charcoal dark:text-charcoal-dark placeholder:text-muted dark:placeholder:text-muted-dark focus:outline-none focus:border-rose-deep focus:ring-2 focus:ring-rose-deep/10 transition-all"
            />
          </div>

          {/* About */}
          <div>
            <label className="block text-[0.72rem] font-semibold text-muted dark:text-muted-dark uppercase tracking-widest mb-2">
              About
            </label>
            <textarea
              value={form.about}
              onChange={(e) => setForm({ ...form, about: e.target.value })}
              placeholder="Write a little something about yourself…"
              rows={4}
              maxLength={300}
              className="w-full px-4 py-2.5 rounded-[10px] border border-border dark:border-border-dark bg-[#FAF7F4] dark:bg-[#1B1B1B] text-sm text-charcoal dark:text-charcoal-dark placeholder:text-muted dark:placeholder:text-muted-dark focus:outline-none focus:border-rose-deep focus:ring-2 focus:ring-rose-deep/10 transition-all resize-none leading-relaxed"
            />
            <p className="text-[0.65rem] text-muted dark:text-muted-dark mt-1 text-right">{form.about.length}/300</p>
          </div>

          <div className="flex gap-3 pt-1">
            <Button variant="ghost" onClick={onClose} className="flex-1">Cancel</Button>
            <Button onClick={handleSave} isLoading={isLoading} className="flex-1">
              <Save size={15} />
              Save changes
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}

// ── Main page ─────────────────────────────────────────────────────────────

function ProfilePageContent() {
  const { profile, fetchProfile, setProfile } = useAuthStore()
  const [isLoading, setIsLoading] = useState(!profile)
  const [showEdit, setShowEdit] = useState(false)
  const [myCode, setMyCode] = useState('')
  const [copied, setCopied] = useState(false)
  const [unlinking, setUnlinking] = useState(false)
  const [msg, setMsg] = useState({ type: '', text: '' })

  useEffect(() => {
    const load = async () => {
      setIsLoading(true)
      await fetchProfile()
      try {
        const { data } = await profileApi.myCode()
        setMyCode(data.data?.unique_code || '')
      } catch {null}
      setIsLoading(false)
    }
    load()
  }, [])

  const copyCode = () => {
    navigator.clipboard.writeText(myCode || profile?.unique_code || '')
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const handleUnlink = async () => {
    if (!window.confirm('Unlink partner? Both accounts will lose the connection.')) return
    setUnlinking(true)
    setMsg({ type: '', text: '' })
    try {
      await profileApi.unlinkPartner()
      await fetchProfile()
      setMsg({ type: 'success', text: 'Partner unlinked successfully.' })
    } catch (err) {
      setMsg({ type: 'error', text: err.response?.data?.message || 'Failed to unlink.' })
    } finally {
      setUnlinking(false)
    }
  }

  const isPartner = profile?.role === 'husband'
  const roleBadge = isPartner
    ? 'bg-sage/20 text-[#3d7a56]'
    : 'bg-rose-deep/10 text-rose-deep'
  const roleIconAccent = isPartner
    ? 'bg-sage/15 text-[#3d7a56]'
    : 'bg-rose-deep/10 text-rose-deep'
  const roleLabel = isPartner ? '👨 Husband / Partner' : '🤰 Mother'

  if (isLoading) {
    return <div className="flex justify-center py-20"><Spinner size={36} /></div>
  }

  return (
    <div className="max-w-2xl animate-fade-up">
      {/* Page header */}
      <header className="mb-7">
        <p className="text-[0.72rem] font-semibold text-muted dark:text-muted-dark uppercase tracking-widest mb-1">Account</p>
        <h1 className="font-display text-4xl md:text-5xl font-bold text-charcoal dark:text-charcoal-dark tracking-tight">
          My Profile
        </h1>
      </header>

      {msg.text && (
        <div className="mb-5">
          <Alert type={msg.type === 'error' ? 'error' : 'success'}>{msg.text}</Alert>
        </div>
      )}

      {/* ── Profile card ── */}
      <Card className="mb-5">
        {/* Hero row — avatar + name + edit button */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-5 mb-6 pb-6 border-b border-border dark:border-border-dark">
          <AvatarDisplay avatarUrl={profile?.avatar_url} name={profile?.full_name} size="lg" />

          <div className="flex-1 min-w-0">
            <h2 className="font-display text-xl font-bold text-charcoal dark:text-charcoal-dark leading-tight">
              {profile?.full_name || 'Unknown User'}
            </h2>
            {profile?.nickname && (
              <p className="text-muted dark:text-muted-dark text-sm mt-0.5">@{profile.nickname}</p>
            )}
            <span className={`inline-block mt-2 px-3 py-1 rounded-full text-xs font-semibold ${roleBadge}`}>
              {roleLabel}
            </span>
          </div>

          <Button onClick={() => setShowEdit(true)} variant="secondary" size="sm" className="flex-shrink-0 self-start sm:self-auto">
            <Edit3 size={14} />
            Edit
          </Button>
        </div>

        {/* About bio */}
        {profile?.about && (
          <div className="mb-5 p-4 rounded-xl bg-[#FAF7F4] dark:bg-[#1B1B1B] border border-border dark:border-border-dark">
            <p className="text-[0.72rem] font-semibold text-muted dark:text-muted-dark uppercase tracking-widest mb-2">About</p>
            <p className="text-sm text-charcoal dark:text-charcoal-dark leading-relaxed">{profile.about}</p>
          </div>
        )}

        {/* Detail rows */}
        <div>
          <InfoRow
            icon={User}
            label="Full Name"
            value={profile?.full_name}
            accent={roleIconAccent}
          />
          {profile?.nickname && (
            <InfoRow
              icon={AtSign}
              label="Nickname"
              value={`@${profile.nickname}`}
              accent="bg-lavender/20 text-[#6b5a8a]"
            />
          )}
          <InfoRow
            icon={Shield}
            label="Role"
            value={profile?.role ? (profile.role === 'mother' ? 'Mother' : 'Husband / Partner') : undefined}
            accent={roleIconAccent}
          />
          {profile?.role === 'mother' && profile?.due_date && (
            <InfoRow
              icon={Heart}
              label="Due Date"
              value={profile.due_date}
              accent="bg-rose-deep/10 text-rose-deep"
            />
          )}
        </div>
      </Card>

      {/* ── Partner connection card ── */}
      <Card>
        <h3 className="font-display text-base font-semibold text-charcoal dark:text-charcoal-dark mb-5 flex items-center gap-2">
          <Link2 size={16} className="text-rose-deep" />
          Partner Connection
        </h3>

        {/* Invite code row - only show if not linked */}
       {!profile?.partner && (
         <div className="mb-5">
           <p className="text-[0.72rem] font-semibold text-muted dark:text-muted-dark uppercase tracking-widest mb-2">My Invite Code</p>
           <div className="flex items-center gap-2">
             <div className="flex-1 px-4 py-2.5 rounded-[10px] bg-[#FAF7F4] dark:bg-[#1B1B1B] border border-border dark:border-border-dark font-mono text-sm font-bold text-rose-deep tracking-widest">
                {myCode || profile?.unique_code || '—'}
              </div>
              <button
                onClick={copyCode}
                className="flex items-center gap-1.5 px-3.5 py-2.5 rounded-[10px] border border-border dark:border-border-dark bg-white dark:bg-dark text-sm text-muted dark:text-muted-dark hover:text-rose-deep hover:border-rose-deep/40 transition-all"
              >
                {copied ? <CheckCheck size={14} className="text-sage" /> : <Copy size={14} />}
               {copied ? 'Copied!' : 'Copy'}
             </button>
           </div>
          </div>
        )}

        {/* Linked partner or empty state */}
        {profile?.partner ? (
          <div className="p-4 rounded-xl bg-sage/10 dark:bg-sage/5 border border-sage/20 dark:border-sage/15">
            <div className="flex items-center justify-between flex-wrap gap-3">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-sage to-sage-light flex items-center justify-center font-bold text-sm text-white uppercase">
                  {(profile.partner.full_name || 'P')[0]}
                </div>
                <div>
                  <p className="font-semibold text-sm text-charcoal dark:text-charcoal-dark">{profile.partner.full_name}</p>
                  <p className="text-xs text-muted dark:text-muted-dark">Partner · {profile.partner.unique_code}</p>
                </div>
              </div>
              <button
                onClick={handleUnlink}
                disabled={unlinking}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium text-red-500 border border-red-200 dark:border-red-800/50 hover:bg-red-50 dark:hover:bg-red-950/30 transition-colors disabled:opacity-50"
              >
                <Unlink size={12} />
                {unlinking ? 'Unlinking…' : 'Unlink'}
              </button>
            </div>
          </div>
        ) : (
          <div className="p-5 rounded-xl bg-[#FAF7F4] dark:bg-[#1B1B1B] border border-border dark:border-border-dark text-center">
            <p className="text-sm text-muted dark:text-muted-dark">No partner linked yet.</p>
            <p className="text-xs text-muted dark:text-muted-dark mt-1 opacity-70">Share your invite code on the Dashboard to connect.</p>
          </div>
        )}
      </Card>

      {/* Edit modal */}
      {showEdit && (
        <EditProfileModal
          profile={profile}
          onClose={() => setShowEdit(false)}
          onSaved={(updated) => {
            setProfile(updated)
            setShowEdit(false)
          }}
        />
      )}
    </div>
  )
}

export default function ProfilePage() {
  return (
    <DashboardLayout activePage="profile">
      <ProfilePageContent />
    </DashboardLayout>
  )
}