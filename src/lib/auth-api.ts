import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { apiClient } from './api'
import type {
  AuthResponse,
  EmailVerificationResponse,
  InvitationAcceptRequest,
  InvitationValidation,
  LoginRequest,
  RegisterRequest,
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

  // Client registration
  register: async (data: RegisterRequest): Promise<User> => {
    return apiClient.post<User>('/auth/client/register', data)
  },

  // Email verification
  verifyEmail: async (token: string): Promise<EmailVerificationResponse> => {
    return apiClient.post<EmailVerificationResponse>('/auth/verify-email', {
      token,
    })
  },

  resendVerification: async (
    email: string
  ): Promise<{ message: string }> => {
    return apiClient.post<{ message: string }>('/auth/resend-verification', {
      email,
    })
  },

  // Password reset
  forgotPassword: async (email: string): Promise<{ message: string }> => {
    return apiClient.post<{ message: string }>('/auth/forgot-password', {
      email,
    })
  },

  resetPassword: async (
    token: string,
    newPassword: string
  ): Promise<{ message: string }> => {
    return apiClient.post<{ message: string }>('/auth/reset-password', {
      token,
      new_password: newPassword,
    })
  },

  // Invitation
  validateInvitation: async (token: string): Promise<InvitationValidation> => {
    return apiClient.get<InvitationValidation>(`/auth/invitation/${token}`)
  },

  acceptInvitation: async (
    token: string,
    data: InvitationAcceptRequest
  ): Promise<User> => {
    return apiClient.post<User>(`/auth/invitation/${token}/accept`, data)
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

export const useRegister = () => {
  return useMutation({
    mutationFn: authApi.register,
  })
}

export const useVerifyEmail = () => {
  return useMutation({
    mutationFn: authApi.verifyEmail,
  })
}

export const useResendVerification = () => {
  return useMutation({
    mutationFn: authApi.resendVerification,
  })
}

export const useForgotPassword = () => {
  return useMutation({
    mutationFn: authApi.forgotPassword,
  })
}

export const useResetPassword = () => {
  return useMutation({
    mutationFn: ({ token, newPassword }: { token: string; newPassword: string }) =>
      authApi.resetPassword(token, newPassword),
  })
}

export const useValidateInvitation = (token: string) => {
  return useQuery({
    queryKey: ['invitation', token],
    queryFn: () => authApi.validateInvitation(token),
    enabled: !!token,
  })
}

export const useAcceptInvitation = () => {
  return useMutation({
    mutationFn: ({
      token,
      data,
    }: {
      token: string
      data: InvitationAcceptRequest
    }) => authApi.acceptInvitation(token, data),
  })
}
