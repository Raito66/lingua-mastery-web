import axios from 'axios'

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
})

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token')
  if (token) config.headers.Authorization = `Bearer ${token}`
  return config
})

export interface AuthResponse {
  token: string
  email: string
}

export const register = (email: string, password: string) =>
  api.post<AuthResponse>('/api/auth/register', { email, password })

export const login = (email: string, password: string) =>
  api.post<AuthResponse>('/api/auth/login', { email, password })

export default api
