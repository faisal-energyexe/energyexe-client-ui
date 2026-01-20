import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { apiClient } from './api'
import type {
  AuthResponse,
  LoginRequest,
  User,
} from '../types/auth'

// Auth API functions
export const authApi = {
  login: async (data: LoginRequest): Promise<AuthResponse> => {
    return apiClient.post<AuthResponse>('/auth/login', data)
  },

  getCurrentUser: async (): Promise<User> => {
    return apiClient.get<User>('/users/me')
  },

  refreshToken: async (): Promise<AuthResponse> => {
    return apiClient.post<AuthResponse>('/auth/refresh')
  },
}

// React Query hooks
export const useLogin = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: authApi.login,
    onSuccess: (data) => {
      // Set token in API client
      apiClient.setToken(data.access_token)

      // Update auth state in cache
      queryClient.setQueryData(['auth', 'user'], data.user)
      queryClient.setQueryData(['auth', 'token'], data.access_token)
    },
    onError: () => {
      // Clear any existing auth data on error
      apiClient.setToken(null)
      queryClient.removeQueries({ queryKey: ['auth'] })
    },
  })
}

export const useCurrentUser = () => {
  return useQuery({
    queryKey: ['auth', 'user'],
    queryFn: authApi.getCurrentUser,
    retry: false,
    enabled: !!localStorage.getItem('auth_token'),
  })
}

export const useLogout = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: () => {
      // Clear token from API client
      apiClient.setToken(null)
      return Promise.resolve()
    },
    onSuccess: () => {
      // Clear all auth-related queries
      queryClient.removeQueries({ queryKey: ['auth'] })
      queryClient.clear()
    },
  })
}
