import { createContext, useContext, useEffect, useState } from 'react'
import {
  useCurrentUser,
  useLogin,
  useLogout,
} from '../lib/auth-api'
import { apiClient } from '../lib/api'
import type { AuthContextType } from '../types/auth'

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}

interface AuthProviderProps {
  children: React.ReactNode
}

export function AuthProvider({ children }: AuthProviderProps) {
  const [token, setToken] = useState<string | null>(
    localStorage.getItem('auth_token'),
  )

  const {
    data: user,
    isLoading: userLoading,
    error: userError,
  } = useCurrentUser()
  const loginMutation = useLogin()
  const logoutMutation = useLogout()

  // Update token state when it changes (cross-tab sync)
  useEffect(() => {
    const handleStorageChange = () => {
      setToken(localStorage.getItem('auth_token'))
    }

    window.addEventListener('storage', handleStorageChange)
    return () => window.removeEventListener('storage', handleStorageChange)
  }, [])

  // Clear token if user fetch fails with auth error
  useEffect(() => {
    if (userError && 'status' in userError && userError.status === 401) {
      apiClient.setToken(null)
      setToken(null)
    }
  }, [userError])

  const login = async (email: string, password: string) => {
    const response = await loginMutation.mutateAsync({
      username: email,
      password,
    })
    setToken(response.access_token)
  }

  const logout = async () => {
    try {
      await logoutMutation.mutateAsync()
      setToken(null)
    } catch (error) {
      // Even if logout fails on server, clear local state
      setToken(null)
      throw error
    }
  }

  const value: AuthContextType = {
    user: user || null,
    token,
    isAuthenticated: !!token && !!user,
    isLoading: userLoading || loginMutation.isPending,
    login,
    logout,
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}
