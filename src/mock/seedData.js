import { format, subDays, addDays } from 'date-fns'

const today = new Date()
const fmt = (d) => format(d, 'yyyy-MM-dd')

// ── Users & Profiles ──────────────────────────────────────────────────────
export const DEMO_USER = {
  id: 1,
  full_name: 'Sarah Johnson',
  email: 'sarah@demo.com',
}

export const DEMO_PARTNER_USER = {
  id: 2,
  full_name: 'James Johnson',
  email: 'james@demo.com',
}

export const DEMO_PROFILE = {
  id: 1,
  user: DEMO_USER,
  full_name: 'Sarah Johnson',
  role: 'mother',
  due_date: fmt(addDays(today, 84)),
  pregnancy_start_date: fmt(subDays(today, 196)),
  unique_code: 'SARAH42',
  partner: {
    id: 2,
    full_name: 'James Johnson',
    unique_code: 'JAMES99',
  },
}

export const DEMO_PARTNER_PROFILE = {
  id: 2,
  user: DEMO_PARTNER_USER,
  full_name: 'James Johnson',
  role: 'husband',
  unique_code: 'JAMES99',
  partner: {
    id: 1,
    full_name: 'Sarah Johnson',
    unique_code: 'SARAH42',
  },
}

// ── Pregnancy Status ──────────────────────────────────────────────────────
export const DEMO_PREGNANCY_STATUS = {
  weeks_pregnant: 28,
  days_pregnant: 196,
  trimester: 3,
  due_date: fmt(addDays(today, 84)),
  days_until_due: 84,
  progress_percentage: 70,
}

// ── Daily Logs ────────────────────────────────────────────────────────────
const MOODS = ['great', 'good', 'good', 'neutral', 'good', 'great', 'bad', 'good', 'neutral', 'great',
               'good', 'great', 'bad', 'neutral', 'good', 'great', 'good', 'terrible', 'neutral', 'good',
               'great', 'good', 'neutral', 'good', 'great', 'bad', 'good', 'great', 'neutral', 'good']

const COMPLAINTS = [
  'Mild back pain in the morning', 'Nausea after breakfast', '', 'Swollen ankles',
  '', 'Heartburn in the evening', '', 'Leg cramps at night', '', 'Fatigue',
  '', 'Round ligament pain', '', '', 'Morning sickness', '', 'Braxton Hicks',
  '', 'Hip discomfort', '', '', '', 'Shortness of breath', '', '', '', '', '', '', '',
]

const NOTES = [
  'Felt baby kick for the first time today! 💕', 'Had a lovely walk in the park.',
  'Craving ice cream again.', 'Prenatal yoga was relaxing.', 'Doctor said everything looks great!',
  '', "Baby shower planning is exciting.", '', 'Finished setting up the nursery.',
  'Read a chapter of the baby book.', '', 'Partner felt the baby kick!', '',
  'Tried a new pregnancy-safe smoothie recipe.', '', 'Nesting instinct is real.',
  '', 'Had a long bath, felt so good.', '', 'Practiced breathing exercises.',
  '', '', 'Baby is very active today.', '', 'Bought some cute onesies!', '', '', '', '', '',
]

export const DEMO_LOGS = Array.from({ length: 30 }, (_, i) => ({
  id: i + 1,
  date: fmt(subDays(today, i)),
  mood: MOODS[i],
  sleep_duration: (5.5 + Math.round((Math.sin(i) + 1.5) * 10) / 10).toFixed(1),
  exercise_duration: [30, 0, 45, 20, 60, 0, 30, 15, 45, 0, 30, 60, 0, 20, 30,
                      45, 0, 30, 15, 60, 0, 30, 20, 45, 0, 30, 60, 15, 30, 0][i],
  complaints: COMPLAINTS[i],
  notes: NOTES[i],
  created_at: new Date(subDays(today, i)).toISOString(),
}))

export const DEMO_PARTNER_LOGS = Array.from({ length: 25 }, (_, i) => ({
  id: 100 + i,
  date: fmt(subDays(today, i)),
  mood: ['good', 'great', 'neutral', 'good', 'good', 'great', 'neutral', 'bad', 'good', 'great',
         'good', 'neutral', 'great', 'good', 'good', 'neutral', 'great', 'bad', 'good', 'great',
         'good', 'neutral', 'great', 'good', 'good'][i],
  sleep_duration: (6 + Math.round((Math.cos(i) + 1) * 10) / 10).toFixed(1),
  exercise_duration: [45, 30, 0, 60, 30, 0, 45, 20, 30, 60, 0, 30, 45, 0, 60,
                      30, 0, 45, 20, 30, 0, 60, 30, 45, 0][i],
  complaints: '',
  notes: ["Supported Sarah with meal prep.", "Morning run felt great.", "",
          "Worked late but checked in on Sarah.", "Read about third trimester together.", "",
          "Assembled the baby crib!", "", "Attended birthing class with Sarah.", "",
          "Made Sarah's favourite soup.", "", "", "Felt the baby kick — incredible!",
          "", "", "Did the nursery painting.", "", "", "Late night cravings run for Sarah 😄",
          "", "", "", "", ""][i],
  created_at: new Date(subDays(today, i)).toISOString(),
}))

// ── Appointments ──────────────────────────────────────────────────────────
export const DEMO_APPOINTMENTS = [
  {
    id: 1,
    title: '32-Week OB Check-up',
    doctor_name: 'Dr. Emily Chen',
    location: 'City Maternity Hospital, Room 204',
    appointment_date: addDays(today, 7).toISOString(),
    notes: 'Bring birth plan draft. Ask about Group B strep test.',
    reminder_days_before: 2,
    is_completed: false,
  },
  {
    id: 2,
    title: 'Glucose Tolerance Test',
    doctor_name: 'Dr. Emily Chen',
    location: 'City Maternity Hospital, Lab Wing',
    appointment_date: addDays(today, 14).toISOString(),
    notes: 'Fast for 8 hours before. Bring snacks for after.',
    reminder_days_before: 1,
    is_completed: false,
  },
  {
    id: 3,
    title: 'Prenatal Yoga Class',
    doctor_name: 'Instructor Maya Patel',
    location: 'Harmony Wellness Studio',
    appointment_date: addDays(today, 3).toISOString(),
    notes: 'Bring yoga mat and water bottle.',
    reminder_days_before: 1,
    is_completed: false,
  },
  {
    id: 4,
    title: 'Birthing Class — Week 3',
    doctor_name: 'Midwife Linda Torres',
    location: 'Sunrise Birth Center',
    appointment_date: addDays(today, 10).toISOString(),
    notes: 'Partner is coming too. Breathing exercises session.',
    reminder_days_before: 1,
    is_completed: false,
  },
  {
    id: 5,
    title: '20-Week Anatomy Scan',
    doctor_name: 'Dr. Emily Chen',
    location: 'City Maternity Hospital',
    appointment_date: subDays(today, 56).toISOString(),
    notes: 'Everything looked perfect!',
    reminder_days_before: 2,
    is_completed: true,
  },
  {
    id: 6,
    title: 'First Trimester Screening',
    doctor_name: 'Dr. Emily Chen',
    location: 'City Maternity Hospital',
    appointment_date: subDays(today, 140).toISOString(),
    notes: 'NT scan + bloodwork. All clear.',
    reminder_days_before: 1,
    is_completed: true,
  },
  {
    id: 7,
    title: 'Prenatal Nutrition Consult',
    doctor_name: 'Dietitian Rachel Kim',
    location: 'Wellness Center, Suite 3B',
    appointment_date: subDays(today, 30).toISOString(),
    notes: 'Got a customised meal plan.',
    reminder_days_before: 1,
    is_completed: true,
  },
]

export const DEMO_PARTNER_APPOINTMENTS = [
  {
    id: 21,
    title: 'Support at OB Check-up',
    doctor_name: 'Dr. Emily Chen',
    location: 'City Maternity Hospital, Room 204',
    appointment_date: addDays(today, 7).toISOString(),
    notes: 'Going with Sarah for the 32-week check-up.',
    is_completed: false,
  },
  {
    id: 22,
    title: 'Birthing Class — Week 3',
    doctor_name: 'Midwife Linda Torres',
    location: 'Sunrise Birth Center',
    appointment_date: addDays(today, 10).toISOString(),
    notes: 'Joint session with Sarah.',
    is_completed: false,
  },
]

// ── Statistics ────────────────────────────────────────────────────────────
const buildTimeline = (logs, days) =>
  logs.slice(0, days).reverse().map((l) => ({
    date: l.date,
    sleep_duration: l.sleep_duration,
    exercise_duration: String(l.exercise_duration),
    mood: l.mood,
  }))

const moodDist = (logs) =>
  logs.reduce(
    (acc, l) => ({ ...acc, [l.mood]: (acc[l.mood] || 0) + 1 }),
    { great: 0, good: 0, neutral: 0, bad: 0, terrible: 0 }
  )

const avg = (arr, key) =>
  arr.length ? (arr.reduce((s, i) => s + parseFloat(i[key]), 0) / arr.length).toFixed(1) : 0

export function buildSummaryStats(period, logs = DEMO_LOGS) {
  const slice = period === 'weekly' ? logs.slice(0, 7) : period === 'monthly' ? logs.slice(0, 30) : logs
  const dist = moodDist(slice)
  const mostCommonMood = Object.entries(dist).sort((a, b) => b[1] - a[1])[0]?.[0]
  return {
    total_logs: slice.length,
    average_sleep_hours: avg(slice, 'sleep_duration'),
    average_exercise_minutes: avg(slice, 'exercise_duration'),
    most_common_mood: mostCommonMood,
    mood_distribution: dist,
  }
}

export function buildMoodStats(period, logs = DEMO_LOGS) {
  const slice = period === 'weekly' ? logs.slice(0, 7) : period === 'monthly' ? logs.slice(0, 30) : logs
  return {
    mood_distribution: moodDist(slice),
    timeline: buildTimeline(slice, slice.length),
  }
}

export function buildSleepStats(period, logs = DEMO_LOGS) {
  const slice = period === 'weekly' ? logs.slice(0, 7) : period === 'monthly' ? logs.slice(0, 30) : logs
  return {
    average_sleep_hours: avg(slice, 'sleep_duration'),
    timeline: buildTimeline(slice, slice.length),
  }
}

export function buildExerciseStats(period, logs = DEMO_LOGS) {
  const slice = period === 'weekly' ? logs.slice(0, 7) : period === 'monthly' ? logs.slice(0, 30) : logs
  return {
    average_exercise_minutes: avg(slice, 'exercise_duration'),
    timeline: buildTimeline(slice, slice.length),
  }
}

export const DEMO_STREAKS = {
  current_streak_days: 14,
  longest_streak_days: 22,
  total_logged_days: 30,
}