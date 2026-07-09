import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { rentalsApi } from '@/services/api'
import { useAuthStore } from '@/store/authStore'
import type { Rental } from '@/types'

export default function History() {
  const navigate = useNavigate()
  const { isAuthenticated } = useAuthStore()
  const [rentals, setRentals] = useState<Rental[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!isAuthenticated) { navigate('/login'); return }
    rentalsApi.getHistory()
      .then(setRentals)
      .catch(console.error)
      .finally(() => setLoading(false))
  }, [isAuthenticated, navigate])

  const formatDuration = (start: string, end?: string) => {
    if (!end) return '—'
    const diff = new Date(end).getTime() - new Date(start).getTime()
    const m = Math.floor(diff / 60000)
    return m < 60 ? `${m} min` : `${Math.floor(m / 60)}h ${m % 60}m`
  }

  return (
    <div className="min-h-screen pt-24 pb-28 md:pb-8 px-5 md:max-w-2xl md:mx-auto">
      <h1 className="text-3xl font-black tracking-tight text-[#e5e2e1] mb-8 animate-fade-up">Rental History</h1>

      {loading ? (
        <div className="flex justify-center py-20">
          <div className="w-10 h-10 border-2 border-[#00D26A] border-t-transparent rounded-full animate-spin" />
        </div>
      ) : rentals.length === 0 ? (
        <div className="text-center py-24 animate-fade-up">
          <span className="material-symbols-outlined text-7xl text-[#8e9192] mb-4 block">history</span>
          <p className="text-xl font-bold text-[#e5e2e1] mb-2">No rides yet</p>
          <p className="text-[#8e9192] mb-8">Your rental history will appear here</p>
          <button onClick={() => navigate('/explore')} className="btn-primary px-8 py-4">
            Start Your First Ride
          </button>
        </div>
      ) : (
        <div className="flex flex-col gap-4">
          {rentals.map((r, i) => (
            <div
              key={r.id}
              className="glass-panel rounded-2xl p-5 flex items-start gap-4 animate-fade-up hover:border-white/15 transition-colors"
              style={{ animationDelay: `${i * 0.05}s` }}
            >
              <div className={`w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 ${
                r.status === 'COMPLETED' ? 'bg-[#00D26A]/15' : 'bg-[#ffb4ab]/15'
              }`}>
                <span className={`material-symbols-outlined ${r.status === 'COMPLETED' ? 'text-[#00D26A]' : 'text-[#ffb4ab]'}`}>
                  {r.status === 'COMPLETED' ? 'check_circle' : 'cancel'}
                </span>
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between mb-1">
                  <p className="font-bold text-[#e5e2e1] truncate">Ride #{r.id}</p>
                  <span className={`text-xs font-bold ml-2 flex-shrink-0 ${r.status === 'COMPLETED' ? 'text-[#00D26A]' : 'text-[#ffb4ab]'}`}>
                    {r.status}
                  </span>
                </div>
                <p className="text-xs text-[#8e9192]">{new Date(r.startTime).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}</p>
                <div className="flex gap-4 mt-2 text-sm">
                  <span className="text-[#c4c7c7]">
                    <span className="text-[#8e9192]">Duration: </span>
                    {formatDuration(r.startTime, r.endTime)}
                  </span>
                  <span className="text-[#c4c7c7]">
                    <span className="text-[#8e9192]">Cost: </span>
                    ₹{r.totalCost?.toFixed(2) ?? '—'}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
