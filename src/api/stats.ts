import api from './auth'

export interface StreakResponse {
  streak: number
  todayCount: number
}

export interface BookStatsResponse {
  totalWords: number
  totalStudied: number
  totalCorrect: number
  accuracy: number
  notLearned: number
  learning: number
  familiar: number
  mastered: number
}

export const getStreak = () => api.get<StreakResponse>('/api/stats/streak')
export const getBookStats = (bookId: number) => api.get<BookStatsResponse>(`/api/stats/book/${bookId}`)
