/**
 * mockServices.js
 * ─────────────────────────────────────────────────────────────────────────
 * Drop-in replacement for src/api/services.js.
 * All functions return the same { data: { data: ... } } envelope shape
 * that the real Axios responses produce, so stores/pages need zero changes.
 *
 * State is kept in module-level variables so mutations (create/update/delete)
 * persist for the entire browser session without any backend.
 */

import {
  DEMO_USER,
  DEMO_PARTNER_USER,
  DEMO_PROFILE,
  DEMO_PARTNER_PROFILE,
  DEMO_PREGNANCY_STATUS,
  DEMO_LOGS,
  DEMO_PARTNER_LOGS,
  DEMO_APPOINTMENTS,
  DEMO_PARTNER_APPOINTMENTS,
  DEMO_STREAKS,
  buildSummaryStats,
  buildMoodStats,
  buildSleepStats,
  buildExerciseStats,
} from './seedData'
import { format, parseISO, isPast } from 'date-fns'

// ── Simulated network delay ───────────────────────────────────────────────
const delay = (ms = 300) => new Promise((r) => setTimeout(r, ms))

// Helper: wrap value in the same envelope Axios returns
const ok = (data) => ({ data: { data, status: 'success' } })

// ── Active account tracking ───────────────────────────────────────────────
// 'mother' → Sarah Johnson  |  'husband' → James Johnson
let _activeRole = localStorage.getItem('demo_role') || 'mother'

const setActiveRole = (role) => {
  _activeRole = role
  localStorage.setItem('demo_role', role)
  // Reset per-account mutable state when switching
  _motherProfile      = { ...DEMO_PROFILE }
  _husbandProfile     = { ...DEMO_PARTNER_PROFILE }
  _motherLogs         = [...DEMO_LOGS]
  _motherAppointments = [...DEMO_APPOINTMENTS]
  _husbandLogs        = [...DEMO_PARTNER_LOGS]
  _husbandAppointments = [...DEMO_PARTNER_APPOINTMENTS]
}

// ── Per-account mutable state ─────────────────────────────────────────────
let _motherProfile       = { ...DEMO_PROFILE }
let _husbandProfile      = { ...DEMO_PARTNER_PROFILE }
let _motherLogs          = [...DEMO_LOGS]
let _motherAppointments  = [...DEMO_APPOINTMENTS]
let _husbandLogs         = [...DEMO_PARTNER_LOGS]
let _husbandAppointments = [...DEMO_PARTNER_APPOINTMENTS]

// Helpers to get the active account's data
const activeProfile      = () => _activeRole === 'husband' ? _husbandProfile      : _motherProfile
const setActiveProfile   = (p) => { if (_activeRole === 'husband') _husbandProfile = p; else _motherProfile = p }
const activeLogs         = () => _activeRole === 'husband' ? _husbandLogs         : _motherLogs
const setActiveLogs      = (l) => { if (_activeRole === 'husband') _husbandLogs = l; else _motherLogs = l }
const activeAppointments = () => _activeRole === 'husband' ? _husbandAppointments : _motherAppointments
const setActiveAppts     = (a) => { if (_activeRole === 'husband') _husbandAppointments = a; else _motherAppointments = a }

// Partner data is always the other account's data
const partnerLogs        = () => _activeRole === 'husband' ? _motherLogs         : _husbandLogs
const partnerAppointments = () => _activeRole === 'husband' ? _motherAppointments : _husbandAppointments

let _nextLogId  = 200
let _nextApptId = 50

// ── Auth ──────────────────────────────────────────────────────────────────
export const authApi = {
  register: async (formData) => {
    await delay(500)
    // New registrations → default to mother account for demo
    setActiveRole('mother')
    localStorage.setItem('access_token', 'demo_access_token')
    localStorage.setItem('refresh_token', 'demo_refresh_token')
    return ok({
      user: { ...DEMO_USER, full_name: formData.full_name, email: formData.email },
      access: 'demo_access_token',
      refresh: 'demo_refresh_token',
    })
  },

  login: async (credentials) => {
    await delay(600)
    // Detect which account by email:
    //   james@demo.com  (or anything with "james")  → husband
    //   anything else                               → mother
    const email = (credentials.email || '').toLowerCase()
    const role = email.includes('james') || email === 'husband@demo.com' ? 'husband' : 'mother'
    setActiveRole(role)
    localStorage.setItem('access_token', 'demo_access_token')
    localStorage.setItem('refresh_token', 'demo_refresh_token')
    const user = role === 'husband' ? DEMO_PARTNER_USER : DEMO_USER
    return ok({ user, access: 'demo_access_token', refresh: 'demo_refresh_token' })
  },

  logout: async () => {
    await delay(200)
    localStorage.removeItem('demo_role')
    return ok({})
  },
}

// ── Profile ───────────────────────────────────────────────────────────────
export const profileApi = {
  me: async () => {
    await delay(200)
    return ok(activeProfile())
  },

  setup: async (data) => {
    await delay(400)
    setActiveProfile({ ...activeProfile(), ...data })
    return ok(activeProfile())
  },

  update: async (data) => {
    await delay(300)
    setActiveProfile({ ...activeProfile(), ...data })
    return ok(activeProfile())
  },

  myCode: async () => {
    await delay(150)
    return ok({ unique_code: activeProfile().unique_code })
  },

  linkPartner: async (code) => {
    await delay(400)
    const validCodes = _activeRole === 'husband'
      ? ['SARAH42', 'DEMO01']
      : ['JAMES99', 'DEMO01']
    if (!validCodes.includes(code)) {
      const err = new Error('Partner not found')
      err.response = { data: { message: 'No user found with that code.' } }
      throw err
    }
    const partner = _activeRole === 'husband' ? DEMO_PROFILE : DEMO_PARTNER_PROFILE
    setActiveProfile({ ...activeProfile(), partner })
    return ok({ message: 'Partner linked successfully.' })
  },

  unlinkPartner: async () => {
    await delay(300)
    setActiveProfile({ ...activeProfile(), partner: null })
    return ok({})
  },
}

// ── Pregnancy ─────────────────────────────────────────────────────────────
export const pregnancyApi = {
  status: async () => {
    await delay(250)
    // Only the mother has a pregnancy status
    if (_activeRole === 'husband') return ok(null)
    return ok(DEMO_PREGNANCY_STATUS)
  },
}

// ── Daily Logs ────────────────────────────────────────────────────────────
export const logsApi = {
  list: async (params = {}) => {
    await delay(300)
    let result = [...activeLogs()]

    if (params.mood)       result = result.filter((l) => l.mood === params.mood)
    if (params.month)      result = result.filter((l) => l.date.startsWith(params.month))
    if (params.start_date) result = result.filter((l) => l.date >= params.start_date)
    if (params.end_date)   result = result.filter((l) => l.date <= params.end_date)

    return ok(result)
  },

  today: async () => {
    await delay(150)
    const todayStr = format(new Date(), 'yyyy-MM-dd')
    return ok(activeLogs().find((l) => l.date === todayStr) || null)
  },

  create: async (data) => {
    await delay(400)
    if (activeLogs().find((l) => l.date === data.date)) {
      const err = new Error('Log already exists')
      err.response = { data: { message: `A log for ${data.date} already exists.` } }
      throw err
    }
    const newLog = { id: _nextLogId++, ...data, created_at: new Date().toISOString() }
    setActiveLogs([newLog, ...activeLogs()].sort((a, b) => b.date.localeCompare(a.date)))
    return ok(newLog)
  },

  detail: async (date) => {
    await delay(150)
    const log = activeLogs().find((l) => l.date === date)
    if (!log) { const err = new Error('Not found'); err.response = { status: 404 }; throw err }
    return ok(log)
  },

  update: async (date, data) => {
    await delay(350)
    setActiveLogs(activeLogs().map((l) => l.date === date ? { ...l, ...data } : l))
    return ok(activeLogs().find((l) => l.date === date))
  },

  delete: async (date) => {
    await delay(300)
    setActiveLogs(activeLogs().filter((l) => l.date !== date))
    return ok({})
  },

  partner: async (params = {}) => {
    await delay(300)
    let result = [...partnerLogs()]

    if (params.start_date) result = result.filter((l) => l.date >= params.start_date)
    if (params.end_date)   result = result.filter((l) => l.date <= params.end_date)
    if (params.mood)       result = result.filter((l) => l.mood === params.mood)

    return ok(result)
  },
}

// ── Appointments ──────────────────────────────────────────────────────────
export const appointmentsApi = {
  list: async () => {
    await delay(300)
    return ok([...activeAppointments()].sort((a, b) =>
      new Date(a.appointment_date) - new Date(b.appointment_date)
    ))
  },

  upcoming: async () => {
    await delay(250)
    const upcoming = activeAppointments()
      .filter((a) => !a.is_completed && !isPast(parseISO(a.appointment_date)))
      .sort((a, b) => new Date(a.appointment_date) - new Date(b.appointment_date))
    return ok(upcoming)
  },

  create: async (data) => {
    await delay(400)
    const newAppt = { id: _nextApptId++, is_completed: false, ...data }
    setActiveAppts([...activeAppointments(), newAppt])
    return ok(newAppt)
  },

  detail: async (id) => {
    await delay(150)
    return ok(activeAppointments().find((a) => a.id === id))
  },

  update: async (id, data) => {
    await delay(350)
    setActiveAppts(activeAppointments().map((a) => a.id === id ? { ...a, ...data } : a))
    return ok(activeAppointments().find((a) => a.id === id))
  },

  delete: async (id) => {
    await delay(300)
    setActiveAppts(activeAppointments().filter((a) => a.id !== id))
    return ok({})
  },

  complete: async (id) => {
    await delay(300)
    setActiveAppts(activeAppointments().map((a) => a.id === id ? { ...a, is_completed: true } : a))
    return ok(activeAppointments().find((a) => a.id === id))
  },

  partner: async () => {
    await delay(300)
    return ok(partnerAppointments())
  },
}

// ── Statistics ────────────────────────────────────────────────────────────
export const statsApi = {
  summary: async (params = {}) => {
    await delay(250)
    return ok(buildSummaryStats(params.period || 'monthly', activeLogs()))
  },

  mood: async (params = {}) => {
    await delay(250)
    return ok(buildMoodStats(params.period || 'monthly', activeLogs()))
  },

  sleep: async (params = {}) => {
    await delay(250)
    return ok(buildSleepStats(params.period || 'monthly', activeLogs()))
  },

  exercise: async (params = {}) => {
    await delay(250)
    return ok(buildExerciseStats(params.period || 'monthly', activeLogs()))
  },

  streaks: async () => {
    await delay(200)
    return ok(DEMO_STREAKS)
  },
}