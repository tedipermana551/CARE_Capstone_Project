import React, { useState, useEffect } from 'react'
import {
BarChart, Bar, LineChart, Line, PieChart, Pie, Cell,
XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid
} from 'recharts'
import { format, parseISO } from 'date-fns'
import { Moon, Dumbbell, Heart, TrendingUp, Calendar, Clock3 } from 'lucide-react'
import { partnerStatsApi, logsApi, appointmentsApi } from '../api/services'
import { Card, StatCard, Spinner } from '../components/ui/Card'
import DashboardLayout from '../components/layout/DashboardLayout'
import useAuthStore from '../store/authStore'

const MOOD_COLORS = { great: '#8aab96', good: '#4a9d6f', neutral: '#e8b86d', bad: '#e8899a', terrible: '#c0526a' }
const MOOD_EMOJI  = { great: '😄', good: '😊', neutral: '😐', bad: '😔', terrible: '😢' }
const PERIODS     = [{ value: 'weekly', label: 'Week' }, { value: 'monthly', label: 'Month' }, { value: 'all', label: 'All' }]

function SectionHeader({ icon: Icon, title, iconColor = '#e8899a' }) {
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
const [summary, setSummary] = useState(null)
const [moodData, setMoodData] = useState(null)
const [sleepData, setSleepData] = useState(null)
const [recentLogs, setRecentLogs] = useState([])
const [partnerAppts, setPartnerAppts] = useState([])
const [loading, setLoading] = useState(true)

useEffect(() => {
    const load = async () => {
    setLoading(true)
    try {
        const params = { period }
        const [s, m, sl, logs, appts] = await Promise.all([
        partnerStatsApi.summary(params),
        partnerStatsApi.mood(params),
        partnerStatsApi.sleep(params),
        logsApi.partner(params),
        appointmentsApi.partner(),
        ])
        setSummary(s.data.data)
        setMoodData(m.data.data)
        setSleepData(sl.data.data)
        setRecentLogs(logs.data.data || [])
        setPartnerAppts(appts.data.data || [])
    } catch (err) {
        console.log(err)
    } finally {
        setLoading(false)
    }
    }
    load()
}, [period])

const moodPieData   = moodData ? Object.entries(moodData.mood_distribution).filter(([, v]) => v > 0).map(([name, value]) => ({ name, value })) : []
const sleepTimeline = sleepData?.timeline?.map(d => ({ date: format(parseISO(d.date), 'MMM d'), hours: parseFloat(d.sleep_duration) })) || []
const moodTimeline  = moodData?.timeline?.map(d => ({
    date: format(parseISO(d.date), 'MMM d'),
    score: { great: 5, good: 4, neutral: 3, bad: 2, terrible: 1 }[d.mood] || 3,
})) || []

const noData = (msg) => <p className="text-muted text-sm text-center py-8">{msg}</p>

return (
    <DashboardLayout activePage="partner-stats">
    <div className="flex justify-between items-start mb-7 flex-wrap gap-3">
        <div>
        <h1 className="text-5xl font-bold text-charcoal dark:text-charcoal-dark tracking-tight mb-1">Partner Statistics</h1>
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

          {/* Summary stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3.5">
            <StatCard label="Total logs"    value={summary?.total_logs ?? '—'}                              icon={Calendar} color="#e8899a" />
            <StatCard label="Avg. sleep"    value={summary ? `${summary.average_sleep_hours}h` : '—'}      icon={Moon}     color="#c4b5d4" />
            <StatCard label="Avg. exercise" value={summary ? `${summary.average_exercise_minutes}m` : '—'} icon={Dumbbell} color="#8aab96" />
            <StatCard label="Common mood"   value={summary?.most_common_mood || '—'}                       icon={Heart}    color="#e8899a"
            subtext={MOOD_EMOJI[summary?.most_common_mood] || ''} />
        </div>

          {/* Mood row */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <Card>
            <SectionHeader icon={Heart} title="Mood Distribution" iconColor="#e8899a" />
            {moodPieData.length === 0 ? noData('No mood data for this period') : (
                <div className="flex items-center gap-5">
                <ResponsiveContainer width="50%" height={170}>
                    <PieChart>
                    <Pie data={moodPieData} dataKey="value" cx="50%" cy="50%" innerRadius={42} outerRadius={72}>
                        {moodPieData.map(e => <Cell key={e.name} fill={MOOD_COLORS[e.name] || '#ccc'} />)}
                    </Pie>
                    <Tooltip formatter={(v, n) => [v, `${MOOD_EMOJI[n] || ''} ${n}`]} />
                    </PieChart>
                </ResponsiveContainer>
                <div className="flex-1 flex flex-col gap-2">
                    {moodPieData.map(d => (
                    <div key={d.name} className="flex items-center gap-2">
                        <div className="w-2.5 h-2.5 rounded-full flex-shrink-0" style={{ background: MOOD_COLORS[d.name] }} />
                        <span className="text-xs text-charcoal dark:text-charcoal-dark flex-1">{MOOD_EMOJI[d.name]} {d.name}</span>
                        <span className="text-xs font-semibold text-muted">{d.value}</span>
                    </div>
                    ))}
                </div>
                </div>
            )}
            </Card>

            <Card>
            <SectionHeader icon={TrendingUp} title="Mood Trend" iconColor="#e8899a" />
            {moodTimeline.length === 0 ? noData('No data yet') : (
                <ResponsiveContainer width="100%" height={170}>
                <LineChart data={moodTimeline}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#e8dde2" />
                    <XAxis dataKey="date" tick={{ fontSize: 10, fill: '#8a7880' }} />
                    <YAxis domain={[1, 5]} ticks={[1, 2, 3, 4, 5]} tick={{ fontSize: 10, fill: '#8a7880' }} />
                    <Tooltip formatter={(v) => [{ 5: '😄 great', 4: '😊 good', 3: '😐 neutral', 2: '😔 bad', 1: '😢 terrible' }[v] || v, 'Mood']} />
                    <Line type="monotone" dataKey="score" stroke="#c0526a" strokeWidth={2} dot={{ fill: '#e8899a', r: 3 }} />
                </LineChart>
                </ResponsiveContainer>
            )}
            </Card>
        </div>

          {/* Sleep */}
        <Card>
            <SectionHeader icon={Moon} title="Sleep Duration" iconColor="#c4b5d4" />
            {sleepTimeline.length === 0 ? noData('No sleep data for this period') : (
            <ResponsiveContainer width="100%" height={210}>
                <BarChart data={sleepTimeline}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e8dde2" vertical={false} />
                <XAxis dataKey="date" tick={{ fontSize: 10, fill: '#8a7880' }} />
                <YAxis unit="h" tick={{ fontSize: 10, fill: '#8a7880' }} />
                <Tooltip formatter={(v) => [`${v}h`, 'Sleep']} />
                <Bar dataKey="hours" fill="#c4b5d4" radius={[6, 6, 0, 0]} />
                </BarChart>
            </ResponsiveContainer>
            )}
        </Card>

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