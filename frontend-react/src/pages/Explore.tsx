import { useEffect, useState } from 'react'
import { bikesApi } from '@/services/api'
import type { Bike } from '@/types'
import BikeCard from '@/components/BikeCard'
import Modal from '@/components/Modal'

const FILTERS = ['All', 'Electric', 'Cruiser', 'Sport', 'Mountain'] as const

const BIKE_SPECS: Record<number, Record<string, string>> = {
  1: { Power: '11 kW', TopSpeed: '90 km/h', Range: '146 km', Weight: '108 kg' },
  2: { Power: '14.2 kW', TopSpeed: '120 km/h', Range: '248 km', Weight: '125 kg' },
  3: { Power: '29.1 kW', TopSpeed: '160 km/h', Range: 'N/A', Weight: '176 kg' },
}

const POWER_TIERS = [
  { label: 'Standard (250W)', icon: '', value: 'standard' },
  { label: 'Pro (500W)', icon: 'bolt', value: 'pro', active: true },
  { label: 'Elite (750W+)', icon: 'bolt', value: 'elite', double: true },
]

export default function Explore() {
  const [bikes, setBikes] = useState<Bike[]>([])
  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState<string>('All')
  const [search, setSearch] = useState('')
  const [compareList, setCompareList] = useState<Bike[]>([])
  const [showCompare, setShowCompare] = useState(false)
  const [availableOnly, setAvailableOnly] = useState(false)
  const [priceMax, setPriceMax] = useState(10)

  useEffect(() => {
    bikesApi.getAll()
      .then(setBikes)
      .catch(console.error)
      .finally(() => setLoading(false))
  }, [])

  const filtered = bikes.filter((b) => {
    const matchFilter = filter === 'All' || b.type === filter
    const matchSearch = b.name.toLowerCase().includes(search.toLowerCase())
    const matchAvail = !availableOnly || b.status === 'AVAILABLE'
    const matchPrice = b.pricePerMinute <= priceMax
    return matchFilter && matchSearch && matchAvail && matchPrice
  })

  const toggleCompare = (bike: Bike) => {
    setCompareList((prev) =>
      prev.find((b) => b.id === bike.id)
        ? prev.filter((b) => b.id !== bike.id)
        : prev.length < 3 ? [...prev, bike] : prev
    )
  }

  return (
    <div className="min-h-screen pt-16 pb-24 md:pb-0 flex">

      {/* ── Desktop Sidebar Filters ── */}
      <aside className="w-72 hidden lg:flex flex-col border-r border-white/10 bg-[#1c1b1b] overflow-y-auto h-[calc(100vh-64px)] fixed left-0 top-16 z-40">
        <div className="p-5">
          <div className="flex items-center justify-between mb-8 mt-2">
            <h2 className="text-lg font-bold text-[#e5e2e1]">Filters</h2>
            <button
              onClick={() => { setFilter('All'); setAvailableOnly(false); setPriceMax(10) }}
              className="text-sm text-[#8e9192] hover:text-[#00D26A] transition-colors"
            >
              Reset
            </button>
          </div>

          {/* Category checkboxes */}
          <div className="mb-8">
            <h3 className="text-xs font-bold uppercase tracking-widest text-[#8e9192] mb-4">Category</h3>
            <div className="space-y-3">
              {FILTERS.filter((f) => f !== 'All').map((cat) => (
                <label key={cat} className="flex items-center gap-3 cursor-pointer group">
                  <div
                    onClick={() => setFilter(filter === cat ? 'All' : cat)}
                    className={`w-5 h-5 rounded border flex items-center justify-center transition-colors cursor-pointer ${
                      filter === cat
                        ? 'bg-[#c8c6c5] border-[#c8c6c5]'
                        : 'border-[#444748] bg-[#141313] group-hover:border-[#c8c6c5]'
                    }`}
                  >
                    {filter === cat && (
                      <span className="material-symbols-outlined text-[#141313] text-sm font-bold leading-none">check</span>
                    )}
                  </div>
                  <span className="text-[#e5e2e1] text-sm">{cat}</span>
                </label>
              ))}
            </div>
          </div>

          <div className="h-px bg-white/10 mb-8" />

          {/* Price Range */}
          <div className="mb-8">
            <h3 className="text-xs font-bold uppercase tracking-widest text-[#8e9192] mb-4">Price / Min</h3>
            <div className="px-2">
              <input
                type="range"
                min="0.5"
                max="10"
                step="0.5"
                value={priceMax}
                onChange={(e) => setPriceMax(Number(e.target.value))}
                className="w-full accent-[#00D26A] cursor-pointer"
              />
              <div className="flex justify-between text-xs text-[#8e9192] mt-2">
                <span>₹0.5</span>
                <span className="text-[#00D26A] font-bold">≤ ₹{priceMax}</span>
              </div>
            </div>
          </div>

          <div className="h-px bg-white/10 mb-8" />

          {/* Power Tier */}
          <div className="mb-8">
            <h3 className="text-xs font-bold uppercase tracking-widest text-[#8e9192] mb-4">Power Tier</h3>
            <div className="space-y-2">
              {POWER_TIERS.map(({ label, icon, value, active, double }) => (
                <button
                  key={value}
                  className={`w-full py-2.5 px-4 rounded-xl text-left text-sm font-semibold flex justify-between items-center transition-all ${
                    active
                      ? 'bg-[#353434] border border-[#00D26A]/50 text-[#c8c6c5]'
                      : 'border-2 border-[#2D2D2D] text-[#e5e2e1] hover:border-[#00D26A]/40 hover:text-[#00D26A]'
                  }`}
                >
                  {label}
                  {icon && (
                    <span className="flex">
                      <span className={`material-symbols-outlined text-sm ${active ? 'text-[#00D26A]' : 'text-[#8e9192]'}`}>{icon}</span>
                      {double && <span className="material-symbols-outlined text-sm text-[#8e9192] -ml-1">{icon}</span>}
                    </span>
                  )}
                </button>
              ))}
            </div>
          </div>

          <div className="h-px bg-white/10 mb-8" />

          {/* Availability toggle */}
          <div>
            <h3 className="text-xs font-bold uppercase tracking-widest text-[#8e9192] mb-4">Availability</h3>
            <label className="flex items-center justify-between cursor-pointer">
              <span className="text-sm text-[#e5e2e1]">Show only available now</span>
              <div className="relative">
                <input
                  type="checkbox"
                  className="sr-only peer"
                  checked={availableOnly}
                  onChange={(e) => setAvailableOnly(e.target.checked)}
                />
                <div className="w-11 h-6 bg-[#353434] peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#00D26A]" />
              </div>
            </label>
          </div>
        </div>
      </aside>

      {/* ── Main Content ── */}
      <main className="flex-1 lg:ml-72 p-5 md:p-8 overflow-y-auto">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-8 gap-4 animate-fade-up">
          <div>
            <h1 className="text-4xl font-black tracking-tight text-[#e5e2e1]">Urban Explorers</h1>
            <p className="text-[#8e9192] mt-1">Showing {filtered.length} available rides near you</p>
          </div>

          {/* Search + Sort */}
          <div className="flex items-center gap-3">
            <div className="relative w-full md:w-64">
              <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-[#8e9192]">search</span>
              <input
                type="search"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="input-field pl-12"
                placeholder="Search models…"
              />
            </div>
            <button className="glass-panel p-2.5 rounded-xl border border-white/5 hover:bg-white/5 transition-colors flex-shrink-0">
              <span className="material-symbols-outlined text-[#c8c6c5]">sort</span>
            </button>
          </div>
        </div>

        {/* Mobile filter pills */}
        <div className="lg:hidden flex gap-2 overflow-x-auto pb-2 mb-6 animate-fade-up" style={{ animationDelay: '0.05s' }}>
          {FILTERS.map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`flex-shrink-0 px-4 py-2 rounded-full text-sm font-semibold transition-all active:scale-95 ${
                filter === f ? 'bg-[#c8c6c5] text-[#141313]' : 'glass-panel text-[#c4c7c7] hover:text-[#e5e2e1]'
              }`}
            >
              {f}
            </button>
          ))}
        </div>

        {/* Featured banner */}
        <section className="mb-8 glass-panel rounded-3xl p-5 border border-[#00D26A]/20">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <p className="text-sm font-semibold uppercase tracking-[0.25em] text-[#00D26A]">Featured this week</p>
              <h2 className="text-2xl font-black text-[#e5e2e1] mt-1">Premium picks for longer commutes</h2>
              <p className="text-[#8e9192] mt-2">Explore high-range models with comfort-focused control and instant pickup.</p>
            </div>
            <button className="btn-primary px-5 py-3 text-sm">View Premium</button>
          </div>
        </section>

        {/* Bike Grid */}
        {loading ? (
          <div className="flex justify-center items-center py-32">
            <div className="w-10 h-10 border-2 border-[#00D26A] border-t-transparent rounded-full animate-spin" />
          </div>
        ) : filtered.length === 0 ? (
          <div className="text-center py-32 text-[#8e9192]">
            <span className="material-symbols-outlined text-5xl mb-4 block">search_off</span>
            <p className="text-lg font-semibold">No bikes found</p>
            <p className="text-sm mt-1">Try adjusting filters</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
            {filtered.map((bike) => (
              <BikeCard
                key={bike.id}
                bike={bike}
                onCompare={toggleCompare}
                inCompare={!!compareList.find((b) => b.id === bike.id)}
              />
            ))}
          </div>
        )}

        {/* Load More */}
        <div className="flex justify-center mt-12 pb-4">
          <button className="btn-ghost py-3 px-8 flex items-center gap-2">
            Load More <span className="material-symbols-outlined">expand_more</span>
          </button>
        </div>
      </main>

      {/* Compare Tray */}
      {compareList.length > 0 && (
        <div className="fixed bottom-24 md:bottom-8 left-1/2 -translate-x-1/2 z-40 glass-panel border border-[#c8c6c5]/20 rounded-2xl px-6 py-3 flex items-center gap-4 shadow-2xl animate-fade-up">
          <div className="flex gap-2">
            {compareList.map((b) => (
              <span key={b.id} className="text-sm font-semibold text-[#c8c6c5] glass-panel px-3 py-1.5 rounded-xl">
                {b.name}
              </span>
            ))}
          </div>
          <button onClick={() => setShowCompare(true)} className="btn-primary text-sm px-4 py-2">
            Compare ({compareList.length})
          </button>
          <button onClick={() => setCompareList([])} className="text-[#8e9192] hover:text-[#e5e2e1] transition-colors">
            <span className="material-symbols-outlined">close</span>
          </button>
        </div>
      )}

      {/* Compare Modal */}
      <Modal isOpen={showCompare} onClose={() => setShowCompare(false)} title="Bike Comparison" maxWidth="max-w-3xl">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr>
                <th className="text-left py-2 text-[#8e9192] font-semibold pr-4">Spec</th>
                {compareList.map((b) => (
                  <th key={b.id} className="text-left py-2 text-[#e5e2e1] font-bold pr-4">{b.name}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {[
                ['Type', (b: Bike) => b.type],
                ['Status', (b: Bike) => b.status],
                ['Battery', (b: Bike) => `${b.batteryPercentage}%`],
                ['Rate', (b: Bike) => `₹${b.pricePerMinute}/min`],
                ['Power', (b: Bike) => BIKE_SPECS[b.id]?.Power ?? '—'],
                ['Top Speed', (b: Bike) => BIKE_SPECS[b.id]?.TopSpeed ?? '—'],
                ['Range', (b: Bike) => BIKE_SPECS[b.id]?.Range ?? '—'],
                ['Weight', (b: Bike) => BIKE_SPECS[b.id]?.Weight ?? '—'],
              ].map(([label, fn]) => (
                <tr key={label as string}>
                  <td className="py-3 text-[#8e9192] font-medium pr-4">{label as string}</td>
                  {compareList.map((b) => (
                    <td key={b.id} className="py-3 text-[#e5e2e1] pr-4">{(fn as (b: Bike) => string)(b)}</td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <button
          className="btn-ghost w-full mt-2"
          onClick={() => { setShowCompare(false); setCompareList([]) }}
        >
          Clear Comparison
        </button>
      </Modal>
    </div>
  )
}
