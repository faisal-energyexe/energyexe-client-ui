const API_BASE_URL =
  import.meta.env.VITE_API_URL || 'http://127.0.0.1:8001/api/v1'

export class ApiError extends Error {
  constructor(
    message: string,
    public status: number,
    public data?: any,
  ) {
    super(message)
    this.name = 'ApiError'
  }
}

class ApiClient {
  private baseUrl: string
  private token: string | null = null

  constructor(baseUrl: string) {
    this.baseUrl = baseUrl
    this.token = localStorage.getItem('auth_token')
  }

  setToken(token: string | null) {
    this.token = token
    if (token) {
      localStorage.setItem('auth_token', token)
    } else {
      localStorage.removeItem('auth_token')
    }
  }

  private async request<T>(
    endpoint: string,
    options: RequestInit = {},
  ): Promise<T> {
    const url = `${this.baseUrl}${endpoint}`

    const isFormData = options.body instanceof FormData
    const config: RequestInit = {
      headers: isFormData ? { ...options.headers } : {
        'Content-Type': 'application/json',
        ...options.headers,
      },
      ...options,
    }

    if (this.token) {
      config.headers = {
        ...config.headers,
        Authorization: `Bearer ${this.token}`,
      }
    }

    try {
      const response = await fetch(url, config)

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}))
        throw new ApiError(
          errorData.detail || `HTTP ${response.status}: ${response.statusText}`,
          response.status,
          errorData,
        )
      }

      return await response.json()
    } catch (error) {
      if (error instanceof ApiError) {
        throw error
      }
      throw new ApiError('Network error', 0, error)
    }
  }

  async get<T>(endpoint: string): Promise<T> {
    const endpointWithoutTrailingQuestionMark = endpoint.endsWith('?')
      ? endpoint.replace(/\?.*$/, '/')
      : endpoint
    return this.request<T>(endpointWithoutTrailingQuestionMark, {
      method: 'GET',
    })
  }

  async post<T>(endpoint: string, data?: any, options?: RequestInit): Promise<T> {
    const body = data ? (data instanceof FormData ? data : JSON.stringify(data)) : undefined
    const isFormData = data instanceof FormData

    return this.request<T>(endpoint, {
      method: 'POST',
      body,
      ...options,
      headers: isFormData ? options?.headers : {
        'Content-Type': 'application/json',
        ...options?.headers,
      },
    })
  }

  async put<T>(endpoint: string, data?: any): Promise<T> {
    return this.request<T>(endpoint, {
      method: 'PUT',
      body: data ? JSON.stringify(data) : undefined,
    })
  }

  async patch<T>(endpoint: string, data?: any): Promise<T> {
    return this.request<T>(endpoint, {
      method: 'PATCH',
      body: data ? JSON.stringify(data) : undefined,
    })
  }

  async delete<T>(endpoint: string): Promise<T> {
    return this.request<T>(endpoint, { method: 'DELETE' })
  }
}

export const apiClient = new ApiClient(API_BASE_URL)
