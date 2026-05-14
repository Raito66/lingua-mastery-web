import { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { getWords, createWord, updateWord, deleteWord } from '../api/words'
import type { Word, WordRequest } from '../api/words'
import { getBooks } from '../api/books'
import type { WordBook } from '../api/books'

const JAPANESE_LEVELS = ['JLPT_N5', 'JLPT_N4', 'JLPT_N3', 'JLPT_N2', 'JLPT_N1']
const ENGLISH_LEVELS = ['TOEIC_300', 'TOEIC_300_500', 'TOEIC_500_700', 'TOEIC_700_900', 'TOEIC_900PLUS']

const levelLabel = (level: string) =>
  level.replace('JLPT_', 'JLPT ').replace('TOEIC_', 'TOEIC ').replace('900PLUS', '900+').replace('_', '~')

const emptyForm = (language: 'JAPANESE' | 'ENGLISH'): WordRequest => ({
  word: '',
  reading: '',
  translation: '',
  example: '',
  level: language === 'JAPANESE' ? 'JLPT_N5' : 'TOEIC_300',
  language,
})

export default function WordsPage() {
  const { bookId } = useParams<{ bookId: string }>()
  const navigate = useNavigate()

  const [book, setBook] = useState<WordBook | null>(null)
  const [words, setWords] = useState<Word[]>([])
  const [loading, setLoading] = useState(true)
  const [showModal, setShowModal] = useState(false)
  const [editWord, setEditWord] = useState<Word | null>(null)
  const [form, setForm] = useState<WordRequest>(emptyForm('JAPANESE'))
  const [saving, setSaving] = useState(false)

  const id = Number(bookId)

  const fetchData = async () => {
    try {
      const [booksRes, wordsRes] = await Promise.all([getBooks(), getWords(id)])
      const found = booksRes.data.find((b) => b.id === id)
      if (!found) { navigate('/books'); return }
      setBook(found)
      setWords(wordsRes.data)
      setForm(emptyForm(found.language))
    } catch {
      navigate('/books')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { fetchData() }, [id])

  const openCreate = () => {
    setEditWord(null)
    setForm(emptyForm(book?.language ?? 'JAPANESE'))
    setShowModal(true)
  }

  const openEdit = (word: Word) => {
    setEditWord(word)
    setForm({
      word: word.word,
      reading: word.reading ?? '',
      translation: word.translation,
      example: word.example ?? '',
      level: word.level,
      language: word.language,
    })
    setShowModal(true)
  }

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault()
    setSaving(true)
    try {
      if (editWord) {
        await updateWord(editWord.id, form)
      } else {
        await createWord(id, form)
      }
      setShowModal(false)
      fetchData()
    } finally {
      setSaving(false)
    }
  }

  const handleDelete = async (word: Word) => {
    if (!confirm(`確定刪除「${word.word}」？`)) return
    await deleteWord(word.id)
    setWords((prev) => prev.filter((w) => w.id !== word.id))
  }

  const levels = book?.language === 'JAPANESE' ? JAPANESE_LEVELS : ENGLISH_LEVELS

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white border-b px-6 py-4 flex justify-between items-center">
        <div className="flex items-center gap-3">
          <button onClick={() => navigate('/books')} className="text-gray-400 hover:text-gray-600 text-sm">
            ← 返回
          </button>
          <h1 className="text-xl font-bold text-gray-800">{book?.name ?? '...'}</h1>
        </div>
        <button
          onClick={openCreate}
          className="bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium px-4 py-2 rounded-lg transition"
        >
          + 新增單字
        </button>
      </header>

      <main className="max-w-2xl mx-auto px-4 py-8">
        {loading ? (
          <p className="text-center text-gray-400 mt-20">載入中...</p>
        ) : words.length === 0 ? (
          <div className="text-center mt-20 text-gray-400">
            <p className="text-4xl mb-3">✏️</p>
            <p>還沒有單字，新增第一個吧！</p>
          </div>
        ) : (
          <div className="space-y-3">
            {words.map((w) => (
              <div key={w.id} className="bg-white rounded-xl border px-5 py-4 hover:shadow-sm transition">
                <div className="flex justify-between items-start">
                  <div className="flex-1">
                    <div className="flex items-baseline gap-2">
                      <span className="text-lg font-semibold text-gray-800">{w.word}</span>
                      {w.reading && (
                        <span className="text-sm text-gray-400">{w.reading}</span>
                      )}
                    </div>
                    <p className="text-gray-600 mt-0.5">{w.translation}</p>
                    {w.example && (
                      <p className="text-sm text-gray-400 mt-1 italic">{w.example}</p>
                    )}
                    <span className="inline-block mt-2 text-xs bg-blue-50 text-blue-600 px-2 py-0.5 rounded-full">
                      {levelLabel(w.level)}
                    </span>
                  </div>
                  <div className="flex gap-2 ml-4">
                    <button onClick={() => openEdit(w)} className="text-sm text-gray-500 hover:underline">
                      編輯
                    </button>
                    <button onClick={() => handleDelete(w)} className="text-sm text-red-400 hover:underline">
                      刪除
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>

      {showModal && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
          <div className="bg-white rounded-2xl shadow-xl p-6 w-full max-w-sm mx-4 max-h-[90vh] overflow-y-auto">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">
              {editWord ? '編輯單字' : '新增單字'}
            </h3>
            <form onSubmit={handleSave} className="space-y-3">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">單字</label>
                <input
                  type="text"
                  value={form.word}
                  onChange={(e) => setForm({ ...form, word: e.target.value })}
                  required
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              {book?.language === 'JAPANESE' && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">假名</label>
                  <input
                    type="text"
                    value={form.reading}
                    onChange={(e) => setForm({ ...form, reading: e.target.value })}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="例：べんきょう"
                  />
                </div>
              )}

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">中文翻譯</label>
                <input
                  type="text"
                  value={form.translation}
                  onChange={(e) => setForm({ ...form, translation: e.target.value })}
                  required
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">例句（選填）</label>
                <input
                  type="text"
                  value={form.example}
                  onChange={(e) => setForm({ ...form, example: e.target.value })}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">等級</label>
                <select
                  value={form.level}
                  onChange={(e) => setForm({ ...form, level: e.target.value })}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  {levels.map((l) => (
                    <option key={l} value={l}>{levelLabel(l)}</option>
                  ))}
                </select>
              </div>

              <div className="flex gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
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
    </div>
  )
}
