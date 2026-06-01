import React, { useState, useEffect } from 'react'
import { format, parseISO } from 'date-fns'
import { Calendar, Clock3 } from 'lucide-react'
import { logsApi, appointmentsApi } from '../api/services'
import { Card, Spinner } from '../components/ui/Card'
import DashboardLayout from '../components/layout/DashboardLayout'
import useAuthStore from '../store/authStore'

const MOOD_EMOJI  = { great: '😄', good: '😊', neutral: '😐', bad: '😔', terrible: '😢' }
const PERIODS     = [{ value: 'weekly', label: 'Week' }, { value: 'monthly', label: 'Month' }, { value: 'all', label: 'All' }]

function SectionHeader({ icon: Icon, title, iconColor = '#e8899a' }) { // eslint-disable-line
return (
    <div className="flex items-center gap-2.5 mb-4">
    <div className="w-8 h-8 rounded-[10px] flex items-center justify-center" style={{ background: `${iconColor}18`, color: iconColor }}>
        <Icon size={15} />
    </div>
    <h3 className="font-bold text-charcoal dark:text-charcoal-dark text-[1rem]">{title}</h3>
    </div>
)
}

function safeFormat(dateStr, pattern, fallback = '—') {
try { return dateStr ? format(parseISO(dateStr), pattern) : fallback }
catch { return fallback }
}

export default function PartnerStatsPage() {
const profile = useAuthStore((state) => state.profile)
const partnerName = profile?.partner?.full_name || 'Partner'

const [period, setPeriod] = useState('monthly')
const [recentLogs, setRecentLogs] = useState([])
const [partnerAppts, setPartnerAppts] = useState([])
const [loading, setLoading] = useState(true)

useEffect(() => {
    const load = async () => {
    setLoading(true)
    try {
        const params = { period }
        const [logs, appts] = await Promise.all([
        logsApi.partner(params),
        appointmentsApi.partner(),
        ])
        setRecentLogs(Array.isArray(logs.data.data) ? logs.data.data : [])
        setPartnerAppts(Array.isArray(appts.data.data) ? appts.data.data : [])
    } catch (err) {
        console.log(err)
    } finally {
        setLoading(false)
    }
    }
    load()
}, [period])


const noData = (msg) => <p className="text-muted text-sm text-center py-8">{msg}</p>

return (
    <DashboardLayout activePage="partner-stats">
    <div className="flex justify-between items-start mb-7 flex-wrap gap-3">
        <div>
        <h1 className="text-4xl md:text-5xl font-bold text-charcoal dark:text-charcoal-dark tracking-tight mb-1">Partner Statistics</h1>
        <p className="text-muted dark:text-muted-dark text-sm">Viewing wellness data for {partnerName}</p>
        </div>
        <div className="flex gap-1 bg-white dark:bg-dark p-1 rounded-xl border border-border dark:border-border-dark">
        {PERIODS.map(opt => (
            <button key={opt.value} onClick={() => setPeriod(opt.value)}
            className={[
                'px-4 py-1.5 rounded-[9px] text-xs font-medium transition-all duration-200 cursor-pointer border-0',
                period === opt.value ? 'bg-rose-deep text-white' : 'bg-transparent text-muted hover:text-charcoal',
            ].join(' ')}>
            {opt.label}
            </button>
        ))}
        </div>
    </div>

    {loading ? (
        <div className="flex justify-center py-20"><Spinner size={36} /></div>
    ) : (
        <div className="flex flex-col gap-6">

          {/* Note: Partner mood/sleep/summary stats are not available from the backend.
              Only partner logs and appointments are supported via /api/logs/partner/
              and /api/appointments/partner/. */}

          {/* Recent Logs */}
        <Card>
            <SectionHeader icon={Calendar} title="Recent Logs" iconColor="#e8b86d" />
            {recentLogs.length === 0 ? noData('No logs yet') : (
            <div className="flex flex-col gap-3">
                {recentLogs.slice(0, 5).map((log) => (
                <div key={log.id} className="flex items-center justify-between p-4 bg-[#FAF7F4] dark:bg-[#1B1B1B] rounded-2xl">
                    <div>
                    <p className="font-bold text-charcoal dark:text-charcoal-dark text-sm mb-1">
                        {safeFormat(log.date, 'MMM d, yyyy')}
                    </p>
                    <div className="flex items-center gap-3 text-xs text-muted">
                        <span>🌙 {log.sleep_duration}h</span>
                        <span>💪 {log.exercise_duration}m</span>
                        {log.notes && <span className="italic truncate max-w-[200px]">{log.notes}</span>}
                    </div>
                    </div>
                    <span className="text-lg">{MOOD_EMOJI[log.mood] || '😊'} <span className="text-xs text-muted font-semibold">{log.mood}</span></span>
                </div>
                ))}
            </div>
            )}
        </Card>

          {/* Partner Appointments */}
        <Card>
            <SectionHeader icon={Clock3} title="Partner Appointments" iconColor="#8aab96" />
            {partnerAppts.length === 0 ? noData('No appointments') : (
            <div className="flex flex-col gap-3">
                {partnerAppts.map((appt) => (
                <div key={appt.id} className="p-4 bg-[#FAF7F4] dark:bg-[#1B1B1B] rounded-2xl">
                    <div className="flex justify-between items-start">
                    <p className="font-bold text-charcoal dark:text-charcoal-dark text-sm mb-1">{appt.title}</p>
                    {appt.is_completed && <span className="text-[10px] bg-emerald-100 text-emerald-600 px-2 py-0.5 rounded-full font-semibold">Done</span>}
                    </div>
                    <div className="flex items-center gap-4 text-xs text-muted mt-1 flex-wrap">
                    <span>📅 {safeFormat(appt.appointment_date, 'MMM d • h:mm a')}</span>
                    <span>👩‍⚕️ Dr. {appt.doctor_name}</span>
                    {appt.location && <span>📍 {appt.location}</span>}
                    </div>
                </div>
                ))}
            </div>
            )}
        </Card>

        </div>
    )}
    </DashboardLayout>
)
}