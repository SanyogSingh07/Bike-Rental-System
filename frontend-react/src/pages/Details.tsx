import { useEffect, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { bikesApi, rentalsApi } from '@/services/api'
import { useAuthStore } from '@/store/authStore'
import type { Bike } from '@/types'

const BIKE_IMAGES: Record<number, string> = {
  1: '/images/ather_450x.png',
  2: '/images/ola_roadster.png',
  3: '/images/triumph_speed.png',
}

const BIKE_SPECS: Record<number, { power: string; speed: string; range: string; weight: string; engine: string }> = {
  1: { power: '11 kW', speed: '90 km/h', range: '146 km', weight: '108 kg', engine: 'BLDC Hub Motor' },
  2: { power: '14.2 kW', speed: '120 km/h', range: '248 km', weight: '125 kg', engine: 'Mid-drive BLDC' },
  3: { power: '29.1 kW', speed: '160 km/h', range: 'N/A', weight: '176 kg', engine: '398.15cc Single Cyl' },
}

export default function Details() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const { isAuthenticated } = useAuthStore()

  const [bike, setBike] = useState<Bike | null>(null)
  const [loading, setLoading] = useState(true)
  const [renting, setRenting] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    if (!id) return
    bikesApi.getById(Number(id))
      .then(setBike)
      .catch(() => navigate('/explore'))
      .finally(() => setLoading(false))
  }, [id, navigate])

  const handleRent = async () => {
    if (!isAuthenticated) { navigate('/login'); return }
    if (!bike) return
    setRenting(true)
    setError('')
    try {
      await rentalsApi.rent(bike.id)
      navigate('/ride-status')
    } catch (err: unknown) {
      const msg = (err as { response?: { data?: { message?: string } } })?.response?.data?.message || 'Unable to start rental.'
      setError(msg)
    } finally {
      setRenting(false)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="w-10 h-10 border-2 border-[#00D26A] border-t-transparent rounded-full animate-spin" />
      </div>
    )
  }

  if (!bike) return null

  const specs = BIKE_SPECS[bike.id]
  const imgSrc = BIKE_IMAGES[bike.id] ?? '/images/ather_450x.png'

  return (
    <div className="min-h-screen pt-20 pb-28 md:pb-8">
      {/* Hero Image */}
      <div className="relative h-64 md:h-96 overflow-hidden bg-[#1c1b1b]">
        <img src={imgSrc} alt={bike.name} className="w-full h-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-t from-[#141313] via-transparent to-transparent" />
        <button
          onClick={() => navigate('/explore')}
          className="absolute top-6 left-5 glass-panel rounded-full p-2 flex items-center justify-center hover:bg-white/10 transition-colors"
        >
          <span className="material-symbols-outlined text-[#e5e2e1]">arrow_back</span>
        </button>
      </div>

      <div className="px-5 md:max-w-3xl md:mx-auto -mt-8 relative z-10">
        {/* Name + Status */}
        <div className="flex items-start justify-between mb-4 animate-fade-up">
          <div>
            <p className="text-xs font-bold uppercase tracking-widest text-[#8e9192] mb-1">{bike.type}</p>
            <h1 className="text-3xl md:text-4xl font-black tracking-tight text-[#e5e2e1]">{bike.name}</h1>
          </div>
          <span className={
            bike.status === 'AVAILABLE' ? 'status-badge-available mt-2'
            : bike.status === 'RENTED' ? 'status-badge-rented mt-2'
            : 'status-badge-maintenance mt-2'
          }>
            {bike.status}
          </span>
        </div>

        {/* Pricing */}
        <div className="glass-panel rounded-2xl p-5 mb-5 animate-fade-up" style={{ animationDelay: '0.05s' }}>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs text-[#8e9192] uppercase tracking-widest mb-1">Rental Rate</p>
              <p className="text-4xl font-black text-[#c8c6c5]">
                ₹{bike.pricePerMinute.toFixed(1)}<span className="text-base font-normal text-[#8e9192]">/min</span>
              </p>
              <p className="text-sm text-[#8e9192] mt-1">
                ≈ ₹{(bike.pricePerMinute * 60).toFixed(0)}/hour
              </p>
            </div>
            <div className="text-right">
              <p className="text-xs text-[#8e9192] uppercase tracking-widest mb-1">Battery</p>
              <div className="flex items-center gap-2 justify-end">
                <div className="w-24 h-2 bg-[#2D2D2D] rounded-full overflow-hidden">
                  <div
                    className="h-full rounded-full bg-[#00D26A] transition-all"
                    style={{ width: `${bike.batteryPercentage}%` }}
                  />
                </div>
                <span className="text-[#00D26A] font-bold text-sm">{bike.batteryPercentage}%</span>
              </div>
            </div>
          </div>
        </div>

        {/* Specs Grid */}
        {specs && (
          <div className="grid grid-cols-2 gap-3 mb-5 animate-fade-up" style={{ animationDelay: '0.1s' }}>
            {[
              { icon: 'bolt', label: 'Power', value: specs.power },
              { icon: 'speed', label: 'Top Speed', value: specs.speed },
              { icon: 'route', label: 'Range', value: specs.range },
              { icon: 'fitness_center', label: 'Weight', value: specs.weight },
            ].map(({ icon, label, value }) => (
              <div key={label} className="glass-panel rounded-xl p-4 flex items-center gap-3">
                <span className="material-symbols-outlined text-[#00D26A] text-2xl">{icon}</span>
                <div>
                  <p className="text-xs text-[#8e9192]">{label}</p>
                  <p className="font-bold text-[#e5e2e1]">{value}</p>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Engine */}
        {specs && (
          <div className="glass-panel rounded-xl p-4 mb-5 flex items-center gap-3 animate-fade-up" style={{ animationDelay: '0.15s' }}>
            <span className="material-symbols-outlined text-[#c8c6c5] text-2xl">settings</span>
            <div>
              <p className="text-xs text-[#8e9192]">Engine / Motor</p>
              <p className="font-bold text-[#e5e2e1]">{specs.engine}</p>
            </div>
          </div>
        )}

        {/* Description */}
        {bike.description && (
          <div className="glass-panel rounded-xl p-4 mb-8 animate-fade-up" style={{ animationDelay: '0.2s' }}>
            <p className="text-sm text-[#c4c7c7] leading-relaxed">{bike.description}</p>
          </div>
        )}

        {/* Error */}
        {error && (
          <div className="bg-red-900/30 border border-red-500/30 rounded-xl p-3 mb-4 text-sm text-[#ffb4ab]">
            {error}
          </div>
        )}

        {/* Book Button */}
        <button
          onClick={handleRent}
          disabled={bike.status !== 'AVAILABLE' || renting}
          className="btn-primary w-full py-5 text-lg disabled:opacity-60 disabled:cursor-not-allowed animate-fade-up"
          style={{ animationDelay: '0.25s' }}
        >
          {renting ? (
            <span className="flex items-center gap-2">
              <svg className="animate-spin w-5 h-5" viewBox="0 0 24 24" fill="none">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
              </svg>
              Starting Rental…
            </span>
          ) : bike.status === 'AVAILABLE' ? (
            <>
              <span className="material-symbols-outlined icon-filled">electric_bolt</span>
              Book Now — ₹{bike.pricePerMinute.toFixed(1)}/min
            </>
          ) : (
            'Currently Unavailable'
          )}
        </button>
      </div>
    </div>
  )
}
