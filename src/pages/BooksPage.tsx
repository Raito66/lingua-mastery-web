import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { getBooks, createBook, updateBook, deleteBook } from '../api/books'
import { getReviewStats } from '../api/review'
import { getStreak } from '../api/stats'
import type { WordBook } from '../api/books'
import type { BookReviewStats } from '../api/review'
import type { StreakResponse } from '../api/stats'

export default function BooksPage() {
  const navigate = useNavigate()
  const email = localStorage.getItem('email')

  const [books, setBooks] = useState<WordBook[]>([])
  const [loading, setLoading] = useState(true)
  const [showModal, setShowModal] = useState(false)
  const [newName, setNewName] = useState('')
  const [newLanguage, setNewLanguage] = useState<'JAPANESE' | 'ENGLISH'>('JAPANESE')
  const [creating, setCreating] = useState(false)
  const [editingBook, setEditingBook] = useState<WordBook | null>(null)
  const [editName, setEditName] = useState('')
  const [editLanguage, setEditLanguage] = useState<'JAPANESE' | 'ENGLISH'>('JAPANESE')
  const [saving, setSaving] = useState(false)
  const [reviewStats, setReviewStats] = useState<BookReviewStats[]>([])
  const [streak, setStreak] = useState<StreakResponse>({ streak: 0, todayCount: 0 })

  const fetchBooks = async () => {
    try {
      const [booksRes, statsRes, streakRes] = await Promise.all([getBooks(), getReviewStats(), getStreak()])
      setBooks(booksRes.data)
      setReviewStats(statsRes.data)
      setStreak(streakRes.data)
    } catch {
      localStorage.clear()
      navigate('/login')
    } finally {
      setLoading(false)
    }
  }

  const getReviewCount = (bookId: number) => {
    const s = reviewStats.find((r) => r.bookId === bookId)
    return s ? s.dueCount + s.newCount : 0
  }

  useEffect(() => {
    fetchBooks()
  }, [])

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!newName.trim()) return
    setCreating(true)
    try {
      await createBook(newName.trim(), newLanguage)
      setNewName('')
      setNewLanguage('JAPANESE')
      setShowModal(false)
      fetchBooks()
    } finally {
      setCreating(false)
    }
  }

  const handleEdit = (book: WordBook) => {
    setEditingBook(book)
    setEditName(book.name)
    setEditLanguage(book.language)
  }

  const handleSaveEdit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!editingBook || !editName.trim()) return
    setSaving(true)
    try {
      await updateBook(editingBook.id, editName.trim(), editLanguage)
      setEditingBook(null)
      fetchBooks()
    } catch {
      alert('儲存失敗，請稍後再試')
    } finally {
      setSaving(false)
    }
  }

  const handleDelete = async (id: number, name: string) => {
    if (!confirm(`確定刪除「${name}」？`)) return
    await deleteBook(id)
    setBooks((prev) => prev.filter((b) => b.id !== id))
  }

  const handleLogout = () => {
    localStorage.clear()
    navigate('/login')
  }

  const languageLabel = (lang: string) =>
    lang === 'JAPANESE' ? '🇯🇵 日文' : '🇺🇸 英文'

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white border-b px-6 py-4 flex justify-between items-center">
        <h1 className="text-xl font-bold text-gray-800">LinguaMastery</h1>
        <div className="flex items-center gap-4">
          <button onClick={() => navigate('/stats')} className="text-sm text-gray-500 hover:underline">
            統計
          </button>
          <span className="text-sm text-gray-400">{email}</span>
          <button onClick={handleLogout} className="text-sm text-red-500 hover:underline">
            登出
          </button>
        </div>
      </header>

      <main className="max-w-2xl mx-auto px-4 py-8">
        <div className="flex items-center gap-4 mb-6 bg-white rounded-xl border px-5 py-3">
          <div className="flex items-center gap-2">
            <span className="text-2xl">🔥</span>
            <div>
              <p className="text-lg font-bold text-gray-800 leading-none">{streak.streak}</p>
              <p className="text-xs text-gray-400">連續天數</p>
            </div>
          </div>
          <div className="w-px h-8 bg-gray-100" />
          <div>
            <p className="text-lg font-bold text-gray-800 leading-none">{streak.todayCount}</p>
            <p className="text-xs text-gray-400">今日練習</p>
          </div>
          {streak.streak === 0 && streak.todayCount === 0 && (
            <p className="text-sm text-gray-400 ml-auto">今天還沒練習，加油！</p>
          )}
          {streak.todayCount > 0 && (
            <p className="text-sm text-green-500 ml-auto">今天已練習 ✓</p>
          )}
        </div>

        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-semibold text-gray-800">我的單字本</h2>
          <button
            onClick={() => setShowModal(true)}
            className="bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium px-4 py-2 rounded-lg transition"
          >
            + 新增單字本
          </button>
        </div>

        {loading ? (
          <p className="text-center text-gray-400 mt-20">載入中...</p>
        ) : books.length === 0 ? (
          <div className="text-center mt-20 text-gray-400">
            <p className="text-4xl mb-3">📚</p>
            <p>還沒有單字本，新增一個吧！</p>
          </div>
        ) : (
          <div className="space-y-3">
            {books.map((book) => (
              <div
                key={book.id}
                className="bg-white rounded-xl border px-5 py-4 flex justify-between items-center hover:shadow-sm transition"
              >
                <div>
                  <p className="font-medium text-gray-800">{book.name}</p>
                  <p className="text-sm text-gray-400 mt-0.5">
                    {languageLabel(book.language)} · {book.wordCount} 個單字
                  </p>
                </div>
                <div className="flex gap-2 items-center">
                  <button
                    onClick={() => navigate(`/books/${book.id}/study`)}
                    className="text-sm text-green-600 hover:underline"
                  >
                    閃卡
                  </button>
                  <button
                    onClick={() => navigate(`/books/${book.id}/quiz`)}
                    className="text-sm text-orange-500 hover:underline"
                  >
                    選擇題
                  </button>
                  <button
                    onClick={() => navigate(`/books/${book.id}/review`)}
                    className="text-sm text-purple-600 hover:underline flex items-center gap-1"
                  >
                    複習
                    {getReviewCount(book.id) > 0 && (
                      <span className="bg-purple-100 text-purple-700 text-xs font-bold px-1.5 py-0.5 rounded-full">
                        {getReviewCount(book.id)}
                      </span>
                    )}
                  </button>
                  <button
                    onClick={() => navigate(`/books/${book.id}/words`)}
                    className="text-sm text-blue-600 hover:underline"
                  >
                    單字
                  </button>
                  <button
                    onClick={() => handleEdit(book)}
                    className="text-sm text-gray-500 hover:underline"
                  >
                    編輯
                  </button>
                  <button
                    onClick={() => handleDelete(book.id, book.name)}
                    className="text-sm text-red-400 hover:underline"
                  >
                    刪除
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>

      {editingBook && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
          <div className="bg-white rounded-2xl shadow-xl p-6 w-full max-w-sm mx-4">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">編輯單字本</h3>
            <form onSubmit={handleSaveEdit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">名稱</label>
                <input
                  type="text"
                  value={editName}
                  onChange={(e) => setEditName(e.target.value)}
                  required
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">語言</label>
                <select
                  value={editLanguage}
                  onChange={(e) => setEditLanguage(e.target.value as 'JAPANESE' | 'ENGLISH')}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="JAPANESE">🇯🇵 日文</option>
                  <option value="ENGLISH">🇺🇸 英文</option>
                </select>
              </div>
              <div className="flex gap-2 pt-1">
                <button
                  type="button"
                  onClick={() => setEditingBook(null)}
                  className="flex-1 border border-gray-300 text-gray-600 text-sm font-medium py-2 rounded-lg hover:bg-gray-50 transition"
                >
                  取消
                </button>
                <button
                  type="submit"
                  disabled={saving}
                  className="flex-1 bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium py-2 rounded-lg transition disabled:opacity-50"
                >
                  {saving ? '儲存中...' : '儲存'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {showModal && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
          <div className="bg-white rounded-2xl shadow-xl p-6 w-full max-w-sm mx-4">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">新增單字本</h3>
            <form onSubmit={handleCreate} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">名稱</label>
                <input
                  type="text"
                  value={newName}
                  onChange={(e) => setNewName(e.target.value)}
                  required
                  placeholder="例如：JLPT N1、多益必考"
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">語言</label>
                <select
                  value={newLanguage}
                  onChange={(e) => setNewLanguage(e.target.value as 'JAPANESE' | 'ENGLISH')}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="JAPANESE">🇯🇵 日文</option>
                  <option value="ENGLISH">🇺🇸 英文</option>
                </select>
              </div>
              <div className="flex gap-2 pt-1">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="flex-1 border border-gray-300 text-gray-600 text-sm font-medium py-2 rounded-lg hover:bg-gray-50 transition"
                >
                  取消
                </button>
                <button
                  type="submit"
                  disabled={creating}
                  className="flex-1 bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium py-2 rounded-lg transition disabled:opacity-50"
                >
                  {creating ? '新增中...' : '新增'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}
