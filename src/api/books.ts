import api from './auth'

export interface WordBook {
  id: number
  name: string
  language: 'JAPANESE' | 'ENGLISH'
  wordCount: number
  createdAt: string
}

export const getBooks = () => api.get<WordBook[]>('/api/books')

export const createBook = (name: string, language: 'JAPANESE' | 'ENGLISH') =>
  api.post<WordBook>('/api/books', { name, language })

export const updateBook = (id: number, name: string, language: 'JAPANESE' | 'ENGLISH') =>
  api.put<WordBook>(`/api/books/${id}`, { name, language })

export const deleteBook = (id: number) => api.delete(`/api/books/${id}`)
