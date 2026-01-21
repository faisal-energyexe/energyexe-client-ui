export type UserRole = 'admin' | 'client'

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
  // Client portal fields
  is_approved?: boolean
  email_verified?: boolean
  company_name?: string
  phone?: string
  approved_at?: string
  features?: Record<string, boolean>
}

export interface LoginRequest {
  username: string
  password: string
}

export interface RegisterRequest {
  email: string
  password: string
  first_name: string
  last_name: string
  company_name: string
  phone?: string
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
  logout: () => Promise<void>
}

export interface EmailVerificationResponse {
  message: string
  email: string
  is_approved: boolean
}

export interface InvitationValidation {
  valid: boolean
  email?: string
  message?: string
}

export interface InvitationAcceptRequest {
  first_name: string
  last_name: string
  password: string
  company_name: string
  phone?: string
}
