import api from './auth'

export interface QuizQuestion {
  wordId: number
  word: string
  reading: string | null
  language: string
  options: string[]
  correctIndex: number
}

export const getQuizQuestions = (bookId: number) =>
  api.get<QuizQuestion[]>(`/api/quiz/${bookId}`)
