import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Heart } from 'lucide-react'
import { profileApi } from '../api/services'
import useAuthStore from '../store/authStore'
import Button from '../components/ui/Button'
import Input from '../components/ui/Input'
import { Alert } from '../components/ui/Card'

export default function ProfileSetupPage() {
  const { fetchProfile } = useAuthStore()
  const navigate = useNavigate()
  const [role, setRole] = useState('')
  const [dueDate, setDueDate] = useState('')
  const [startDate, setStartDate] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!role) { setError('Please select your role.'); return }
    setIsLoading(true); setError('')
    try {
      const payload = { role }
      if (role === 'mother') {
        payload.due_date = dueDate
        if (startDate) payload.pregnancy_start_date = startDate
      }
      await profileApi.setup(payload)
      await fetchProfile()
      navigate('/dashboard')
    } catch (err) {
      setError(err.response?.data?.message || 'Setup failed. Please try again.')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-cream flex items-center justify-center px-5 py-10">
      <div className="bg-white rounded-3xl p-10 w-full max-w-md shadow-lg border border-border animate-fade-up">
        <div className="text-center mb-9">
          <div className="w-14 h-14 rounded-full bg-gradient-to-br from-blush to-rose flex items-center justify-center mx-auto mb-4">
            <Heart size={24} fill="white" color="white" />
          </div>
          <h1 className="font-display text-[1.8rem] font-bold text-charcoal mb-2">Set up your profile</h1>
          <p className="text-muted text-sm">Tell us a little about yourself to personalize Bloom for you.</p>
        </div>

        <form onSubmit={handleSubmit} className="flex flex-col gap-6">
          {error && <Alert type="error">{error}</Alert>}

          {/* Role selector */}
          <div>
            <p className="text-[0.75rem] font-semibold text-muted uppercase tracking-widest mb-3">I am the</p>
            <div className="grid grid-cols-2 gap-3">
              {[
                { value: 'mother',  emoji: '🤱', label: 'Mother' },
                { value: 'husband', emoji: '👨', label: 'Husband / Partner' },
              ].map((r) => (
                <button
                  key={r.value}
                  type="button"
                  onClick={() => setRole(r.value)}
                  className={[
                    'p-5 rounded-2xl border-2 cursor-pointer transition-all duration-200 text-center',
                    role === r.value
                      ? 'border-rose-deep bg-rose-deep/6'
                      : 'border-border bg-white hover:border-rose-deep/40',
                  ].join(' ')}
                >
                  <div className="text-[1.8rem] mb-2">{r.emoji}</div>
                  <div className={`font-semibold text-sm ${role === r.value ? 'text-rose-deep' : 'text-charcoal'}`}>
                    {r.label}
                  </div>
                </button>
              ))}
            </div>
          </div>

          {role === 'mother' && (
            <div className="flex flex-col gap-4 animate-fade-up">
              <Input label="Due Date *" type="date" value={dueDate}
                onChange={(e) => setDueDate(e.target.value)} required
                hint="The expected delivery date for your baby" />
              <Input label="Pregnancy Start Date" type="date" value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                hint="First day of your last menstrual period (optional)" />
            </div>
          )}

          <Button type="submit" fullWidth isLoading={isLoading} size="lg">
            Complete setup
          </Button>
        </form>
      </div>
    </div>
  )
}
