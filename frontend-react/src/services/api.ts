import axios, { AxiosError } from 'axios'
import type { LoginRequest, LoginResponse, RegisterRequest, Bike, Rental, User, AdminStats, BikeFormData } from '@/types'

// ─── Axios Instance ───────────────────────────────────────────────────────────

const API_BASE = import.meta.env.VITE_API_URL || '/api'

const api = axios.create({
  baseURL: API_BASE,
  headers: { 'Content-Type': 'application/json' },
  timeout: 15000,
})

// ─── JWT Request Interceptor ──────────────────────────────────────────────────

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('volt_token')
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})

// ─── Response Interceptor (401 → redirect to login) ──────────────────────────

api.interceptors.response.use(
  (response) => response,
  (error: AxiosError) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('volt_token')
      localStorage.removeItem('volt_user')
      window.location.href = '/login'
    }
    return Promise.reject(error)
  }
)

// ─── Auth ─────────────────────────────────────────────────────────────────────

export const authApi = {
  login: async (data: LoginRequest): Promise<LoginResponse> => {
    const res = await api.post<LoginResponse>('/login', data)
    return res.data
  },

  register: async (data: RegisterRequest): Promise<{ message: string }> => {
    const res = await api.post<{ message: string }>('/register', data)
    return res.data
  },
}

// ─── Bikes ───────────────────────────────────────────────────────────────────

export const bikesApi = {
  getAll: async (): Promise<Bike[]> => {
    const res = await api.get<Bike[]>('/bikes')
    return res.data
  },

  getById: async (id: number): Promise<Bike> => {
    const res = await api.get<Bike>(`/bike/${id}`)
    return res.data
  },
}

// ─── Rentals ──────────────────────────────────────────────────────────────────

export const rentalsApi = {
  rent: async (bikeId: number): Promise<Rental> => {
    const res = await api.post<Rental>('/rent', { bikeId })
    return res.data
  },

  returnBike: async (latitude: number, longitude: number): Promise<Rental> => {
    const res = await api.post<Rental>('/return', { latitude, longitude })
    return res.data
  },

  getActive: async (): Promise<Rental | { active: false }> => {
    const res = await api.get<Rental | { active: false }>('/rental/active')
    return res.data
  },

  getHistory: async (): Promise<Rental[]> => {
    const res = await api.get<Rental[]>('/history')
    return res.data
  },
}

// ─── User Profile ─────────────────────────────────────────────────────────────

export const userApi = {
  getProfile: async (): Promise<User> => {
    const res = await api.get<User>('/profile')
    return res.data
  },

  getRewards: async (): Promise<User> => {
    const res = await api.get<User>('/rewards')
    return res.data
  },
}

// ─── Admin ────────────────────────────────────────────────────────────────────

export const adminApi = {
  getStats: async (): Promise<AdminStats> => {
    const res = await api.get<AdminStats>('/admin/stats')
    return res.data
  },

  getBikes: async (): Promise<Bike[]> => {
    const res = await api.get<Bike[]>('/admin/bikes')
    return res.data
  },

  getUsers: async (): Promise<User[]> => {
    const res = await api.get<User[]>('/admin/users')
    return res.data
  },

  addBike: async (data: BikeFormData): Promise<Bike> => {
    const res = await api.post<Bike>('/admin/bikes', data)
    return res.data
  },

  updateBike: async (id: number, data: BikeFormData): Promise<Bike> => {
    const res = await api.put<Bike>(`/admin/bikes/${id}`, data)
    return res.data
  },

  deleteBike: async (id: number): Promise<void> => {
    await api.delete(`/admin/bikes/${id}`)
  },
}

export default api
