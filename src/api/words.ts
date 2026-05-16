import api from './auth'

export interface Word {
  id: number
  word: string
  reading: string
  translation: string
  example: string
  level: string
  language: 'JAPANESE' | 'ENGLISH'
  createdAt: string
}

export interface WordRequest {
  word: string
  reading: string
  translation: string
  example: string
  level: string
  language: 'JAPANESE' | 'ENGLISH'
}

export const getWords = (bookId: number) =>
  api.get<Word[]>(`/api/books/${bookId}/words`)

export const createWord = (bookId: number, data: WordRequest) =>
  api.post<Word>(`/api/books/${bookId}/words`, data)

export const updateWord = (wordId: number, data: WordRequest) =>
  api.put<Word>(`/api/words/${wordId}`, data)

export const deleteWord = (wordId: number) =>
  api.delete(`/api/words/${wordId}`)

export interface ImportResult {
  total: number
  success: number
  failed: number
  errors: string[]
}

export const importWords = (bookId: number, file: File) => {
  const formData = new FormData()
  formData.append('file', file)
  return api.post<ImportResult>(`/api/books/${bookId}/words/import`, formData)
}
