import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { bikesApi, rentalsApi } from '@/services/api'
import { useAuthStore } from '@/store/authStore'
import type { Bike, Rental } from '@/types'
import BikeCard from '@/components/BikeCard'

const CATEGORIES = [
  { icon: 'electric_scooter', label: 'Scooters', type: 'Electric' },
  { icon: 'moped', label: 'Commuter', type: 'Commuter' },
  { icon: 'two_wheeler', label: 'Sports', type: 'Sport', active: true },
  { icon: 'pedal_bike', label: 'Adventure', type: 'Mountain' },
  { icon: 'motorcycle', label: 'Cruiser', type: 'Cruiser' },
]

export default function Home() {
  const navigate = useNavigate()
  const { isAuthenticated } = useAuthStore()
  const [bikes, setBikes] = useState<Bike[]>([])
  const [activeRental, setActiveRental] = useState<Rental | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const load = async () => {
      try {
        const [bikesData] = await Promise.all([bikesApi.getAll()])
        setBikes(bikesData)
        if (isAuthenticated) {
          const rental = await rentalsApi.getActive()
          if ('id' in rental) setActiveRental(rental as Rental)
        }
      } catch {
        // silently ignore on home page
      } finally {
        setLoading(false)
      }
    }
    load()
  }, [isAuthenticated])

  const available = bikes.filter((b) => b.status === 'AVAILABLE').length

  return (
    <div className="min-h-screen pb-24 md:pb-0 selection:bg-[#00D26A] selection:text-black">

      {/* ── Hero Section (Desktop: full-bleed image, Mobile: gradient blobs) ── */}
      <section className="relative min-h-[80vh] flex flex-col items-start justify-center overflow-hidden px-5 md:px-10 pt-16">
        {/* Desktop hero background image */}
        <div className="absolute inset-0 z-0 hidden md:block">
          <div
            className="w-full h-full bg-cover bg-center opacity-60"
            style={{ backgroundImage: `url('https://lh3.googleusercontent.com/aida-public/AB6AXuCjNxEQ5feB2g3pO-S93YHQhllHTX8cW1PGoIYtOcryg69OLntGVYRDYT2X97DFbEQLLL0_EGS3rFET9Umat7pnUWFYJE-IcGlEz9zY6R0VYSIL-PkhkDf9kCODstrb6k_uguvsl0R4dFkHO1eQ1IjoQjMqfkhZy14l_FXfP7R-tRii6Bwv3ZvnfgkgzffJQZD3v-aDWhW_Dr6df6wijcjnzLp0qhYcF6jWwLF4gOxsQOYCSbmg-kAlkQ')` }}
          />
          <div className="absolute inset-0 bg-gradient-to-r from-[#141313] via-[#141313]/80 to-transparent" />
          <div className="absolute inset-0 bg-gradient-to-t from-[#141313] via-transparent to-transparent" />
        </div>

        {/* Mobile gradient blobs */}
        <div className="absolute inset-0 md:hidden overflow-hidden pointer-events-none">
          <div className="absolute top-20 left-1/4 w-72 h-72 bg-[#00D26A]/8 rounded-full blur-3xl animate-pulse" />
          <div className="absolute bottom-20 right-1/4 w-96 h-96 bg-[#c8c6c5]/4 rounded-full blur-3xl" />
        </div>

        <div className="relative z-10 max-w-2xl animate-fade-up">
          {/* Mobile pill */}
          <div className="md:hidden inline-flex items-center gap-2 glass-panel rounded-full px-4 py-2 mb-8 text-sm text-[#00D26A] font-semibold">
            <span className="w-2 h-2 bg-[#00D26A] rounded-full animate-pulse" />
            {available} bikes available now
          </div>

          {/* Desktop headline */}
          <h1 className="hidden md:block text-6xl lg:text-8xl font-black tracking-tighter text-[#e5e2e1] mb-4 leading-none">
            Unleash the City.
          </h1>
          {/* Mobile headline */}
          <h1 className="md:hidden text-5xl font-black tracking-tighter text-[#e5e2e1] mb-4 leading-none">
            Ride <span className="text-[#00D26A]">Electric.</span>
            <br />Ride Free.
          </h1>

          <p className="text-lg text-[#c4c7c7] mb-10 max-w-lg">
            Experience the next generation of urban mobility. High-performance electric vehicles ready when you are.
          </p>

          <div className="flex flex-col sm:flex-row gap-4">
            {activeRental ? (
              <button
                onClick={() => navigate('/ride-status')}
                className="btn-primary text-base px-8 py-4"
              >
                <span className="material-symbols-outlined">directions_bike</span>
                Track Active Ride
              </button>
            ) : (
              <>
                <button
                  onClick={() => navigate(isAuthenticated ? '/explore' : '/login')}
                  className="btn-primary text-base px-8 py-4 flex items-center gap-2 uppercase tracking-wider font-bold"
                >
                  <span className="material-symbols-outlined">key</span>
                  Unlock Now
                </button>
                <button
                  onClick={() => navigate('/explore')}
                  className="btn-ghost text-base px-8 py-4 uppercase tracking-wider font-bold border-2 border-[#353434]"
                >
                  View Fleet
                </button>
              </>
            )}
          </div>
        </div>
      </section>

      {/* ── Active Ride Banner ── */}
      {activeRental && (
        <div
          className="mx-5 md:max-w-7xl md:mx-auto mb-8 glass-panel border border-[#00D26A]/30 rounded-2xl p-4 flex items-center gap-4 cursor-pointer hover:border-[#00D26A]/50 transition-colors"
          onClick={() => navigate('/ride-status')}
        >
          <div className="w-10 h-10 rounded-full bg-[#00D26A]/20 flex items-center justify-center flex-shrink-0">
            <span className="material-symbols-outlined text-[#00D26A]">directions_bike</span>
          </div>
          <div className="flex-1 min-w-0">
            <p className="font-bold text-[#00D26A] text-sm">Active Ride In Progress</p>
            <p className="text-xs text-[#8e9192] truncate">Tap to view ride status and end ride</p>
          </div>
          <span className="material-symbols-outlined text-[#c4c7c7]">chevron_right</span>
        </div>
      )}

      {/* ── Quick Deal Banner ── */}
      <section className="px-5 md:px-10 max-w-7xl mx-auto mb-8">
        <div className="glass-panel rounded-3xl p-5 md:p-6 border border-[#00D26A]/20">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <p className="text-sm font-semibold uppercase tracking-[0.25em] text-[#00D26A]">Weekend Deal</p>
              <h3 className="text-2xl font-black text-[#e5e2e1] mt-1">Up to 50% off weekend rides</h3>
              <p className="text-[#8e9192] mt-2 max-w-2xl">Unlock your next city escape with half-price weekend rides and priority access to premium scooters.</p>
            </div>
            <div className="flex flex-wrap gap-3">
              <button className="btn-primary px-5 py-3 text-sm">Claim Offer</button>
              <button className="btn-ghost px-5 py-3 text-sm border-[#353434]">Explore Plans</button>
            </div>
          </div>
        </div>
      </section>

      {/* ── Categories ── */}
      <section className="px-5 md:px-10 py-10 max-w-7xl mx-auto">
        <h2 className="text-3xl font-black tracking-tight text-[#e5e2e1] mb-6">Categories</h2>
        <div className="grid grid-cols-5 gap-3">
          {CATEGORIES.map(({ icon, label, active }) => (
            <button
              key={label}
              onClick={() => navigate('/explore')}
              className={`glass-panel rounded-2xl p-4 flex flex-col items-center justify-center gap-2 hover:bg-white/5 transition-all group ${
                active ? 'border-[#00D26A]/30 bg-[#00D26A]/5' : ''
              }`}
            >
              <span className={`material-symbols-outlined text-4xl transition-colors ${
                active ? 'text-[#00D26A]' : 'text-[#8e9192] group-hover:text-[#00D26A]'
              }`}>{icon}</span>
              <span className={`text-xs font-bold uppercase tracking-widest ${
                active ? 'text-[#00D26A]' : 'text-[#c8c6c5]'
              }`}>{label}</span>
            </button>
          ))}
        </div>
      </section>

      {/* ── Electric Collection (horizontal scroll) ── */}
      <section className="pl-5 md:pl-10 py-6 overflow-hidden">
        <div className="pr-5 md:pr-10 mb-4 flex items-center justify-between">
          <div>
            <h2 className="text-3xl font-black tracking-tight text-[#e5e2e1]">Electric Collection</h2>
            <p className="text-[#8e9192] text-sm mt-1">Zero emissions. Max performance.</p>
          </div>
          <button
            onClick={() => navigate('/explore')}
            className="text-[#00D26A] font-bold text-sm flex items-center gap-1 hover:opacity-80"
          >
            See All <span className="material-symbols-outlined text-base">arrow_forward</span>
          </button>
        </div>

        {loading ? (
          <div className="flex justify-center py-12">
            <div className="w-8 h-8 border-2 border-[#00D26A] border-t-transparent rounded-full animate-spin" />
          </div>
        ) : (
          <div className="flex gap-6 overflow-x-auto pb-3 no-scrollbar snap-x">
            {bikes.map((bike) => (
              <div key={bike.id} className="min-w-[300px] max-w-[340px] snap-start shrink-0">
                <BikeCard bike={bike} />
              </div>
            ))}
            {/* View All card */}
            <div className="min-w-[240px] max-w-[260px] snap-start shrink-0 glass-panel rounded-2xl flex flex-col items-center justify-center gap-3 p-6 opacity-75">
              <span className="material-symbols-outlined text-4xl text-[#8e9192]">electric_scooter</span>
              <span className="text-[#8e9192] font-semibold text-sm">View All Models</span>
              <button
                onClick={() => navigate('/explore')}
                className="px-4 py-2 rounded-full border border-white/10 text-[#c8c6c5] text-sm hover:bg-white/5 transition-colors"
              >
                Explore Fleet
              </button>
            </div>
          </div>
        )}
      </section>

      {/* ── How It Works ── */}
      <section className="px-5 md:px-10 max-w-7xl mx-auto mt-6 mb-10">
        <div className="glass-panel rounded-3xl p-6 md:p-8 border border-white/10">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-2xl font-black text-[#e5e2e1]">How it works</h2>
              <p className="text-[#8e9192] mt-1">Start riding in three simple steps.</p>
            </div>
          </div>
          <div className="grid gap-4 md:grid-cols-3">
            {[
              { title: 'Find a ride', description: 'Browse nearby bikes, filter by range, and choose the right model.', icon: 'search' },
              { title: 'Unlock instantly', description: 'Scan the QR code or use your phone to start the trip in seconds.', icon: 'lock_open' },
              { title: 'Ride & go', description: 'Track your trip, end it smoothly, and keep your rewards flowing.', icon: 'directions_bike' },
            ].map(({ title, description, icon }) => (
              <div key={title} className="rounded-2xl border border-white/10 bg-[#111111]/60 p-5">
                <div className="w-11 h-11 rounded-full bg-[#00D26A]/10 flex items-center justify-center mb-4">
                  <span className="material-symbols-outlined text-[#00D26A]">{icon}</span>
                </div>
                <h3 className="text-lg font-bold text-[#e5e2e1] mb-2">{title}</h3>
                <p className="text-sm text-[#8e9192]">{description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Stats ── */}
      <section className="px-5 md:px-10 max-w-7xl mx-auto mt-6 mb-8">
        <div className="grid grid-cols-3 gap-4">
          {[
            { label: 'Active Bikes', value: `${available}`, icon: 'electric_moped' },
            { label: 'CO₂ Saved', value: '2.4t', icon: 'eco' },
            { label: 'Rides Today', value: '128', icon: 'trending_up' },
          ].map(({ label, value, icon }) => (
            <div key={label} className="glass-panel rounded-2xl p-4 text-center">
              <span className="material-symbols-outlined text-[#00D26A] text-3xl mb-2 block">{icon}</span>
              <p className="text-2xl font-black text-[#e5e2e1]">{value}</p>
              <p className="text-xs text-[#8e9192] mt-1">{label}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ── Guest CTA ── */}
      {!isAuthenticated && (
        <section className="px-5 md:px-10 max-w-4xl mx-auto mb-16">
          <div className="glass-panel rounded-3xl p-8 text-center border border-[#00D26A]/20">
            <h3 className="text-2xl font-black text-[#e5e2e1] mb-2">Ready to ride?</h3>
            <p className="text-[#8e9192] mb-6">Create a free account and unlock your first ride in under a minute.</p>
            <button onClick={() => navigate('/login')} className="btn-primary px-10 py-4 text-base">
              Get Started Free
            </button>
          </div>
        </section>
      )}
    </div>
  )
}
