import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { authApi } from '@/services/api'
import { useAuthStore } from '@/store/authStore'

type Mode = 'login' | 'register'

export default function Login() {
  const navigate = useNavigate()
  const { login, isAuthenticated } = useAuthStore()

  const [mode, setMode] = useState<Mode>('login')
  const [username, setUsername] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')

  useEffect(() => {
    if (isAuthenticated) navigate('/')
  }, [isAuthenticated, navigate])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setSuccess('')
    setLoading(true)

    try {
      if (mode === 'login') {
        const res = await authApi.login({ username, password })
        localStorage.setItem('volt_token', res.token)
        login(res.token, res.username, res.role)
        navigate('/')
      } else {
        await authApi.register({ username, email, password })
        setSuccess('Account created! You can now log in.')
        setMode('login')
        setPassword('')
      }
    } catch (err: unknown) {
      const msg =
        (err as { response?: { data?: { message?: string } } })?.response?.data?.message ||
        'Something went wrong. Please try again.'
      setError(msg)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center px-5 py-12">
      {/* Background gradient blobs */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-96 h-96 bg-[#00D26A]/5 rounded-full blur-3xl" />
        <div className="absolute -bottom-40 -left-40 w-96 h-96 bg-[#c8c6c5]/3 rounded-full blur-3xl" />
      </div>

      <div className="w-full max-w-md animate-fade-up">
        {/* Logo */}
        <div className="text-center mb-10">
          <div className="flex items-center justify-center gap-2 mb-2">
            <span className="material-symbols-outlined icon-filled text-[#c8c6c5] text-4xl">electric_bolt</span>
            <span className="text-5xl font-black tracking-tighter text-[#c8c6c5]">VOLT</span>
          </div>
          <p className="text-[#8e9192] text-sm">The future of urban mobility</p>
        </div>

        {/* Card */}
        <div className="glass-panel rounded-3xl p-8">
          {/* Tab Toggle */}
          <div className="flex bg-[#1c1b1b] rounded-2xl p-1 mb-8">
            {(['login', 'register'] as Mode[]).map((m) => (
              <button
                key={m}
                onClick={() => { setMode(m); setError(''); setSuccess('') }}
                className={`flex-1 py-2.5 rounded-xl text-sm font-bold capitalize transition-all duration-300 ${
                  mode === m
                    ? 'bg-[#2D2D2D] text-[#e5e2e1] shadow-lg'
                    : 'text-[#8e9192] hover:text-[#c4c7c7]'
                }`}
              >
                {m === 'login' ? 'Sign In' : 'Sign Up'}
              </button>
            ))}
          </div>

          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            <div>
              <label className="block text-xs font-bold uppercase tracking-widest text-[#8e9192] mb-2">
                Username
              </label>
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="input-field"
                placeholder="Enter username"
                required
                autoComplete="username"
              />
            </div>

            {mode === 'register' && (
              <div>
                <label className="block text-xs font-bold uppercase tracking-widest text-[#8e9192] mb-2">
                  Email
                </label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="input-field"
                  placeholder="your@email.com"
                  required
                  autoComplete="email"
                />
              </div>
            )}

            <div>
              <label className="block text-xs font-bold uppercase tracking-widest text-[#8e9192] mb-2">
                Password
              </label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="input-field"
                placeholder="Enter password"
                required
                autoComplete={mode === 'login' ? 'current-password' : 'new-password'}
              />
            </div>

            {error && (
              <div className="bg-red-900/30 border border-red-500/30 rounded-xl p-3 text-sm text-[#ffb4ab]">
                {error}
              </div>
            )}
            {success && (
              <div className="bg-green-900/30 border border-green-500/30 rounded-xl p-3 text-sm text-[#00D26A]">
                {success}
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="btn-primary w-full mt-2 py-4 text-base disabled:opacity-60 disabled:cursor-not-allowed"
            >
              {loading ? (
                <span className="flex items-center gap-2">
                  <svg className="animate-spin w-5 h-5" viewBox="0 0 24 24" fill="none">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                  </svg>
                  {mode === 'login' ? 'Signing in…' : 'Creating account…'}
                </span>
              ) : (
                mode === 'login' ? 'Sign In' : 'Create Account'
              )}
            </button>
          </form>

          {/* Demo hint */}
          <div className="mt-6 pt-6 border-t border-white/5 text-center">
            <p className="text-xs text-[#8e9192]">
              Demo: <span className="text-[#c4c7c7] font-mono">user / user123</span> &nbsp;|&nbsp; 
              Admin: <span className="text-[#c4c7c7] font-mono">admin / admin123</span>
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
