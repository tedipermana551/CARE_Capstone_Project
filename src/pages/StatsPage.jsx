import React, { useState, useEffect } from 'react'
import {
BarChart, Bar, LineChart, Line, PieChart, Pie, Cell,
XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid
} from 'recharts'
import { format, parseISO } from 'date-fns'
import { Moon, Dumbbell, Heart, Flame, Trophy, TrendingUp, Calendar } from 'lucide-react'
import { statsApi } from '../api/services'
import { Card, StatCard, Spinner } from '../components/ui/Card'
import DashboardLayout from '../components/layout/DashboardLayout'

const MOOD_COLORS = { great: '#8aab96', good: '#4a9d6f', neutral: '#e8b86d', bad: '#e8899a', terrible: '#c0526a' }
const MOOD_EMOJI  = { great: '😄', good: '😊', neutral: '😐', bad: '😔', terrible: '😢' }
const PERIODS     = [{ value: 'weekly', label: 'This Week' }, { value: 'monthly', label: 'This Month' }, { value: 'all', label: 'All Time' }]

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

export default function StatsPage() {
const [period, setPeriod] = useState('monthly')
const [summary, setSummary] = useState(null)
const [moodData, setMoodData] = useState(null)
const [sleepData, setSleepData] = useState(null)
const [exerciseData, setExerciseData] = useState(null)
const [streakData, setStreakData] = useState(null)
const [loading, setLoading] = useState(true)

useEffect(() => {
    const load = async () => {
    setLoading(true)
    try {
        const params = { period }
        const [s, m, sl, ex, st] = await Promise.allSettled([
        statsApi.summary(params), statsApi.mood(params), statsApi.sleep(params),
        statsApi.exercise(params), statsApi.streaks(),
        ])
        const safeData = (result) =>
          result.status === 'fulfilled' ? (result.value?.data?.data ?? null) : null

        setSummary(safeData(s))
        setMoodData(safeData(m))
        setSleepData(safeData(sl))
        setExerciseData(safeData(ex))
        setStreakData(safeData(st))
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
const exTimeline    = exerciseData?.timeline?.map(d => ({ date: format(parseISO(d.date), 'MMM d'), minutes: parseFloat(d.exercise_duration) })) || []
const moodTimeline  = moodData?.timeline?.map(d => ({
    date: format(parseISO(d.date), 'MMM d'),
    score: { great: 5, good: 4, neutral: 3, bad: 2, terrible: 1 }[d.mood] || 3,
})) || []

const noData = (msg) => <p className="text-muted text-sm text-center py-8">{msg}</p>

return (
    <DashboardLayout activePage="stats">
    <div className="flex justify-between items-start mb-7 flex-wrap gap-3">
        <div>
        <h1 className="text-4xl md:text-5xl font-bold text-charcoal dark:text-charcoal-dark tracking-tight mb-1">My Statistics</h1>
        <p className="text-muted dark:text-muted-dark text-sm">Insights into your wellness journey</p>
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
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3.5">
            <StatCard title="Total logs"     value={summary?.total_logs ?? '—'}  bg="bg-rose/15"  icon={<Calendar className="text-rose-500"/>} color="#e8899a" />
            <StatCard title="Current streak" value={`${streakData?.current_streak_days ?? '—'} days`} bg="bg-rose/15"  icon={<Flame className="text-orange-500"/>}    color="#e8b86d" />
            <StatCard title="Longest streak" value={`${streakData?.longest_streak_days ?? '—'} days`} bg="bg-rose/15"  icon={<Trophy className="text-yellow-500"/>}   color="#8aab96" />
            <StatCard title="Avg. sleep"     value={summary ? `${summary.average_sleep_hours}h` : '—'} bg="bg-lavender/20"  icon={<Moon className="text-purple-500"/>}     color="#c4b5d4" />
            <StatCard title="Avg. exercise"  value={summary ? `${summary.average_exercise_minutes}m` : '—'} bg="bg-sage/15" icon={<Dumbbell className="text-emerald-500"/>} color="#8aab96" />
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

          {/* Exercise */}
        <Card>
            <SectionHeader icon={Dumbbell} title="Exercise Duration" iconColor="#8aab96" />
            {exTimeline.length === 0 ? noData('No exercise data for this period') : (
            <ResponsiveContainer width="100%" height={210}>
                <BarChart data={exTimeline}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e8dde2" vertical={false} />
                <XAxis dataKey="date" tick={{ fontSize: 10, fill: '#8a7880' }} />
                <YAxis unit="m" tick={{ fontSize: 10, fill: '#8a7880' }} />
                <Tooltip formatter={(v) => [`${v}m`, 'Exercise']} />
                <Bar dataKey="minutes" fill="#8aab96" radius={[6, 6, 0, 0]} />
                </BarChart>
            </ResponsiveContainer>
            )}
        </Card>

        </div>
    )}
    </DashboardLayout>
)
}