import React, { useState, useEffect, useCallback } from 'react'
import { format, parseISO } from 'date-fns'
import { Plus, Moon, Dumbbell, Pencil, Trash2, Save, BookOpen, Send } from 'lucide-react'
import { logsApi } from '../api/services'
import useAuthStore from '../store/authStore'
import { Card, Badge, Spinner, EmptyState, Alert, Modal } from '../components/ui/Card'
import Button from '../components/ui/Button'
import Input, { Textarea, Select } from '../components/ui/Input'
import DashboardLayout from '../components/layout/DashboardLayout'

const MOODS = [
  { value: 'great',    label: '😄 Great',    color: '#8aab96',  ring: 'border-[#8aab96]',   bg: 'bg-[#8aab96]/10',   text: 'text-[#3d7a56]' },
  { value: 'good',     label: '😊 Good',     color: '#4a9d6f',  ring: 'border-[#4a9d6f]',   bg: 'bg-[#4a9d6f]/10',   text: 'text-[#4a9d6f]' },
  { value: 'neutral',  label: '😐 Neutral',  color: '#e8b86d',  ring: 'border-[#e8b86d]',   bg: 'bg-[#e8b86d]/10',   text: 'text-[#a67c00]' },
  { value: 'bad',      label: '😔 Bad',      color: '#e8899a',  ring: 'border-[#e8899a]',   bg: 'bg-[#e8899a]/10',   text: 'text-rose-deep' },
  { value: 'terrible', label: '😢 Terrible', color: '#c0526a',  ring: 'border-rose-deep',   bg: 'bg-rose-deep/10',   text: 'text-rose-deep' },
]
const MOOD_BADGE = { great: 'sage', good: 'sage', neutral: 'amber', bad: 'rose', terrible: 'rose' }

function LogForm({ initial = {}, onSave, onCancel, isLoading, isEdit = false, hasPartner = false }) {
  const [form, setForm] = useState({
    date: initial.date || format(new Date(), 'yyyy-MM-dd'),
    mood: initial.mood || '',
    sleep_duration: initial.sleep_duration || '',
    exercise_duration: initial.exercise_duration || '',
    complaints: initial.complaints || '',
    notes: initial.notes || '',
    partner_message: initial.partner_message || '',
  })
  const [error, setError] = useState('')

  const handleSubmit = (e) => {
    e.preventDefault()
    if (!form.mood) { setError('Please select a mood.'); return }
    if (form.sleep_duration === '') { setError('Please enter sleep duration.'); return }
    if (form.exercise_duration === '') { setError('Please enter exercise duration.'); return }
    setError(''); onSave(form)
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-5">
      {error && <Alert type="error">{error}</Alert>}
      {!isEdit && (
        <Input label="Date" type="date" value={form.date}
          onChange={(e) => setForm(p => ({ ...p, date: e.target.value }))} required />
      )}

      {/* Mood */}
      <div>
        <p className="text-[0.75rem] font-semibold text-muted uppercase tracking-widest mb-2.5">How are you feeling? *</p>
        <div className="flex gap-2 flex-wrap">
          {MOODS.map((m) => {
            const active = form.mood === m.value
            return (
              <button
                key={m.value} type="button"
                onClick={() => setForm(p => ({ ...p, mood: m.value }))}
                className={[
                  'px-3.5 py-2 rounded-full border-2 text-xs cursor-pointer transition-all duration-200',
                  active ? `${m.ring} ${m.bg} ${m.text} font-semibold` : 'border-border dark:border-border-dark bg-white dark:bg-dark text-muted hover:border-border-strong',
                ].join(' ')}
              >
                {m.label}
              </button>
            )
          })}
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <Input label="Sleep (hours) *" type="number" min="0" max="24" step="0.5" icon={Moon}
          placeholder="e.g. 7.5" value={form.sleep_duration}
          onChange={(e) => setForm(p => ({ ...p, sleep_duration: e.target.value }))} required />
        <Input label="Exercise (minutes) *" type="number" min="0" max="1440" step="5" icon={Dumbbell}
          placeholder="e.g. 30" value={form.exercise_duration}
          onChange={(e) => setForm(p => ({ ...p, exercise_duration: e.target.value }))} required />
      </div>

      <Textarea label="Complaints / Symptoms" placeholder="Any discomfort, symptoms, or concerns today..."
        value={form.complaints} onChange={(e) => setForm(p => ({ ...p, complaints: e.target.value }))} />
      <Textarea label="Notes" placeholder="Anything else you'd like to remember about today..."
        value={form.notes} onChange={(e) => setForm(p => ({ ...p, notes: e.target.value }))} />

      {hasPartner && (
        <div className="rounded-xl border border-rose-deep/20 bg-rose-deep/4 dark:bg-rose-deep/5 p-4">
          <div className="flex items-center gap-2 mb-2.5">
            <Send size={13} className="text-rose-deep" />
            <label className="text-[0.72rem] font-semibold text-rose-deep uppercase tracking-widest">
              Note for partner
            </label>
          </div>
          <textarea
            value={form.partner_message}
            onChange={(e) => setForm(p => ({ ...p, partner_message: e.target.value }))}
            placeholder="Write a message for your partner with this log entry… (optional)"
            rows={3}
            maxLength={500}
            className="w-full px-4 py-3 rounded-[10px] border border-rose-deep/20 bg-white dark:bg-dark text-sm text-charcoal dark:text-charcoal-dark placeholder:text-muted dark:placeholder:text-muted-dark focus:outline-none focus:border-rose-deep focus:ring-2 focus:ring-rose-deep/10 transition-all resize-none leading-relaxed"
          />
          <p className="text-[0.65rem] text-muted dark:text-muted-dark mt-1 text-right">{form.partner_message.length}/500</p>
        </div>
      )}

      <div className="flex gap-2.5">
        <Button type="submit" isLoading={isLoading} className="flex-1">
          <Save size={14} /> {isEdit ? 'Save changes' : 'Save log'}
        </Button>
        <Button type="button" variant="ghost" onClick={onCancel}>Cancel</Button>
      </div>
    </form>
  )
}

function LogCard({ log, onEdit, onDelete }) {
  const mood = MOODS.find(m => m.value === log.mood)
  return (
    <Card className="!p-5">
      <div className="flex justify-between items-start mb-4">
        <div>
          <p className="font-semibold text-charcoal dark:text-charcoal-dark mb-1.5">{format(parseISO(log.date), 'EEEE, MMMM d')}</p>
          {mood && <Badge variant={MOOD_BADGE[log.mood] || 'muted'}>{mood.label}</Badge>}
        </div>
        <div className="flex gap-1.5">
        {/* FIX: was "bg-white" without "dark:bg-dark" — buttons stayed white in dark mode */}
          <button onClick={() => onEdit(log)}
            className="p-2 rounded-lg border border-border dark:border-border-dark bg-white dark:bg-dark text-muted hover:border-rose-deep/50 transition-colors cursor-pointer">
            <Pencil size={13} />
          </button>
          {/* FIX: same bg-white without dark:bg-dark */}
          <button onClick={() => onDelete(log)}
            className="p-2 rounded-lg border border-border dark:border-border-dark bg-white dark:bg-dark text-muted hover:border-red-500 hover:text-red-500 transition-colors cursor-pointer">
            <Trash2 size={13} />
          </button>
        </div>
      </div>

      <div className="flex gap-5 mb-3 flex-wrap">
        <div className="flex items-center gap-1.5 text-muted text-sm">
          <Moon size={13} className="text-lavender" />
          <span><strong className="text-charcoal dark:text-charcoal-dark">{log.sleep_duration}h</strong> sleep</span>
        </div>
        <div className="flex items-center gap-1.5 text-muted text-sm">
          <Dumbbell size={13} className="text-sage" />
          <span><strong className="text-charcoal dark:text-charcoal-dark">{log.exercise_duration}m</strong> exercise</span>
        </div>
      </div>

      {log.complaints && (
        <div className="mb-2">
          <p className="text-[0.7rem] font-semibold text-muted uppercase tracking-widest mb-1">Complaints</p>
          <p className="text-sm text-charcoal dark:text-charcoal-dark leading-relaxed">{log.complaints}</p>
        </div>
      )}
      {log.notes && (
        <div>
          <p className="text-[0.7rem] font-semibold text-muted uppercase tracking-widest mb-1">Notes</p>
          <p className="text-sm text-charcoal dark:text-charcoal-dark leading-relaxed">{log.notes}</p>
        </div>
      )}
      {log.partner_message && (
        <div className="mt-3 pt-3 border-t border-rose-deep/15 flex items-start gap-2">
          <Send size={11} className="text-rose-deep mt-0.5 flex-shrink-0" />
          <div>
            <p className="text-[0.65rem] font-semibold text-rose-deep uppercase tracking-widest mb-0.5">Note for partner</p>
            <p className="text-xs text-charcoal dark:text-charcoal-dark leading-relaxed italic">{log.partner_message}</p>
          </div>
        </div>
      )}
    </Card>
  )
}

function DailyLogPageContent() {
  const profile = useAuthStore((state) => state.profile)
  const hasPartner = !!profile?.partner
  const [logs, setLogs] = useState([])
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [showForm, setShowForm] = useState(false)
  const [editingLog, setEditingLog] = useState(null)
  const [deleteTarget, setDeleteTarget] = useState(null)
  const [error, setError] = useState('')
  const [filter, setFilter] = useState({ mood: '', month: format(new Date(), 'yyyy-MM') })

  const loadLogs = useCallback(async () => {
    setLoading(true)
    try {
      const params = {}
      if (filter.mood) params.mood = filter.mood
      if (filter.month) params.month = filter.month
      const { data } = await logsApi.list(params)
      setLogs(data.data)
    } catch { setLogs([]) }
    finally { setLoading(false) }
  }, [filter])

  useEffect(() => { loadLogs() }, [loadLogs])

  const handleCreate = async (form) => {
    setSaving(true)
    try { await logsApi.create(form); setShowForm(false); loadLogs() }
    catch (err) { setError(err.response?.data?.message || 'Failed to save log.') }
    finally { setSaving(false) }
  }

  const handleUpdate = async (form) => {
    setSaving(true)
    try { await logsApi.update(editingLog.date, form); setEditingLog(null); loadLogs() }
    catch (err) { setError(err.response?.data?.message || 'Failed to update log.') }
    finally { setSaving(false) }
  }

  const handleDelete = async () => {
    try { await logsApi.delete(deleteTarget.date); setDeleteTarget(null); loadLogs() }
    catch { setError('Failed to delete log.') }
  }

  return (
    <div className="max-w-[760px] animate-fade-up">
      <div className="flex justify-between items-start mb-7 flex-wrap gap-3">
        <div>
          <h1 className="text-5xl font-bold text-charcoal dark:text-charcoal-dark tracking-tight mb-1">Daily Log</h1>
          <p className="text-muted dark:text-muted-dark text-sm">Track your daily wellness journey</p>
        </div>
        {!showForm && !editingLog && (
          <Button onClick={() => setShowForm(true)}><Plus size={15} /> New log</Button>
        )}
      </div>

      {error && <Alert type="error" className="mb-5">{error}</Alert>}

      {showForm && (
        <Card className="mb-6">
          <h3 className="font-display text-xl font-semibold text-charcoal dark:text-charcoal-dark mb-5">New Log Entry</h3>
          <LogForm onSave={handleCreate} onCancel={() => setShowForm(false)} isLoading={saving} hasPartner={hasPartner} />
        </Card>
      )}

      <Modal isOpen={!!editingLog} onClose={() => setEditingLog(null)} title="Edit Log">
        {editingLog && <LogForm initial={editingLog} onSave={handleUpdate} onCancel={() => setEditingLog(null)} isLoading={saving} isEdit hasPartner={hasPartner} />}
      </Modal>

      <Modal isOpen={!!deleteTarget} onClose={() => setDeleteTarget(null)} title="Delete log?">
        <p className="text-muted dark:text-muted-dark mb-6">Permanently delete the log for <strong>{deleteTarget?.date}</strong>?</p>
        <div className="flex gap-2.5">
          <Button variant="danger" onClick={handleDelete} className="flex-1">Delete</Button>
          <Button variant="ghost" onClick={() => setDeleteTarget(null)}>Cancel</Button>
        </div>
      </Modal>

      {/* Filters */}
      <Card className="mb-5 !p-4">
        <div className="flex gap-3 flex-wrap items-end">
          <div className="flex-1 min-w-[130px]">
            <label className="text-[0.72rem] font-semibold text-muted uppercase tracking-widest block mb-1.5">Month</label>
            <input type="month" value={filter.month}
              onChange={(e) => setFilter(p => ({ ...p, month: e.target.value }))}
              className="w-full px-3.5 py-2.5 rounded-[10px] border border-border text-sm text-charcoal bg-white outline-none focus:border-rose transition-colors dark:bg-dark dark:border-border-dark dark:text-charcoal-dark dark:placeholder:text-muted-dark" />
          </div>
          <div className="flex-1 min-w-[130px]">
            <Select label="Mood" value={filter.mood} onChange={(e) => setFilter(p => ({ ...p, mood: e.target.value }))}>
              <option value="">All moods</option>
              {MOODS.map(m => <option key={m.value} value={m.value}>{m.label}</option>)}
            </Select>
          </div>
          <Button variant="ghost" size="sm"
            onClick={() => setFilter({ mood: '', month: format(new Date(), 'yyyy-MM') })}>
            Reset
          </Button>
        </div>
      </Card>

      {loading ? (
        <div className="flex justify-center py-16"><Spinner size={32} /></div>
      ) : logs.length === 0 ? (
        <EmptyState
          icon={BookOpen}
          title="No logs found"
          description="Start tracking your daily wellness by adding your first log entry."
          action={<Button onClick={() => setShowForm(true)}><Plus size={14} /> Add log</Button>}
        />
      ) : (
        <div className="flex flex-col gap-3.5">
          {logs.map(log => (
            <LogCard key={log.id} log={log} onEdit={setEditingLog} onDelete={setDeleteTarget} />
          ))}
        </div>
      )}
    </div>
  )
}

export default function DailyLogPage() {
  return (
    <DashboardLayout activePage="logs">
      <DailyLogPageContent />
    </DashboardLayout>
  )
}