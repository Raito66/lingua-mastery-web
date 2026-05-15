import api from './auth'
import type { Word } from './words'

export interface BookReviewStats {
  bookId: number
  bookName: string
  dueCount: number
  newCount: number
}

export const getReviewStats = () => api.get<BookReviewStats[]>('/api/review/stats')
export const getReviewWords = (bookId: number) => api.get<Word[]>(`/api/review/${bookId}`)
export const submitReview = (wordId: number, correct: boolean) =>
  api.post('/api/review/result', { wordId, correct })
