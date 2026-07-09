import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { userApi } from '@/services/api'
import { useAuthStore } from '@/store/authStore'
import type { User } from '@/types'

const LEVELS = [
  { name: 'Bronze Rider', min: 0, max: 100, color: '#CD7F32' },
  { name: 'Silver Rider', min: 100, max: 250, color: '#C0C0C0' },
  { name: 'Gold Rider', min: 250, max: 500, color: '#FFD700' },
  { name: 'Platinum Rider', min: 500, max: 1000, color: '#00D26A' },
]

export default function Rewards() {
  const navigate = useNavigate()
  const { isAuthenticated } = useAuthStore()
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!isAuthenticated) { navigate('/login'); return }
    userApi.getRewards()
      .then(setUser)
      .catch(console.error)
      .finally(() => setLoading(false))
  }, [isAuthenticated, navigate])

  const level = LEVELS.find((l) => (user?.userLevel ?? '').includes(l.name.split(' ')[0])) ?? LEVELS[0]
  const progress = user ? Math.min(((user.loyaltyPoints - level.min) / (level.max - level.min)) * 100, 100) : 0

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="w-10 h-10 border-2 border-[#00D26A] border-t-transparent rounded-full animate-spin" />
    </div>
  )

  return (
    <div className="min-h-screen pt-24 pb-28 md:pb-8 px-5 md:max-w-2xl md:mx-auto">
      <h1 className="text-3xl font-black tracking-tight text-[#e5e2e1] mb-8 animate-fade-up">Loyalty Rewards</h1>

      {/* Level Card */}
      <div className="glass-panel rounded-3xl p-6 mb-6 border border-white/10 animate-fade-up">
        <div className="flex items-center gap-4 mb-6">
          <div className="w-16 h-16 rounded-full flex items-center justify-center text-3xl" style={{ background: `${level.color}20` }}>
            <span className="material-symbols-outlined icon-filled text-4xl" style={{ color: level.color }}>military_tech</span>
          </div>
          <div>
            <p className="text-xs text-[#8e9192] uppercase tracking-widest">Current Tier</p>
            <p className="text-2xl font-black" style={{ color: level.color }}>{user?.userLevel ?? 'Bronze Rider'}</p>
          </div>
        </div>

        {/* Progress Bar */}
        <div className="mb-3">
          <div className="flex justify-between text-xs text-[#8e9192] mb-2">
            <span>{user?.loyaltyPoints ?? 0} pts</span>
            <span>{level.max} pts to next tier</span>
          </div>
          <div className="h-2 bg-[#2D2D2D] rounded-full overflow-hidden">
            <div
              className="h-full rounded-full transition-all duration-1000"
              style={{ width: `${progress}%`, background: level.color }}
            />
          </div>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 gap-4 mb-6 animate-fade-up" style={{ animationDelay: '0.05s' }}>
        <div className="glass-panel rounded-2xl p-5 text-center">
          <span className="material-symbols-outlined text-[#00D26A] text-3xl mb-2 block">star</span>
          <p className="text-3xl font-black text-[#e5e2e1]">{user?.loyaltyPoints ?? 0}</p>
          <p className="text-xs text-[#8e9192] mt-1">Loyalty Points</p>
        </div>
        <div className="glass-panel rounded-2xl p-5 text-center">
          <span className="material-symbols-outlined text-[#00D26A] text-3xl mb-2 block">eco</span>
          <p className="text-3xl font-black text-[#e5e2e1]">{user?.co2Saved?.toFixed(1) ?? '0.0'}</p>
          <p className="text-xs text-[#8e9192] mt-1">kg CO₂ Saved</p>
        </div>
      </div>

      {/* Tier Progression */}
      <div className="glass-panel rounded-2xl p-5 animate-fade-up" style={{ animationDelay: '0.1s' }}>
        <h3 className="text-sm font-bold text-[#8e9192] uppercase tracking-widest mb-4">Tier Progression</h3>
        <div className="flex flex-col gap-3">
          {LEVELS.map((l) => (
            <div key={l.name} className={`flex items-center gap-3 p-3 rounded-xl transition-colors ${
              user?.userLevel?.includes(l.name.split(' ')[0]) ? 'bg-white/5 border border-white/10' : ''
            }`}>
              <span className="material-symbols-outlined icon-filled text-2xl" style={{ color: l.color }}>military_tech</span>
              <div className="flex-1">
                <p className="font-semibold text-[#e5e2e1] text-sm">{l.name}</p>
                <p className="text-xs text-[#8e9192]">{l.min}–{l.max} points</p>
              </div>
              {user?.userLevel?.includes(l.name.split(' ')[0]) && (
                <span className="text-xs font-bold text-[#00D26A] bg-[#00D26A]/10 px-2 py-1 rounded-full">Current</span>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
