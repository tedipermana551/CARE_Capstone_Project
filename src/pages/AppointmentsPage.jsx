import React, { useState, useEffect } from 'react'
import { format, parseISO, isPast } from 'date-fns'
import { Plus, Calendar, MapPin, User, CheckCircle2, Trash2, Pencil, Clock, Bell } from 'lucide-react'
import { appointmentsApi } from '../api/services'
import { Card, Badge, Spinner, EmptyState, Modal, Alert } from '../components/ui/Card'
import Button from '../components/ui/Button'
import Input, { Textarea } from '../components/ui/Input'
import DashboardLayout from '../components/layout/DashboardLayout'

function safeFormat(dateStr, pattern, fallback = '—') {
  try { return dateStr ? format(parseISO(dateStr), pattern) : fallback }
  catch { return fallback }
}

function AppointmentForm({ initial = {}, onSave, onCancel, isLoading }) {
  const [form, setForm] = useState({
    title: initial.title || '',
    doctor_name: initial.doctor_name || '',
    location: initial.location || '',
    appointment_date: initial.appointment_date ? format(parseISO(initial.appointment_date), "yyyy-MM-dd'T'HH:mm") : '',
    notes: initial.notes || '',
    reminder_days_before: initial.reminder_days_before ?? 1,
  })
  const [error, setError] = useState('')

  const handleSubmit = (e) => {
    e.preventDefault()
    if (!form.title || !form.doctor_name || !form.appointment_date) {
      setError('Title, doctor name, and date are required.'); return
    }
    setError('')
    onSave({ ...form, appointment_date: new Date(form.appointment_date).toISOString() })
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4">
      {error && <Alert type="error">{error}</Alert>}
      <Input label="Appointment title *" placeholder="e.g. 20-week ultrasound" value={form.title}
        onChange={(e) => setForm(p => ({ ...p, title: e.target.value }))} required />
      <Input label="Doctor / Provider *" icon={User} placeholder="Dr. Smith" value={form.doctor_name}
        onChange={(e) => setForm(p => ({ ...p, doctor_name: e.target.value }))} required />
      <Input label="Location" icon={MapPin} placeholder="Hospital or clinic address" value={form.location}
        onChange={(e) => setForm(p => ({ ...p, location: e.target.value }))} />
      <Input label="Date & Time *" type="datetime-local" icon={Clock} value={form.appointment_date}
        onChange={(e) => setForm(p => ({ ...p, appointment_date: e.target.value }))} required />
      <Input label="Reminder (days before)" type="number" min="0" icon={Bell}
        value={form.reminder_days_before}
        onChange={(e) => setForm(p => ({ ...p, reminder_days_before: parseInt(e.target.value) || 0 }))} />
      <Textarea label="Notes" placeholder="Questions to ask, things to bring..."
        value={form.notes} onChange={(e) => setForm(p => ({ ...p, notes: e.target.value }))} />
      <div className="flex gap-2.5 mt-1">
        <Button type="submit" isLoading={isLoading} className="flex-1">Save appointment</Button>
        <Button type="button" variant="ghost" onClick={onCancel}>Cancel</Button>
      </div>
    </form>
  )
}

function AppointmentCard({ appt, onEdit, onDelete, onComplete }) {
  const date = parseISO(appt.appointment_date)
  const past = isPast(date)
  return (
    <Card className={`!p-5 ${appt.is_completed ? 'opacity-70' : ''}`}>
      <div className="flex justify-between items-start gap-4">
        <div className="flex-1">
          <div className="flex items-center gap-2.5 mb-2 flex-wrap">
            <h3 className="font-semibold text-charcoal dark:text-charcoal-dark text-sm">{appt.title}</h3>
            {appt.is_completed && <Badge variant="sage">✓ Completed</Badge>}
            {!appt.is_completed && past && <Badge variant="amber">Past due</Badge>}
          </div>
          <div className="flex flex-col gap-1.5">
            <div className="flex items-center gap-2 text-xs text-muted dark:text-muted-dark">
              <Calendar size={12} className="text-brand" />
              {safeFormat(appt.appointment_date, 'EEEE, MMMM d, yyyy · h:mm a')}
            </div>
            <div className="flex items-center gap-2 text-xs text-muted dark:text-muted-dark">
              <User size={12} className="text-accent" />
              Dr. {appt.doctor_name}
            </div>
            {appt.location && (
              <div className="flex items-center gap-2 text-xs text-muted dark:text-muted-dark">
                <MapPin size={12} className="text-sleep" />
                {appt.location}
              </div>
            )}
          </div>
          {appt.notes && (
            <p className="mt-2.5 text-xs text-muted dark:text-muted-dark italic">"{appt.notes}"</p>
          )}
        </div>

        <div className="flex flex-col gap-1.5 flex-shrink-0">
          {!appt.is_completed && (
            <>
              <button onClick={() => onComplete(appt.id)}
                className="p-1.5 rounded-lg border border-accent/40 bg-accent/8 text-accent hover:bg-accent/20 transition-colors cursor-pointer">
                <CheckCircle2 size={13} />
              </button>
              <button onClick={() => onEdit(appt)}
                className="p-1.5 rounded-lg border border-border dark:border-border-dark bg-white dark:bg-dark text-muted dark:text-muted-dark hover:border-brand-strong/40 transition-colors cursor-pointer">
                <Pencil size={13} />
              </button>
            </>
          )}
          <button onClick={() => onDelete(appt)}
            className="p-1.5 rounded-lg border border-border dark:border-border-dark bg-white dark:bg-dark text-muted dark:text-muted-dark hover:border-red-400 hover:text-red-500 transition-colors cursor-pointer">
            <Trash2 size={13} />
          </button>
        </div>
      </div>
    </Card>
  )
}

const FILTERS = [
  { key: 'upcoming',  label: 'Upcoming' },
  { key: 'all',       label: 'All' },
  { key: 'past',      label: 'Missed' },
  { key: 'completed', label: 'Completed' },
]

function AppointmentsPageContent() {
  const [appointments, setAppointments] = useState([])
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [showForm, setShowForm] = useState(false)
  const [editTarget, setEditTarget] = useState(null)
  const [deleteTarget, setDeleteTarget] = useState(null)
  const [filter, setFilter] = useState('upcoming')
  const [error, setError] = useState('')

  const load = async () => {
    setLoading(true)
    try { const { data } = await appointmentsApi.list(); setAppointments(data.data) }
    catch { setAppointments([]) }
    finally { setLoading(false) }
  }

  useEffect(() => { load() }, [])

  const handleCreate = async (form) => {
    setSaving(true)
    try { await appointmentsApi.create(form); setShowForm(false); load() }
    catch (err) { setError(err.response?.data?.message || 'Failed to create appointment.') }
    finally { setSaving(false) }
  }

  const handleUpdate = async (form) => {
    setSaving(true)
    try { await appointmentsApi.update(editTarget.id, form); setEditTarget(null); load() }
    catch (err) { setError(err.response?.data?.message || 'Failed to update.') }
    finally { setSaving(false) }
  }

  const handleDelete = async () => {
    try { await appointmentsApi.delete(deleteTarget.id); setDeleteTarget(null); load() }
    catch { setError('Failed to delete.') }
  }

  const handleComplete = async (id) => {
    try { await appointmentsApi.complete(id); load() }
    catch { setError('Failed to update appointment.') }
  }

  const filtered = appointments.filter(a => {
    const date = parseISO(a.appointment_date)
    if (filter === 'upcoming')  return !a.is_completed && !isPast(date)
    if (filter === 'completed') return a.is_completed
    if (filter === 'past')      return !a.is_completed && isPast(date)
    return true
  })

  return (
    <div className="max-w-[760px] animate-fade-up">
      <div className="flex justify-between items-start mb-7 flex-wrap gap-3">
        <div>
          <h1 className="text-5xl font-bold text-charcoal dark:text-charcoal-dark tracking-tight mb-1">Appointments</h1>
          <p className="text-muted dark:text-muted-dark text-sm">Manage your prenatal appointments and check-ups</p>
        </div>
        {!showForm && <Button onClick={() => setShowForm(true)}><Plus size={15} /> New appointment</Button>}
      </div>

      {error && <Alert type="error" className="mb-4">{error}</Alert>}

      {showForm && (
        <Card className="mb-6">
          <h3 className="font-display text-xl font-semibold text-charcoal dark:text-charcoal-dark mb-5">New Appointment</h3>
          <AppointmentForm onSave={handleCreate} onCancel={() => setShowForm(false)} isLoading={saving} />
        </Card>
      )}

      <Modal isOpen={!!editTarget} onClose={() => setEditTarget(null)} title="Edit Appointment">
        {editTarget && <AppointmentForm initial={editTarget} onSave={handleUpdate} onCancel={() => setEditTarget(null)} isLoading={saving} />}
      </Modal>

      <Modal isOpen={!!deleteTarget} onClose={() => setDeleteTarget(null)} title="Delete appointment?">
        <p className="text-muted dark:text-muted-dark mb-6">Delete <strong>"{deleteTarget?.title}"</strong>? This cannot be undone.</p>
        <div className="flex gap-2.5">
          <Button variant="danger" onClick={handleDelete} className="flex-1">Delete</Button>
          <Button variant="ghost" onClick={() => setDeleteTarget(null)}>Cancel</Button>
        </div>
      </Modal>

      {/* Filter tabs */}
      <div className="flex gap-1 mb-5 bg-white dark:bg-dark p-1 rounded-xl border border-border dark:border-border-dark w-fit">
        {FILTERS.map(tab => (
          <button key={tab.key} onClick={() => setFilter(tab.key)}
            className={[
              'px-4 py-1.5 rounded-[9px] text-xs font-medium transition-all duration-200 cursor-pointer border-0',
              filter === tab.key ? 'bg-rose-deep text-white' : 'bg-transparent text-muted dark:text-muted-dark hover:text-charcoal dark:hover:text-charcoal-dark',
            ].join(' ')}>
            {tab.label}
          </button>
        ))}
      </div>

      {loading ? (
        <div className="flex justify-center py-16"><Spinner size={32} /></div>
      ) : filtered.length === 0 ? (
        <EmptyState
          icon={Calendar}
          title={`No ${filter} appointments`}
          description="Schedule a prenatal check-up or doctor's visit."
          action={<Button onClick={() => setShowForm(true)}><Plus size={14} /> Add appointment</Button>}
        />
      ) : (
        <div className="flex flex-col gap-3.5">
          {filtered.map(appt => (
                <AppointmentCard key={appt.id} appt={appt} onEdit={setEditTarget} onDelete={setDeleteTarget} onComplete={handleComplete} />
          ))}
        </div>
      )}
    </div>
  )
}
 
    export default function AppointmentsPage() {
      return (
        <DashboardLayout activePage="appointments">
          <AppointmentsPageContent />
        </DashboardLayout>
      )
    }