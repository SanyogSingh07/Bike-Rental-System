import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { userApi } from '@/services/api'
import { useAuthStore } from '@/store/authStore'
import type { User } from '@/types'

const menuItems = [
  { icon: 'timer', label: 'Active Rentals', sub: 'Track your current ride', path: '/ride-status' },
  { icon: 'history', label: 'Rental History', sub: 'View past rides and receipts', path: '/history' },
  { icon: 'person', label: 'Personal Details', sub: 'Update your profile and preferences', path: '#' },
  { icon: 'favorite', label: 'Saved Bikes', sub: 'Your favorite VOLT models', path: '#' },
  { icon: 'military_tech', label: 'Loyalty Rewards', sub: 'Check your carbon offsets & points', path: '/rewards' },
  { icon: 'description', label: 'My Documents', sub: 'Driving license and ID', path: '#' },
  { icon: 'settings', label: 'Settings', sub: 'Preferences and notifications', path: '#' },
]

export default function Profile() {
  const navigate = useNavigate()
  const { isAuthenticated, username, logout } = useAuthStore()
  const [user, setUser] = useState<User | null>(null)

  useEffect(() => {
    if (!isAuthenticated) { navigate('/login'); return }
    userApi.getProfile().then(setUser).catch(console.error)
  }, [isAuthenticated, navigate])

  const handleLogout = () => {
    logout()
    navigate('/login')
  }

  const displayName = user?.username ?? username ?? 'Volt Rider'
  const displayEmail = user?.email ?? `${displayName.toLowerCase().replace(/\s+/g, '.')}@volt.com`

  return (
    <div className="min-h-screen pt-24 pb-28 md:pb-8 px-5 md:max-w-2xl md:mx-auto">
      {/* Profile Header */}
      <section className="flex flex-col items-center mb-10 animate-fade-up">
        <div className="w-24 h-24 rounded-full bg-[#353434] border-2 border-white/10 flex items-center justify-center mb-4 shadow-[0_0_30px_rgba(200,198,197,0.08)]">
          <span className="material-symbols-outlined text-[#8e9192] text-5xl">person</span>
        </div>
        <h1 className="text-2xl font-black text-[#e5e2e1] mb-1">{displayName}</h1>
        <div className="flex items-center gap-2">
          <span className="bg-[#111111] border border-white/10 rounded px-2 py-0.5 text-xs font-bold uppercase tracking-widest text-[#00D26A]">
            {user?.userLevel ?? 'PRO RIDER'}
          </span>
          <span className="text-sm text-[#8e9192]">{displayEmail}</span>
        </div>
        {user && (
          <div className="flex gap-6 mt-4 text-center">
            <div>
              <p className="text-xl font-black text-[#e5e2e1]">{user.loyaltyPoints}</p>
              <p className="text-xs text-[#8e9192]">Points</p>
            </div>
            <div className="w-px bg-white/10" />
            <div>
              <p className="text-xl font-black text-[#e5e2e1]">{user.co2Saved.toFixed(1)} kg</p>
              <p className="text-xs text-[#8e9192]">CO₂ Saved</p>
            </div>
          </div>
        )}
      </section>

      <section className="glass-panel rounded-3xl p-5 mb-6 border border-[#00D26A]/15 animate-fade-up">
        <div className="flex items-center justify-between mb-4">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.25em] text-[#00D26A]">Membership</p>
            <h2 className="text-xl font-black text-[#e5e2e1] mt-1">Your mobility snapshot</h2>
          </div>
          <span className="px-3 py-1 rounded-full border border-white/10 text-xs font-semibold uppercase tracking-widest text-[#c8c6c5]">Pro Rider</span>
        </div>
        <div className="grid grid-cols-3 gap-3">
          {[
            { label: 'Trips', value: '24' },
            { label: 'Points', value: user?.loyaltyPoints?.toString() ?? '2450' },
            { label: 'CO₂', value: `${user?.co2Saved?.toFixed(1) ?? '18.4'} kg` },
          ].map(({ label, value }) => (
            <div key={label} className="rounded-2xl bg-[#111111]/70 p-3 text-center">
              <p className="text-lg font-black text-[#e5e2e1]">{value}</p>
              <p className="text-xs text-[#8e9192] mt-1">{label}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Menu */}
      <section className="flex flex-col gap-3 animate-fade-up" style={{ animationDelay: '0.05s' }}>
        {menuItems.map(({ icon, label, sub, path }) => (
          <button
            key={label}
            onClick={() => path !== '#' && navigate(path)}
            className="group glass-panel rounded-2xl p-4 flex items-center justify-between hover:border-white/20 transition-all duration-200 active:scale-[0.98] w-full text-left"
          >
            <div className="flex items-center gap-4">
              <div className="w-10 h-10 rounded-full bg-[#2b2a2a] flex items-center justify-center text-[#c8c6c5] group-hover:text-[#00D26A] transition-colors flex-shrink-0">
                <span className="material-symbols-outlined">{icon}</span>
              </div>
              <div>
                <p className="font-bold text-[#e5e2e1] text-base">{label}</p>
                <p className="text-sm text-[#8e9192]">{sub}</p>
              </div>
            </div>
            <span className="material-symbols-outlined text-[#8e9192] group-hover:text-[#c8c6c5] transition-colors">chevron_right</span>
          </button>
        ))}

        {/* Logout */}
        <button
          onClick={handleLogout}
          className="mt-2 w-full py-4 rounded-2xl bg-transparent border-2 border-[#2D2D2D] flex items-center justify-center gap-2 text-[#ffb4ab] font-bold hover:border-[#ffb4ab]/40 hover:bg-[#ffb4ab]/5 transition-all duration-200 active:scale-[0.98]"
        >
          <span className="material-symbols-outlined">logout</span>
          Log Out
        </button>
      </section>
    </div>
  )
}
