import { apiClient } from './api'
import type { LoginRequest, LoginResponse, RegisterRequest, User } from './api'

export class AuthService {
  async login(credentials: LoginRequest): Promise<LoginResponse> {
    try {
      const response = await apiClient.post<LoginResponse>('/auth/login', credentials)
      if (response.token) {
        localStorage.setItem('auth-token', response.token)
        localStorage.setItem('user', JSON.stringify(response.user))
      }

      return response
    } catch (error) {
      console.error('Login failed:', error)
      throw new Error('Falha no login. Verifique suas credenciais.')
    }
  }

  async register(userData: RegisterRequest): Promise<User> {
    try {
      const response = await apiClient.post<User>('/auth/register', userData)
      return response
    } catch (error) {
      console.error('Registration failed:', error)
      throw new Error('Falha no registro. Tente novamente.')
    }
  }

  logout(): void {
    localStorage.removeItem('auth-token')
    localStorage.removeItem('user')
  }

  getCurrentUser(): User | null {
    const userStr = localStorage.getItem('user')
    if (userStr) {
      try {
        return JSON.parse(userStr)
      } catch {
        return null
      }
    }
    return null
  }

  getToken(): string | null {
    return localStorage.getItem('auth-token')
  }

  isAuthenticated(): boolean {
    return !!this.getToken()
  }

  async validateToken(): Promise<boolean> {
    try {
      await apiClient.get('/auth/validate')
      return true
    } catch {
      // this.logout()
      console.log("Entrei aqui")
      return false
    }
  }
}

export const authService = new AuthService()
