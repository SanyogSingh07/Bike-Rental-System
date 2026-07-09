import { useNavigate, useLocation } from 'react-router-dom'

const navItems = [
  { icon: 'home', label: 'Home', path: '/' },
  { icon: 'explore', label: 'Explore', path: '/explore' },
  { icon: 'directions_bike', label: 'Ride', path: '/ride-status' },
  { icon: 'military_tech', label: 'Rewards', path: '/rewards' },
  { icon: 'person', label: 'Profile', path: '/profile' },
]

export default function BottomNav() {
  const navigate = useNavigate()
  const location = useLocation()

  return (
    <nav className="md:hidden fixed bottom-0 left-0 w-full z-50 rounded-t-2xl bg-[#141313]/60 backdrop-blur-2xl border-t border-white/5 shadow-[0_-10px_40px_rgba(0,0,0,0.4)] flex justify-around items-center h-20 px-4">
      {navItems.map(({ icon, label, path }) => {
        const active = location.pathname === path
        return (
          <button
            key={path}
            onClick={() => navigate(path)}
            className={`flex flex-col items-center justify-center gap-0.5 relative transition-all active:scale-90 duration-200 ${
              active ? 'text-[#c8c6c5]' : 'text-[#c4c7c7]'
            }`}
            aria-label={label}
          >
            <span
              className="material-symbols-outlined text-2xl"
              style={active ? { fontVariationSettings: "'FILL' 1" } : {}}
            >
              {icon}
            </span>
            {active && (
              <span className="absolute -bottom-1 w-1 h-1 bg-[#c8c6c5] rounded-full" />
            )}
          </button>
        )
      })}
    </nav>
  )
}
