import api from './auth'

export interface StreakResponse {
  streak: number
  todayCount: number
}

export const getStreak = () => api.get<StreakResponse>('/api/stats/streak')
