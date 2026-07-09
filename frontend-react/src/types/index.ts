// ─── Core Domain Types ────────────────────────────────────────────────────────

export interface Bike {
  id: number
  name: string
  type: 'Electric' | 'Cruiser' | 'Sport' | 'Mountain'
  pricePerMinute: number
  batteryPercentage: number
  status: 'AVAILABLE' | 'RENTED' | 'MAINTENANCE'
  latitude?: number
  longitude?: number
  description?: string
  imageUrl?: string
}

export interface Rental {
  id: number
  bikeId: number
  bikeName?: string
  bikeType?: string
  userId?: number
  startTime: string
  endTime?: string
  status: 'ACTIVE' | 'COMPLETED' | 'CANCELLED'
  totalCost?: number
  distanceTravelled?: number
}

export interface User {
  id: number
  username: string
  email: string
  role: 'ROLE_USER' | 'ROLE_ADMIN'
  loyaltyPoints: number
  userLevel: string
  co2Saved: number
}

export interface UserProfile extends User {}

export interface AdminStats {
  totalUsers: number
  totalBikes: number
  availableBikes: number
  rentedBikes: number
  totalRevenue: number
  avgDuration: number
}

// ─── API Response Wrappers ────────────────────────────────────────────────────

export interface ApiError {
  message: string
  status?: number
}

export interface LoginResponse {
  token: string
  username: string
  role: string
}

export interface RegisterRequest {
  username: string
  email: string
  password: string
}

export interface LoginRequest {
  username: string
  password: string
}

export interface RentRequest {
  bikeId: number
}

export interface ReturnRequest {
  latitude: number
  longitude: number
}

export interface BikeFormData {
  id?: number
  name: string
  type: string
  pricePerMinute: number
  batteryPercentage: number
  status: string
  description?: string
}
