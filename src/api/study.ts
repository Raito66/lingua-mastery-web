import api from './auth'
import type { Word } from './words'

export interface StatsResponse {
  totalStudied: number
  totalCorrect: number
  accuracy: number
}

export const getStudyWords = (bookId: number) =>
  api.get<Word[]>(`/api/study/${bookId}`)

export const submitResult = (wordId: number, correct: boolean) =>
  api.post('/api/study/result', { wordId, correct })

export const getStats = () => api.get<StatsResponse>('/api/stats')
