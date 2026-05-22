import api from './auth'

export interface ProfileResponse {
  email: string
  displayName: string | null
}

export interface MessageResponse {
  message: string
}

export const getProfile = () =>
  api.get<ProfileResponse>('/api/profile')

export const updateProfile = (displayName: string) =>
  api.put<ProfileResponse>('/api/profile', { displayName })

export const changePassword = (currentPassword: string, newPassword: string) =>
  api.put<MessageResponse>('/api/profile/password', { currentPassword, newPassword })
