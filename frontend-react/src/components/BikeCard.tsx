import { useNavigate } from 'react-router-dom'
import type { Bike } from '@/types'

const BIKE_IMAGES: Record<number, string> = {
  1: '/images/ather_450x.png',
  2: '/images/ola_roadster.png',
  3: '/images/triumph_speed.png',
}

interface BikeCardProps {
  bike: Bike
  onCompare?: (bike: Bike) => void
  inCompare?: boolean
}

export default function BikeCard({ bike, onCompare, inCompare }: BikeCardProps) {
  const navigate = useNavigate()

  const statusClass =
    bike.status === 'AVAILABLE'
      ? 'status-badge-available'
      : bike.status === 'RENTED'
      ? 'status-badge-rented'
      : 'status-badge-maintenance'

  const imgSrc = BIKE_IMAGES[bike.id] ?? '/images/ather_450x.png'

  return (
    <article className="glass-panel rounded-2xl overflow-hidden flex flex-col group hover:border-white/20 transition-all duration-300 hover:shadow-xl hover:shadow-black/30 hover:-translate-y-1 animate-fade-up">
      {/* Image */}
      <div
        className="relative h-48 bg-[#1c1b1b] overflow-hidden cursor-pointer"
        onClick={() => navigate(`/details/${bike.id}`)}
      >
        <img
          src={imgSrc}
          alt={bike.name}
          className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-500"
          onError={(e) => {
            ;(e.target as HTMLImageElement).src = '/images/ather_450x.png'
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
        <div className="absolute top-3 left-3">
          <span className={statusClass}>{bike.status}</span>
        </div>
        <div className="absolute top-3 right-3 flex items-center gap-1 bg-black/50 rounded-full px-2 py-0.5">
          <span className="material-symbols-outlined text-[#00D26A] text-sm">bolt</span>
          <span className="text-xs font-bold text-white">{bike.batteryPercentage}%</span>
        </div>
      </div>

      {/* Content */}
      <div className="p-4 flex flex-col gap-3 flex-1">
        <div>
          <p className="text-xs font-bold uppercase tracking-widest text-[#8e9192] mb-1">{bike.type}</p>
          <h3
            className="text-lg font-bold text-[#e5e2e1] cursor-pointer hover:text-[#c8c6c5] transition-colors truncate"
            onClick={() => navigate(`/details/${bike.id}`)}
          >
            {bike.name}
          </h3>
        </div>

        <div className="flex items-center justify-between mt-auto">
          <div>
            <span className="text-2xl font-black text-[#c8c6c5]">
              ₹{bike.pricePerMinute.toFixed(1)}
            </span>
            <span className="text-xs text-[#8e9192]">/min</span>
          </div>
          <div className="flex gap-2">
            {onCompare && (
              <button
                onClick={() => onCompare(bike)}
                className={`p-2 rounded-xl border transition-all duration-200 active:scale-95 ${
                  inCompare
                    ? 'bg-[#00D26A]/20 border-[#00D26A]/50 text-[#00D26A]'
                    : 'border-white/10 text-[#c4c7c7] hover:border-white/20'
                }`}
                aria-label="Compare"
              >
                <span className="material-symbols-outlined text-xl">compare_arrows</span>
              </button>
            )}
            <button
              onClick={() => navigate(`/details/${bike.id}`)}
              disabled={bike.status !== 'AVAILABLE'}
              className={`px-4 py-2 rounded-xl text-sm font-bold transition-all duration-200 active:scale-95 ${
                bike.status === 'AVAILABLE'
                  ? 'bg-[#00D26A] text-[#111111] hover:brightness-110'
                  : 'bg-[#2D2D2D] text-[#8e9192] cursor-not-allowed'
              }`}
            >
              {bike.status === 'AVAILABLE' ? 'Rent' : 'Unavailable'}
            </button>
          </div>
        </div>
      </div>
    </article>
  )
}
