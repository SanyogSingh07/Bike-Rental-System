import { useNavigate, useLocation } from 'react-router-dom'
import { useAuthStore } from '@/store/authStore'

interface NavbarProps {
  transparent?: boolean
}

export default function Navbar({ transparent = false }: NavbarProps) {
  const navigate = useNavigate()
  const location = useLocation()
  const { isAuthenticated, isAdmin } = useAuthStore()

  const isActive = (path: string) => location.pathname === path

  return (
    <header
      className={`fixed top-0 left-0 w-full z-50 flex items-center justify-between px-5 h-16 ${
        transparent ? 'bg-transparent' : 'glass-nav'
      } shadow-black/20`}
    >
      {/* Logo */}
      <button
        onClick={() => navigate('/')}
        className="flex items-center gap-2 hover:opacity-80 transition-opacity active:scale-95 duration-200"
        aria-label="Go to home"
      >
        <span
          className="material-symbols-outlined icon-filled text-[#c8c6c5] text-3xl"
          style={{ color: '#c8c6c5' }}
        >
          electric_bolt
        </span>
        <span className="text-2xl font-black tracking-tighter text-[#c8c6c5]">VOLT</span>
      </button>

      {/* Desktop Nav Links */}
      <nav className="hidden md:flex items-center gap-6">
        <button
          onClick={() => navigate('/')}
          className={`text-sm font-semibold transition-colors ${
            isActive('/') ? 'text-[#c8c6c5]' : 'text-[#c4c7c7] hover:text-[#c8c6c5]'
          }`}
        >
          Home
        </button>
        <button
          onClick={() => navigate('/explore')}
          className={`text-sm font-semibold transition-colors ${
            isActive('/explore') ? 'text-[#c8c6c5]' : 'text-[#c4c7c7] hover:text-[#c8c6c5]'
          }`}
        >
          Explore
        </button>
        {isAuthenticated && (
          <button
            onClick={() => navigate('/ride-status')}
            className={`text-sm font-semibold transition-colors ${
              isActive('/ride-status') ? 'text-[#c8c6c5]' : 'text-[#c4c7c7] hover:text-[#c8c6c5]'
            }`}
          >
            My Ride
          </button>
        )}
        {isAdmin && (
          <button
            onClick={() => navigate('/admin')}
            className="text-sm font-semibold text-[#00D26A] hover:opacity-80 transition-opacity"
          >
            Admin
          </button>
        )}
      </nav>

      {/* Profile Icon */}
      <button
        onClick={() => navigate(isAuthenticated ? '/profile' : '/login')}
        className="w-8 h-8 rounded-full bg-[#353434] flex items-center justify-center hover:bg-[#3a3939] transition-colors active:scale-95 duration-200"
        aria-label="Profile"
      >
        <span className="material-symbols-outlined text-[#c4c7c7] text-xl">person</span>
      </button>
    </header>
  )
}
