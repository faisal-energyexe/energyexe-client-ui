export type UserRole = 'user' | 'admin'

export type UserStatus = 'active' | 'inactive' | 'invited' | 'suspended'

export interface User {
  id: number
  email: string
  username: string
  first_name?: string
  last_name?: string
  phone_number?: string
  role: UserRole
  status: UserStatus
  is_active: boolean
  is_superuser: boolean
  created_at: string
  updated_at: string
  last_login_at?: string
}

export interface LoginRequest {
  username: string
  password: string
}

export interface AuthResponse {
  access_token: string
  token_type: string
  user: User
}

export interface AuthState {
  user: User | null
  token: string | null
  isAuthenticated: boolean
  isLoading: boolean
}

export interface AuthContextType extends AuthState {
  login: (email: string, password: string) => Promise<void>
  logout: () => void
}
