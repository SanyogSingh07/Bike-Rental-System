import { create } from 'zustand'
import { persist } from 'zustand/middleware'

interface AuthState {
  token: string | null
  username: string | null
  role: string | null
  isAuthenticated: boolean
  isAdmin: boolean
  login: (token: string, username: string, role: string) => void
  logout: () => void
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      token: null,
      username: null,
      role: null,
      isAuthenticated: false,
      isAdmin: false,

      login: (token, username, role) =>
        set({
          token,
          username,
          role,
          isAuthenticated: true,
          isAdmin: role === 'ROLE_ADMIN',
        }),

      logout: () => {
        localStorage.removeItem('volt_token')
        localStorage.removeItem('volt_user')
        set({
          token: null,
          username: null,
          role: null,
          isAuthenticated: false,
          isAdmin: false,
        })
      },
    }),
    {
      name: 'volt_auth',
      partialize: (state) => ({
        token: state.token,
        username: state.username,
        role: state.role,
        isAuthenticated: state.isAuthenticated,
        isAdmin: state.isAdmin,
      }),
    }
  )
)
