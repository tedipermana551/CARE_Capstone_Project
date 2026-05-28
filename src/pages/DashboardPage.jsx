import React, { useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Flame, Moon, Dumbbell, Heart, Clock3, ArrowRight, CheckCircle2, Baby, Copy, CheckCheck, Link2, ChevronLeft } from 'lucide-react'
import { format, parseISO } from 'date-fns'
import useAuthStore from '../store/authStore'
import usePregnancyStore from '../store/pregnancyStore'
import { profileApi } from '../api/services'
import DashboardLayout from '../components/layout/DashboardLayout'
import { Card, StatCard, Spinner, EmptyState } from '../components/ui/Card'

const MOOD_EMOJI = { great: '😄', good: '😊', neutral: '😐', bad: '😔', terrible: '😢' }

function safeFormat(dateStr, pattern, fallback = '—') {
  try { return dateStr ? format(parseISO(dateStr), pattern) : fallback }
  catch { return fallback }
}

export default function DashboardPage() {
  const navigate = useNavigate()
  const profile = useAuthStore((state) => state.profile)
  const pregnancyStatus = usePregnancyStore((state) => state.pregnancyStatus)
  const summaryStats = usePregnancyStore((state) => state.summaryStats)
  const streakStats = usePregnancyStore((state) => state.streakStats)
  const upcomingAppointments = usePregnancyStore((state) => state.upcomingAppointments)
  const isLoading = usePregnancyStore((state) => state.isLoading)
  const fetchAllDashboard = usePregnancyStore((state) => state.fetchAllDashboard)

  const [partnerCode, setPartnerCode] = useState('')
  const [copied, setCopied] = useState(false)
  const [showPartnerLink, setShowPartnerLink] = useState(false)
  const [isLinking, setIsLinking] = useState(false)

  useEffect(() => { fetchAllDashboard() }, [])

  const copyCode = () => {
    navigator.clipboard.writeText(myCode)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const handleLinkPartner = async () => {
    if (!partnerCode.trim()) return
    setIsLinking(true)
    try {
      await profileApi.linkPartner(partnerCode)
      setShowPartnerLink(false)
      setPartnerCode('')
    } catch (err) { console.log(err) }
    finally { setIsLinking(false) }
  }

  const progress = pregnancyStatus?.progress_percentage ?? 0
  const myCode = profile?.unique_code || ''
  const isPartner = profile?.role === 'husband'

  return (
    <DashboardLayout activePage="dashboard">
      {/* RESPONSIVE FIX R5: smaller margin-bottom and heading on mobile */}
      <header className="mb-6 md:mb-10">
        <p className="text-[11px] tracking-[3px] uppercase text-muted dark:text-muted-dark font-bold mb-2">
          {format(new Date(), 'EEEE, MMMM d')}
        </p>
        <h1 className="text-4xl md:text-5xl font-bold text-charcoal dark:text-charcoal-dark tracking-tight">
          Hello, {profile?.full_name?.split(' ')[0] || 'User'} 👋
        </h1>
      </header>

      {isLoading ? (
        <div className="text-center py-20 text-muted font-semibold">Loading dashboard...</div>
      ) : (
        <>
          {/* MOTHER PREGNANCY CARD
              RESPONSIVE FIX R3:
              - p-10 → p-6 md:p-10
              - rounded-[2.5rem] → rounded-[1.5rem] md:rounded-[2.5rem]
              - flex justify-between → flex flex-col sm:flex-row (stacks on small phones)
              - text-7xl → text-5xl md:text-7xl
              - mb-10 → mb-6 md:mb-10
          */}
          {!isPartner && pregnancyStatus && (
            <section className="bg-[#B05B6F] rounded-[1.5rem] md:rounded-[2.5rem] p-6 md:p-10 text-white mb-6 md:mb-8 relative overflow-hidden shadow-xl shadow-rose-deep/10">
              <div className="flex flex-col sm:flex-row justify-between items-start mb-6 md:mb-10 gap-4">
                <div>
                  <p className="text-[11px] tracking-[2px] uppercase opacity-80 font-bold mb-3 md:mb-4">Pregnancy Progress</p>
                  <div className="flex items-baseline gap-3">
                    <h2 className="text-5xl md:text-7xl font-bold italic">{pregnancyStatus?.weeks_pregnant ?? '—'}</h2>
                    <span className="text-xl md:text-2xl opacity-90 font-medium">weeks</span>
                  </div>
                  <p className="text-base md:text-lg mt-2 md:mt-3 opacity-90 font-medium">
                    Trimester {pregnancyStatus?.trimester ?? '—'} • {pregnancyStatus?.days_until_due ?? '—'} days until due date
                  </p>
                </div>
                <div className="flex sm:flex-col items-center sm:items-end gap-3">
                  <Baby size={30} className="opacity-40" />
                  <div className="bg-white/20 backdrop-blur-md px-4 py-2 rounded-full text-sm font-semibold border border-white/30 whitespace-nowrap">
                    Due {safeFormat(pregnancyStatus?.due_date, 'MMM d, yyyy')}
                  </div>
                </div>
              </div>
              <div>
                <div className="flex justify-between text-[10px] font-bold mb-3 opacity-80 uppercase tracking-widest">
                  <span>0 weeks</span><span>{progress}% complete</span><span>40 weeks</span>
                </div>
                <div className="w-full h-3 bg-white/10 rounded-full overflow-hidden border border-white/10">
                  <div className="h-full bg-white rounded-full transition-all duration-700" style={{ width: `${progress}%` }} />
                </div>
              </div>
            </section>
          )}

          {/* HUSBAND CARD — RESPONSIVE FIX R4: same padding + font scale fixes */}
          {isPartner && (
            <section className="bg-[#1F2937] rounded-[1.5rem] md:rounded-[2.5rem] p-6 md:p-10 text-white mb-6 md:mb-8 shadow-xl">
              <p className="text-[11px] tracking-[2px] uppercase opacity-70 font-bold mb-3 md:mb-4">Partner Support</p>
              <h2 className="text-4xl md:text-5xl font-bold mb-3">You're doing great 👨</h2>
              <p className="opacity-80 text-base md:text-lg">Stay involved with appointments, logs, and emotional support.</p>
            </section>
          )}

          {/* STATS GRID — already responsive (grid-cols-1 md:grid-cols-2 lg:grid-cols-4) */}
          <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6 mb-6 md:mb-10">
            <StatCard title="Logging Streak" value={streakStats?.current_streak_days ?? 0}               sub={`${streakStats?.total_logged_days ?? 0} total days`} icon={<Flame className="text-orange-500" />}   bg="bg-orange-50 dark:bg-orange-500/10" />
            <StatCard title="Avg. Sleep"     value={`${summaryStats?.average_sleep_hours ?? 0}h`}        sub="this month"                                          icon={<Moon className="text-purple-500" />}    bg="bg-purple-50 dark:bg-purple-500/10" />
            <StatCard title="Avg. Exercise"  value={`${summaryStats?.average_exercise_minutes ?? 0}m`}   sub="per day"                                             icon={<Dumbbell className="text-emerald-500" />} bg="bg-emerald-50 dark:bg-emerald-500/10" />
            <StatCard title="Common Mood"    value={summaryStats?.most_common_mood || '—'}               sub="this month"                                          icon={<Heart className="text-rose-500" />}    bg="bg-rose-50 dark:bg-rose-500/10" emoji={MOOD_EMOJI[summaryStats?.most_common_mood] || '😊'} />
          </section>

          {/* BOTTOM SECTION
              RESPONSIVE FIX R8: reduced padding on inner cards for mobile (p-8 → p-5 md:p-8)
              gap-8 → gap-5 md:gap-8
          */}
          <section className="grid grid-cols-1 lg:grid-cols-5 gap-5 md:gap-8">
            {/* UPCOMING APPOINTMENTS */}
            <div className="lg:col-span-3 bg-white dark:bg-dark rounded-[1.5rem] md:rounded-[2rem] border border-border dark:border-border-dark p-5 md:p-8 shadow-sm">
              <div className="flex justify-between items-center mb-6 md:mb-8">
                <h2 className="text-xl md:text-2xl font-bold text-charcoal dark:text-charcoal-dark tracking-tight">Upcoming</h2>
                <Link to="/appointments" className="text-rose-deep text-sm font-bold flex items-center gap-1 hover:underline no-underline">
                  View all <ArrowRight size={16} />
                </Link>
              </div>
              <div className="space-y-4">
                {!Array.isArray(upcomingAppointments) || upcomingAppointments.length === 0 ? (
                  <div className="text-muted text-sm">
                    No upcoming appointments.
                    <button onClick={() => navigate('/appointments')} className="w-full py-3 md:py-4 border-2 border-rose-deep text-rose-deep font-bold rounded-xl hover:bg-rose-deep hover:text-white transition-all">
                      Add appointment
                    </button>
                  </div>
                ) : (upcomingAppointments.slice(0, 3).map((appt) => (
                    <div key={appt.id} className="group p-4 md:p-5 bg-[#FAF7F4] dark:bg-[#1B1B1B] border border-transparent rounded-2xl transition-all">
                      <h4 className="font-bold text-charcoal dark:text-charcoal-dark text-base md:text-lg mb-1">{appt.title}</h4>
                      <div className="flex items-center gap-4 md:gap-6 mt-2 md:mt-3 flex-wrap">
                        <div className="flex items-center gap-2 text-[10px] text-muted font-bold uppercase tracking-wider">
                          <Clock3 size={14} className="text-rose-deep" />
                          {safeFormat(appt.appointment_date, 'MMM d • h:mm a')}
                        </div>
                        <div className="text-[10px] text-muted font-bold opacity-60 uppercase tracking-widest">Dr. {appt.doctor_name}</div>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>

            {/* RIGHT SIDE */}
            <div className="lg:col-span-2 space-y-5 md:space-y-6">
              {/* PARTNER CONNECTION */}
              <div className="bg-white dark:bg-dark rounded-[1.5rem] md:rounded-[2rem] border border-border dark:border-border-dark p-5 md:p-8 shadow-sm">
                <h2 className="text-xl md:text-2xl font-bold text-charcoal dark:text-charcoal-dark tracking-tight mb-5 md:mb-6">Partner Connection</h2>
                {profile?.partner ? (
                  <>
                    <div className="bg-emerald-50 dark:bg-emerald-500/10 border border-emerald-100 dark:border-emerald-500/20 p-4 md:p-5 rounded-2xl flex items-center gap-4 mb-6 md:mb-8">
                      <div className="bg-emerald-500 text-white p-1.5 rounded-full"><CheckCircle2 size={20} /></div>
                      <div>
                        <p className="font-bold text-charcoal dark:text-charcoal-dark leading-tight text-sm">Partner linked</p>
                        <p className="text-[11px] text-muted font-medium mt-1 uppercase tracking-wider italic">Sharing logs & appointments</p>
                      </div>
                    </div>
                    <button onClick={() => navigate('/partner-stats')} className="w-full py-3 md:py-4 border-2 border-rose-deep text-rose-deep font-bold rounded-xl hover:bg-rose-deep hover:text-white transition-all">
                      View partner stats
                    </button>
                  </>
                ) : (
                  <div>
                    <div className="bg-[#FAF7F4] dark:bg-[#1B1B1B] border border-border dark:border-border-dark rounded-2xl p-4 md:p-5 mb-4 md:mb-5">
                      <p className="text-[10px] tracking-[2px] uppercase text-muted font-bold mb-3">Your partner code</p>
                      <div className="flex items-center justify-between">
                        <code className="text-xl md:text-2xl tracking-[0.2em] font-bold text-rose-deep">{myCode}</code>
                        <button onClick={copyCode} className="p-2 rounded-xl border border-border dark:border-border-dark hover:border-rose-deep/30 transition-all">
                          {copied ? <CheckCheck size={16} className="text-emerald-500" /> : <Copy size={16} className="text-muted" />}
                        </button>
                      </div>
                    </div>
                    {!showPartnerLink ? (
                      <button onClick={() => setShowPartnerLink(true)} className="w-full py-3 md:py-4 border-2 border-rose-deep text-rose-deep font-bold rounded-xl hover:bg-rose-deep hover:text-white transition-all flex items-center justify-center gap-2">
                        <Link2 size={16} /> Enter partner code
                      </button>
                    ) : (
                      <div className="space-y-3">
                        <button onClick={() => setShowPartnerLink(false)} className="flex items-center gap-1 text-[10px] font-bold uppercase text-muted">
                          <ChevronLeft size={14} /> Back
                        </button>
                        <input
                          value={partnerCode}
                          onChange={(e) => setPartnerCode(e.target.value.toUpperCase())}
                          placeholder="PARTNER CODE"
                          className="w-full px-4 py-3 md:py-4 rounded-xl border border-border dark:border-border-dark dark:bg-[#1B1B1B] dark:text-charcoal-dark outline-none focus:border-rose-deep font-mono tracking-[0.15em]"
                        />
                        <button onClick={handleLinkPartner} disabled={isLinking} className="w-full py-3 md:py-4 bg-rose-deep text-white rounded-xl font-bold">
                          {isLinking ? 'Linking...' : 'Link partner'}
                        </button>
                      </div>
                    )}
                  </div>
                )}
              </div>
              {/* DAILY LOG CTA */}
              <div className="bg-[#FAF7F4] dark:bg-[#1B1B1B] rounded-[1.5rem] md:rounded-[2rem] p-5 md:p-8 border border-border dark:border-border-dark flex flex-col gap-4">
                <div>
                  <h3 className="font-bold text-charcoal dark:text-charcoal-dark text-lg italic">Log today's wellness</h3>
                  <p className="text-sm text-muted dark:text-muted-dark mt-1 font-medium">Track your mood and sleep.</p>
                </div>
                <button onClick={() => navigate('/logs')} className="bg-rose-deep text-white w-full py-3 md:py-4 rounded-xl font-bold flex items-center justify-center gap-2">
                  Open daily log <ArrowRight size={18} />
                </button>
              </div>
            </div>
          </section>
        </>
      )}
    </DashboardLayout>
  )
}
