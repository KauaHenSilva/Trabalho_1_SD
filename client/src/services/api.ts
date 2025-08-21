// Configuração base da API
const VITE_API_URL = import.meta.env.VITE_API_URL || 'http://localhost:9001'
console.warn('VITE_API_URL:', import.meta.env.VITE_API_URL)

// Interface para configuração das requisições
interface RequestConfig {
  method?: 'GET' | 'POST' | 'PUT' | 'DELETE'
  headers?: Record<string, string>
  body?: any
}

// Classe para gerenciar as requisições HTTP
class ApiClient {
  private baseUrl: string

  constructor(baseUrl: string) {
    this.baseUrl = baseUrl
  }

  private async request<T>(endpoint: string, config: RequestConfig = {}): Promise<T> {
    const url = `${this.baseUrl}${endpoint}`
    const { method = 'GET', headers = {}, body } = config

    const requestHeaders: Record<string, string> = {
      'Content-Type': 'application/json',
      ...headers
    }

    // Adicionar token de autenticação se existir
    const token = localStorage.getItem('auth-token')
    console.log('Token de autenticação:', token)
    if (token) {
      requestHeaders.authorization = `Bearer ${token}`
    }

    try {
      const response = await fetch(url, {
        method,
        headers: requestHeaders,
        body: body ? JSON.stringify(body) : undefined,
      })

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }

      const data = await response.json()
      return data
    } catch (error) {
      console.error('API request failed:', error)
      throw error
    }
  }

  async get<T>(endpoint: string, headers?: Record<string, string>): Promise<T> {
    return this.request<T>(endpoint, { method: 'GET', headers })
  }

  async post<T>(endpoint: string, body: any, headers?: Record<string, string>): Promise<T> {
    return this.request<T>(endpoint, { method: 'POST', body, headers })
  }

  async put<T>(endpoint: string, body: any, headers?: Record<string, string>): Promise<T> {
    return this.request<T>(endpoint, { method: 'PUT', body, headers })
  }

  async delete<T>(endpoint: string, headers?: Record<string, string>): Promise<T> {
    return this.request<T>(endpoint, { method: 'DELETE', headers })
  }
}

// Instância global da API
export const apiClient = new ApiClient(VITE_API_URL)

export interface User {
  id: number
  email: string
  createdAt: string
}

export interface Book {
  id: number
  title: string
  author: string
  year: number
  pages: number
  createdAt?: string
}

export interface LoginRequest {
  email: string
  password: string
}

export interface LoginResponse {
  token: string
  user: User
}

export interface RegisterRequest {
  email: string
  password: string
}

// Response padrão da API
export interface ApiResponse<T> {
  data: T
  message: string
  status: number
}

// Resposta paginada
export interface PaginatedResponse<T> {
  data: T[]
  pagination: {
    page: number
    limit: number
    total: number
    totalPages: number
  }
}
