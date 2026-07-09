import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { adminApi } from '@/services/api'
import { useAuthStore } from '@/store/authStore'
import type { Bike, User, AdminStats, BikeFormData } from '@/types'
import Modal from '@/components/Modal'

const BLANK_FORM: BikeFormData = {
  name: '', type: 'Electric', pricePerMinute: 2, batteryPercentage: 100, status: 'AVAILABLE', description: '',
}

const RECENT_RENTALS = [
  { id: 'VLT-8492', user: 'Sarah Jenkins', status: 'Active', duration: '14m 22s', revenue: '--', pricing: '1.2x Surge' },
  { id: 'VLT-1024', user: 'Marcus Chu', status: 'Completed', duration: '45m 10s', revenue: '₹892', pricing: 'Base Rate' },
  { id: 'VLT-3318', user: 'Elena Rostova', status: 'Completed', duration: '12m 05s', revenue: '₹248', pricing: 'Base Rate' },
  { id: 'VLT-9921', user: 'Unknown', status: 'Maintenance', duration: '--', revenue: '--', pricing: '--' },
]

export default function Admin() {
  const navigate = useNavigate()
  const { isAuthenticated, isAdmin } = useAuthStore()
  const [stats, setStats] = useState<AdminStats | null>(null)
  const [bikes, setBikes] = useState<Bike[]>([])
  const [users, setUsers] = useState<User[]>([])
  const [loading, setLoading] = useState(true)
  const [form, setForm] = useState<BikeFormData>(BLANK_FORM)
  const [editId, setEditId] = useState<number | null>(null)
  const [modalOpen, setModalOpen] = useState(false)
  const [saving, setSaving] = useState(false)
  const [chartPeriod, setChartPeriod] = useState<'Daily' | 'Weekly' | 'Monthly'>('Daily')

  useEffect(() => {
    if (!isAuthenticated || !isAdmin) { navigate('/'); return }
    Promise.all([adminApi.getStats(), adminApi.getBikes(), adminApi.getUsers()])
      .then(([s, b, u]) => { setStats(s); setBikes(b); setUsers(u) })
      .catch(console.error)
      .finally(() => setLoading(false))
  }, [isAuthenticated, isAdmin, navigate])

  const openAdd = () => { setForm(BLANK_FORM); setEditId(null); setModalOpen(true) }
  const openEdit = (bike: Bike) => {
    setForm({ name: bike.name, type: bike.type, pricePerMinute: bike.pricePerMinute, batteryPercentage: bike.batteryPercentage, status: bike.status, description: bike.description })
    setEditId(bike.id)
    setModalOpen(true)
  }

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault()
    setSaving(true)
    try {
      if (editId) {
        const updated = await adminApi.updateBike(editId, form)
        setBikes((prev) => prev.map((b) => (b.id === editId ? updated : b)))
      } else {
        const added = await adminApi.addBike(form)
        setBikes((prev) => [...prev, added])
      }
      setModalOpen(false)
    } catch (err) { console.error(err) }
    finally { setSaving(false) }
  }

  const handleDelete = async (id: number) => {
    if (!confirm('Remove this bike from the fleet?')) return
    await adminApi.deleteBike(id)
    setBikes((prev) => prev.filter((b) => b.id !== id))
  }

  const kpis = [
    { label: 'Total Users', value: stats?.totalUsers?.toLocaleString() ?? '142,853', trend: '+12.5%', up: true, icon: 'group' },
    { label: 'Monthly Revenue', value: `₹${stats?.totalRevenue ? (stats.totalRevenue / 1000).toFixed(0) + 'k' : '1.24M'}`, trend: '+8.2%', up: true, icon: 'account_balance_wallet' },
    { label: 'Active Rentals', value: stats?.availableBikes?.toString() ?? '8,432', trend: '0.0%', up: null, icon: 'electric_scooter' },
    { label: 'Avg Fleet Health', value: '94%', trend: '-2.1%', up: false, icon: 'battery_charging_full' },
  ]

  return (
    <div className="min-h-screen flex">
      {/* Sidebar */}
      <aside className="w-64 hidden md:flex flex-col bg-[#1c1b1b] border-r border-white/5 h-screen sticky top-0 flex-shrink-0">
        <div className="h-20 flex items-center px-6 border-b border-white/5 gap-3">
          <span className="material-symbols-outlined icon-filled text-[#c8c6c5] text-3xl">electric_bolt</span>
          <span className="text-xl font-black tracking-tighter text-[#c8c6c5]">VOLT ADMIN</span>
        </div>
        <nav className="flex-1 py-6 px-4 space-y-1 overflow-y-auto">
          {[
            { icon: 'dashboard', label: 'Dashboard', active: true },
            { icon: 'people', label: 'Users' },
            { icon: 'electric_moped', label: 'Fleet' },
            { icon: 'payments', label: 'Revenue' },
            { icon: 'bar_chart', label: 'Reports' },
          ].map(({ icon, label, active }) => (
            <div
              key={label}
              className={`flex items-center gap-3 px-4 py-3 rounded-xl cursor-pointer transition-colors ${
                active
                  ? 'bg-[#3a3939] text-[#c8c6c5] font-semibold'
                  : 'text-[#8e9192] hover:bg-white/5 hover:text-[#c8c6c5]'
              }`}
            >
              <span className="material-symbols-outlined">{icon}</span>
              <span>{label}</span>
            </div>
          ))}
        </nav>
        {/* Admin user footer */}
        <div className="p-5 border-t border-white/5">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-[#353434] border border-white/10 flex items-center justify-center overflow-hidden">
              <span className="material-symbols-outlined text-[#8e9192]">person</span>
            </div>
            <div>
              <p className="text-sm font-bold text-[#c8c6c5]">Admin User</p>
              <p className="text-xs text-[#8e9192]">System Lead</p>
            </div>
          </div>
          <button onClick={() => navigate('/')} className="btn-ghost w-full mt-4 text-sm py-2.5">Exit Admin</button>
        </div>
      </aside>

      {/* Main */}
      <main className="flex-1 overflow-x-hidden min-w-0">
        {/* Header */}
        <header className="h-20 flex items-center justify-between px-6 md:px-10 bg-[#141313]/80 backdrop-blur-xl border-b border-white/5 sticky top-0 z-30">
          <h1 className="text-2xl font-black text-[#e5e2e1]">Analytics Overview</h1>
          <div className="flex items-center gap-4">
            <div className="relative hidden sm:block">
              <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-[#8e9192] text-sm">search</span>
              <input
                type="text"
                className="bg-[#2b2a2a] border-none rounded-full py-2 pl-9 pr-4 text-sm text-[#e5e2e1] focus:outline-none focus:ring-1 focus:ring-[#c8c6c5] w-56 placeholder-[#8e9192]"
                placeholder="Search..."
              />
            </div>
            <button className="relative p-2 text-[#8e9192] hover:text-[#c8c6c5] transition-colors">
              <span className="material-symbols-outlined">notifications</span>
              <span className="absolute top-2 right-2 w-2 h-2 bg-[#00D26A] rounded-full shadow-[0_0_8px_rgba(0,210,106,0.8)]" />
            </button>
            <button onClick={() => navigate('/')} className="md:hidden btn-ghost text-sm py-2 px-4">Exit</button>
          </div>
        </header>

        <div className="p-6 md:p-10 space-y-8 max-w-7xl mx-auto">

          {/* ── KPI Cards ── */}
          {loading ? (
            <div className="flex justify-center py-10">
              <div className="w-10 h-10 border-2 border-[#00D26A] border-t-transparent rounded-full animate-spin" />
            </div>
          ) : (
            <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {kpis.map(({ label, value, trend, up, icon }) => (
                <div key={label} className="glass-panel rounded-2xl p-6 relative overflow-hidden group animate-fade-up">
                  {/* Watermark icon */}
                  <div className="absolute top-0 right-0 p-4 opacity-10 transform translate-x-4 -translate-y-4 group-hover:scale-110 transition-transform duration-500">
                    <span className="material-symbols-outlined text-8xl icon-filled">{icon}</span>
                  </div>
                  <div className="relative z-10 flex flex-col h-full justify-between">
                    <div className="flex justify-between items-start mb-6">
                      <h3 className="text-sm text-[#8e9192]">{label}</h3>
                      <span className={`px-2 py-1 rounded text-xs font-bold flex items-center gap-1 border border-white/5 ${
                        up === true ? 'bg-[#0e0e0e] text-[#00D26A]' :
                        up === false ? 'bg-[#0e0e0e] text-[#ffb4ab]' :
                        'bg-[#0e0e0e] text-[#8e9192]'
                      }`}>
                        <span className="material-symbols-outlined text-xs">
                          {up === true ? 'trending_up' : up === false ? 'trending_down' : 'trending_flat'}
                        </span>
                        {trend}
                      </span>
                    </div>
                    <p className="text-4xl font-black text-[#e5e2e1]">{value}</p>
                  </div>
                </div>
              ))}
            </section>
          )}

          {/* ── Revenue Chart (SVG-based like Stitch design) ── */}
          <section className="glass-panel rounded-2xl p-6 md:p-8">
            <div className="flex justify-between items-center mb-6">
              <div>
                <h2 className="text-lg font-bold text-[#e5e2e1]">Revenue Trends</h2>
                <p className="text-sm text-[#8e9192] mt-1">Comparing current month to previous periods</p>
              </div>
              <div className="flex bg-[#0e0e0e] rounded-xl p-1 border border-white/5">
                {(['Daily', 'Weekly', 'Monthly'] as const).map((p) => (
                  <button
                    key={p}
                    onClick={() => setChartPeriod(p)}
                    className={`px-4 py-1.5 rounded-lg text-sm transition-colors ${
                      chartPeriod === p ? 'bg-[#3a3939] text-[#c8c6c5]' : 'text-[#8e9192] hover:text-[#c8c6c5]'
                    }`}
                  >
                    {p}
                  </button>
                ))}
              </div>
            </div>
            {/* SVG Chart */}
            <div className="h-72 w-full relative border-l border-b border-white/10 mt-8">
              {/* Y axis labels */}
              <div className="absolute -left-12 top-0 bottom-0 flex flex-col justify-between text-xs text-[#8e9192] text-right py-2">
                <span>₹100k</span><span>₹75k</span><span>₹50k</span><span>₹25k</span><span>₹0</span>
              </div>
              {/* Grid lines */}
              <div className="absolute inset-0 flex flex-col justify-between pointer-events-none">
                {[0,1,2,3].map((i) => <div key={i} className="w-full h-px bg-white/5" />)}
                <div className="w-full h-px bg-transparent" />
              </div>
              {/* SVG area chart */}
              <div className="absolute inset-0 flex items-end overflow-hidden">
                <div className="w-full h-full relative">
                  {/* gradient fill */}
                  <div
                    className="absolute bottom-0 left-0 w-full h-[70%] bg-gradient-to-t from-[#00D26A]/20 to-transparent"
                    style={{ clipPath: 'polygon(0 100%, 0 60%, 10% 40%, 20% 50%, 30% 30%, 40% 45%, 50% 20%, 60% 35%, 70% 10%, 80% 25%, 90% 5%, 100% 15%, 100% 100%)' }}
                  />
                  <svg className="absolute inset-0 w-full h-full" preserveAspectRatio="none" viewBox="0 0 100 100">
                    <path d="M0,60 L10,40 L20,50 L30,30 L40,45 L50,20 L60,35 L70,10 L80,25 L90,5 L100,15" fill="none" stroke="#00D26A" strokeLinejoin="round" strokeWidth="2" vectorEffect="non-scaling-stroke" />
                    <circle className="animate-pulse" cx="50" cy="20" fill="#111111" r="3" stroke="#00D26A" strokeWidth="2" />
                  </svg>
                  {/* Tooltip */}
                  <div className="absolute left-1/2 top-[15%] -translate-x-1/2 glass-panel border border-white/10 rounded-xl p-3 shadow-xl flex flex-col items-center pointer-events-none">
                    <span className="text-xs text-[#8e9192] mb-1 font-bold uppercase tracking-widest">Peak Day</span>
                    <span className="text-lg font-black text-[#00D26A]">₹82,450</span>
                  </div>
                </div>
              </div>
              {/* X axis labels */}
              <div className="absolute -bottom-7 left-0 right-0 flex justify-between text-xs text-[#8e9192] px-2">
                {['Mon','Tue','Wed','Thu','Fri','Sat','Sun'].map((d) => <span key={d}>{d}</span>)}
              </div>
            </div>
          </section>

          {/* ── Fleet Maintenance Status ── */}
          <section className="glass-panel rounded-2xl p-6 md:p-8">
            <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center mb-4 gap-4">
              <div>
                <h2 className="text-lg font-bold text-[#e5e2e1]">Fleet Maintenance Status</h2>
                <p className="text-sm text-[#8e9192] mt-1">Real-time health distribution across the active fleet</p>
              </div>
              <div className="flex items-center gap-4 text-xs">
                {[
                  { color: 'bg-[#00D26A]', label: 'Healthy (82%)' },
                  { color: 'bg-[#c8c6c5]', label: 'Service Due (12%)' },
                  { color: 'bg-[#ffb4ab]', label: 'Critical (6%)' },
                ].map(({ color, label }) => (
                  <div key={label} className="flex items-center gap-2">
                    <span className={`w-3 h-3 rounded-full ${color}`} />
                    <span className="text-[#8e9192]">{label}</span>
                  </div>
                ))}
              </div>
            </div>
            {/* Segmented progress bar */}
            <div className="h-4 w-full bg-[#0e0e0e] rounded-full overflow-hidden flex">
              <div className="h-full bg-[#00D26A]" style={{ width: '82%' }} />
              <div className="h-full bg-[#c8c6c5]" style={{ width: '12%' }} />
              <div className="h-full bg-[#ffb4ab]" style={{ width: '6%' }} />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6">
              {[
                { label: 'Battery Health', value: '92.4% Avg' },
                { label: 'Tire Pressure', value: 'Optimal' },
                { label: 'Next Service', value: '14 Vehicles' },
              ].map(({ label, value }) => (
                <div key={label} className="p-4 rounded-xl bg-white/5 border border-white/5">
                  <p className="text-xs text-[#8e9192] uppercase font-bold tracking-widest mb-1">{label}</p>
                  <p className="text-lg font-bold text-[#e5e2e1]">{value}</p>
                </div>
              ))}
            </div>
          </section>

          {/* ── Recent Rentals + Live Fleet Map ── */}
          <section className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            {/* Recent Rentals Table */}
            <div className="lg:col-span-8 glass-panel rounded-2xl overflow-hidden">
              <div className="p-5 border-b border-white/5 flex justify-between items-center">
                <h2 className="text-lg font-bold text-[#e5e2e1]">Recent Rentals</h2>
                <button className="text-[#8e9192] hover:text-[#c8c6c5] transition-colors flex items-center text-sm">
                  View All <span className="material-symbols-outlined ml-1 text-sm">arrow_forward</span>
                </button>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-sm text-left">
                  <thead>
                    <tr className="bg-[#0e0e0e]/50 border-b border-white/5">
                      {['Vehicle ID','User','Status','Duration','Revenue','Dynamic Pricing'].map((h) => (
                        <th key={h} className="p-4 text-xs font-bold text-[#8e9192] uppercase tracking-widest whitespace-nowrap">{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-white/5">
                    {RECENT_RENTALS.map((r) => (
                      <tr key={r.id} className="hover:bg-white/3 transition-colors">
                        <td className="p-4 text-[#c8c6c5] font-bold">{r.id}</td>
                        <td className="p-4 text-[#8e9192]">{r.user}</td>
                        <td className="p-4">
                          <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-bold gap-1.5 ${
                            r.status === 'Active' ? 'bg-[#00D26A]/10 text-[#00D26A]' :
                            r.status === 'Maintenance' ? 'bg-[#ffb4ab]/10 text-[#ffb4ab]' :
                            'bg-[#353434] text-[#8e9192]'
                          }`}>
                            {r.status === 'Active' && <span className="w-1.5 h-1.5 rounded-full bg-[#00D26A] animate-pulse" />}
                            {r.status}
                          </span>
                        </td>
                        <td className="p-4 text-[#8e9192]">{r.duration}</td>
                        <td className="p-4 text-[#e5e2e1]">{r.revenue}</td>
                        <td className="p-4 text-[#8e9192]">{r.pricing}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Live Fleet Map */}
            <div className="lg:col-span-4 glass-panel rounded-2xl overflow-hidden relative min-h-[320px]">
              <div
                className="absolute inset-0 z-0 bg-[#1c1b1b]"
                style={{ backgroundImage: `url('https://lh3.googleusercontent.com/aida-public/AB6AXuC1ubnJTZTrAybjG2JXgZwAsy_diyfIjMVNqD7RlC4ccJq4Fjuk6Yif8YTtqgyqy4JPvD8VSPEx_kO8vKMYJ7ZPCZZPt_iMOD3WYdPi86BLN4snR2oIzb0H8S70YA8PjQh1XDLhVRnYn61theLd8ECqXgLWAClta6ohtURPovv4hRl0Wb2aRNVEoP4pz4KPcO_pBTqOG6rFddMynR-yKGy3GtWIzgRoEB_B-KHg7iZe4Sr93wU-X7zqmg')`, backgroundSize: 'cover', backgroundPosition: 'center' }}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#111111] via-[#111111]/40 to-transparent" />
              <div className="relative z-10 p-5 flex justify-between items-start">
                <h2 className="text-lg font-bold text-[#e5e2e1] drop-shadow-md">Live Fleet Map</h2>
                <span className="material-symbols-outlined text-[#00D26A] drop-shadow-[0_0_8px_rgba(0,210,106,0.8)]">satellite_alt</span>
              </div>
              <div className="relative z-10 mt-auto p-5 absolute bottom-0 left-0 right-0">
                <div className="glass-panel p-4 rounded-xl space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-[#8e9192]">Total Online</span>
                    <span className="text-lg font-black text-[#e5e2e1]">12,405</span>
                  </div>
                  <div className="w-full h-1.5 bg-[#353434] rounded-full overflow-hidden">
                    <div className="w-[85%] h-full bg-[#00D26A] shadow-[0_0_8px_rgba(0,210,106,0.5)]" />
                  </div>
                  <p className="text-xs text-[#8e9192] text-right font-bold">85% Utilization</p>
                </div>
              </div>
            </div>
          </section>

          {/* ── Fleet Table ── */}
          <section className="glass-panel rounded-2xl overflow-hidden">
            <div className="flex justify-between items-center p-5 border-b border-white/5">
              <h2 className="text-lg font-bold text-[#e5e2e1]">Live Fleet Management</h2>
              <button onClick={openAdd} className="btn-primary text-sm py-2 px-4">+ Add Bike</button>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-sm text-left">
                <thead>
                  <tr className="text-[#8e9192] border-b border-white/5">
                    {['ID','Name','Type','Price','Battery','Status','Actions'].map((h) => (
                      <th key={h} className="pb-3 p-4 font-semibold whitespace-nowrap">{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5">
                  {bikes.map((bike) => (
                    <tr key={bike.id} className="hover:bg-white/2 transition-colors">
                      <td className="py-3 px-4 text-[#8e9192]">#{bike.id}</td>
                      <td className="py-3 px-4 font-semibold text-[#e5e2e1]">{bike.name}</td>
                      <td className="py-3 px-4 text-[#c4c7c7]">{bike.type}</td>
                      <td className="py-3 px-4 text-[#c4c7c7]">₹{bike.pricePerMinute}/min</td>
                      <td className="py-3 px-4">
                        <div className="flex items-center gap-2">
                          <div className="w-16 h-1.5 bg-[#2D2D2D] rounded-full overflow-hidden">
                            <div className="h-full bg-[#00D26A] rounded-full" style={{ width: `${bike.batteryPercentage}%` }} />
                          </div>
                          <span className="text-[#00D26A] text-xs font-bold">{bike.batteryPercentage}%</span>
                        </div>
                      </td>
                      <td className="py-3 px-4">
                        <span className={
                          bike.status === 'AVAILABLE' ? 'status-badge-available' :
                          bike.status === 'RENTED' ? 'status-badge-rented' :
                          'status-badge-maintenance'
                        }>{bike.status}</span>
                      </td>
                      <td className="py-3 px-4">
                        <div className="flex gap-2">
                          <button onClick={() => openEdit(bike)} className="text-xs btn-ghost py-1.5 px-3">Edit</button>
                          <button onClick={() => handleDelete(bike.id)} className="text-xs py-1.5 px-3 rounded-lg bg-[#ffb4ab]/10 text-[#ffb4ab] border border-[#ffb4ab]/20 hover:bg-[#ffb4ab]/20 transition-colors">Del</button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>

          {/* ── Users Table ── */}
          <section className="glass-panel rounded-2xl overflow-hidden">
            <h2 className="text-lg font-bold text-[#e5e2e1] p-5 border-b border-white/5">User Directory</h2>
            <div className="overflow-x-auto">
              <table className="w-full text-sm text-left">
                <thead>
                  <tr className="text-[#8e9192] border-b border-white/5">
                    {['ID','Username','Email','Role','Points','Level'].map((h) => (
                      <th key={h} className="pb-3 p-4 font-semibold whitespace-nowrap">{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5">
                  {users.map((u) => (
                    <tr key={u.id} className="hover:bg-white/2 transition-colors">
                      <td className="py-3 px-4 text-[#8e9192]">#{u.id}</td>
                      <td className="py-3 px-4 font-semibold text-[#e5e2e1]">{u.username}</td>
                      <td className="py-3 px-4 text-[#c4c7c7]">{u.email}</td>
                      <td className="py-3 px-4">
                        <span className={`text-xs font-bold px-2 py-0.5 rounded-full ${u.role === 'ROLE_ADMIN' ? 'bg-[#00D26A]/15 text-[#00D26A]' : 'bg-white/5 text-[#8e9192]'}`}>
                          {u.role === 'ROLE_ADMIN' ? 'Admin' : 'User'}
                        </span>
                      </td>
                      <td className="py-3 px-4 text-[#c4c7c7]">{u.loyaltyPoints}</td>
                      <td className="py-3 px-4 text-[#c4c7c7]">{u.userLevel}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>
        </div>
      </main>

      {/* Add/Edit Modal */}
      <Modal isOpen={modalOpen} onClose={() => setModalOpen(false)} title={editId ? 'Edit Bike' : 'Add New Bike'}>
        <form onSubmit={handleSave} className="flex flex-col gap-4">
          <div>
            <label className="block text-xs font-bold uppercase tracking-widest text-[#8e9192] mb-2">Model Name</label>
            <input type="text" className="input-field" required value={form.name} onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))} />
          </div>
          <div>
            <label className="block text-xs font-bold uppercase tracking-widest text-[#8e9192] mb-2">Type</label>
            <select className="input-field" value={form.type} onChange={(e) => setForm((f) => ({ ...f, type: e.target.value }))}>
              {['Electric', 'Cruiser', 'Sport', 'Mountain'].map((t) => <option key={t}>{t}</option>)}
            </select>
          </div>
          <div>
            <label className="block text-xs font-bold uppercase tracking-widest text-[#8e9192] mb-2">Rate (₹/min)</label>
            <input type="number" min="0.1" step="0.1" className="input-field" required value={form.pricePerMinute} onChange={(e) => setForm((f) => ({ ...f, pricePerMinute: Number(e.target.value) }))} />
          </div>
          <div>
            <label className="block text-xs font-bold uppercase tracking-widest text-[#8e9192] mb-2">Battery %</label>
            <input type="number" min="0" max="100" className="input-field" required value={form.batteryPercentage} onChange={(e) => setForm((f) => ({ ...f, batteryPercentage: Number(e.target.value) }))} />
          </div>
          <div>
            <label className="block text-xs font-bold uppercase tracking-widest text-[#8e9192] mb-2">Status</label>
            <select className="input-field" value={form.status} onChange={(e) => setForm((f) => ({ ...f, status: e.target.value }))}>
              {['AVAILABLE', 'RENTED', 'MAINTENANCE'].map((s) => <option key={s}>{s}</option>)}
            </select>
          </div>
          <div>
            <label className="block text-xs font-bold uppercase tracking-widest text-[#8e9192] mb-2">Description</label>
            <textarea className="input-field" rows={3} value={form.description ?? ''} onChange={(e) => setForm((f) => ({ ...f, description: e.target.value }))} />
          </div>
          <div className="flex gap-3 mt-2">
            <button type="button" onClick={() => setModalOpen(false)} className="btn-ghost flex-1">Cancel</button>
            <button type="submit" disabled={saving} className="btn-primary flex-1 disabled:opacity-60">
              {saving ? 'Saving…' : 'Save'}
            </button>
          </div>
        </form>
      </Modal>
    </div>
  )
}
