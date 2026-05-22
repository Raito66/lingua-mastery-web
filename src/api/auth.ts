import axios from 'axios'

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
})

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token')
  if (token) config.headers.Authorization = `Bearer ${token}`
  return config
})

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      const path: string = error.config?.url ?? ''
      if (!path.startsWith('/api/auth')) {
        localStorage.removeItem('token')
        localStorage.removeItem('email')
        window.location.href = '/login'
      }
    }
    return Promise.reject(error)
  }
)

export interface AuthResponse {
  token: string
  email: string
}

export interface MessageResponse {
  message: string
}

export const register = (email: string, password: string) =>
  api.post<MessageResponse>('/api/auth/register', { email, password })

export const login = (email: string, password: string) =>
  api.post<AuthResponse>('/api/auth/login', { email, password })

export const verifyEmail = (token: string) =>
  api.get<MessageResponse>(`/api/auth/verify?token=${token}`)

export const resendVerification = (email: string) =>
  api.post<MessageResponse>('/api/auth/resend-verification', { email })

export const forgotPassword = (email: string) =>
  api.post<MessageResponse>('/api/auth/forgot-password', { email })

export const resetPassword = (token: string, password: string) =>
  api.post<MessageResponse>('/api/auth/reset-password', { token, password })

export default api
