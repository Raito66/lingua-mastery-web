import { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { getWords, createWord, updateWord, deleteWord, deleteWords, importWords } from '../api/words'
import type { Word, WordRequest, ImportResult } from '../api/words'
import { speak } from '../utils/tts'
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

  const [showImportModal, setShowImportModal] = useState(false)
  const [importFile, setImportFile] = useState<File | null>(null)
  const [importing, setImporting] = useState(false)
  const [importResult, setImportResult] = useState<ImportResult | null>(null)

  const [selectedIds, setSelectedIds] = useState<Set<number>>(new Set())
  const [deleting, setDeleting] = useState(false)

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

  const toggleSelect = (id: number) => {
    setSelectedIds((prev) => {
      const next = new Set(prev)
      next.has(id) ? next.delete(id) : next.add(id)
      return next
    })
  }

  const toggleSelectAll = () => {
    if (selectedIds.size === words.length) {
      setSelectedIds(new Set())
    } else {
      setSelectedIds(new Set(words.map((w) => w.id)))
    }
  }

  const handleDeleteSelected = async () => {
    if (!confirm(`確定刪除選取的 ${selectedIds.size} 個單字？`)) return
    setDeleting(true)
    try {
      await deleteWords(Array.from(selectedIds))
      setSelectedIds(new Set())
      fetchData()
    } finally {
      setDeleting(false)
    }
  }

  const handleImport = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!importFile) return
    setImporting(true)
    setImportResult(null)
    try {
      const res = await importWords(id, importFile)
      setImportResult(res.data)
      if (res.data.success > 0) fetchData()
    } catch (err: unknown) {
      const msg = (err as { response?: { data?: { message?: string } } })?.response?.data?.message
        ?? '上傳失敗，請確認檔案格式'
      setImportResult({ total: 0, success: 0, failed: 1, errors: [msg] })
    } finally {
      setImporting(false)
    }
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
        <div className="flex gap-2 items-center">
          {selectedIds.size > 0 && (
            <button
              onClick={handleDeleteSelected}
              disabled={deleting}
              className="bg-red-500 hover:bg-red-600 text-white text-sm font-medium px-4 py-2 rounded-lg transition disabled:opacity-50"
            >
              {deleting ? '刪除中...' : `刪除已選 (${selectedIds.size})`}
            </button>
          )}
          <button
            onClick={() => { setShowImportModal(true); setImportResult(null); setImportFile(null) }}
            className="border border-gray-300 text-gray-600 text-sm font-medium px-4 py-2 rounded-lg hover:bg-gray-50 transition"
          >
            匯入 CSV
          </button>
          <button
            onClick={openCreate}
            className="bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium px-4 py-2 rounded-lg transition"
          >
            + 新增單字
          </button>
        </div>
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
            <div className="flex items-center gap-2 px-1 pb-1">
              <input
                type="checkbox"
                checked={selectedIds.size === words.length && words.length > 0}
                onChange={toggleSelectAll}
                className="w-4 h-4 accent-blue-600 cursor-pointer"
              />
              <span className="text-sm text-gray-400">
                {selectedIds.size > 0 ? `已選 ${selectedIds.size} / ${words.length}` : '全選'}
              </span>
            </div>
            {words.map((w) => (
              <div
                key={w.id}
                className={`bg-white rounded-xl border px-5 py-4 hover:shadow-sm transition ${selectedIds.has(w.id) ? 'border-blue-300 bg-blue-50' : ''}`}
              >
                <div className="flex justify-between items-start gap-3">
                  <input
                    type="checkbox"
                    checked={selectedIds.has(w.id)}
                    onChange={() => toggleSelect(w.id)}
                    className="mt-1 w-4 h-4 accent-blue-600 cursor-pointer flex-shrink-0"
                  />
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <span className="text-lg font-semibold text-gray-800">{w.word}</span>
                      {w.reading && (
                        <span className="text-sm text-gray-400">{w.reading}</span>
                      )}
                      <button
                        onClick={(e) => { e.stopPropagation(); speak(w.word, book?.language ?? 'ENGLISH') }}
                        className="text-gray-300 hover:text-blue-400 transition text-base leading-none"
                        title="播放發音"
                      >
                        🔊
                      </button>
                    </div>
                    <p className="text-gray-600 mt-0.5">{w.translation}</p>
                    {w.example && (
                      <p className="text-sm text-gray-400 mt-1 italic">{w.example}</p>
                    )}
                    <div className="flex items-center gap-2 mt-2">
                      <span className="text-xs bg-blue-50 text-blue-600 px-2 py-0.5 rounded-full">
                        {levelLabel(w.level)}
                      </span>
                      <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${
                        w.proficiencyLevel === 3 ? 'bg-purple-100 text-purple-700' :
                        w.proficiencyLevel === 2 ? 'bg-green-100 text-green-700' :
                        w.proficiencyLevel === 1 ? 'bg-yellow-100 text-yellow-700' :
                        'bg-gray-100 text-gray-400'
                      }`}>
                        {w.proficiencyLevel === 3 ? '已精通' :
                         w.proficiencyLevel === 2 ? '已熟悉' :
                         w.proficiencyLevel === 1 ? '學習中' : '未學習'}
                      </span>
                    </div>
                  </div>
                  <div className="flex gap-2 ml-2 flex-shrink-0">
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

      {showImportModal && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
          <div className="bg-white rounded-2xl shadow-xl p-6 w-full max-w-md mx-4">
            <h3 className="text-lg font-semibold text-gray-800 mb-1">匯入 CSV</h3>
            <p className="text-xs text-gray-400 mb-1">
              格式：<code className="bg-gray-100 px-1 rounded">word,reading,translation,example,level</code>
              （第一列為表頭，reading / example / level 可留空）
            </p>
            <p className="text-xs text-gray-400 mb-1">
              {book?.language === 'JAPANESE'
                ? 'level 可填：JLPT_N5 / JLPT_N4 / JLPT_N3 / JLPT_N2 / JLPT_N1'
                : 'level 可填：TOEIC_300 / TOEIC_300_500 / TOEIC_500_700 / TOEIC_700_900 / TOEIC_900PLUS'}
              {' '}｜{' '}
              <a
                href={`${import.meta.env.VITE_API_URL}/sample-words-${book?.language === 'JAPANESE' ? 'japanese' : 'english'}.csv`}
                download={`sample-words-${book?.language === 'JAPANESE' ? 'japanese' : 'english'}.csv`}
                className="text-blue-500 underline hover:text-blue-700"
              >
                下載範例檔
              </a>
            </p>
            <p className="text-xs text-gray-400 mb-4">
              最多 500 筆 · 檔案上限 5MB · 支援 UTF-8 及 Shift-JIS（日文 Windows Excel）
            </p>

            <form onSubmit={handleImport} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">選擇 CSV 檔案</label>
                <input
                  type="file"
                  accept=".csv"
                  onChange={(e) => setImportFile(e.target.files?.[0] ?? null)}
                  className="w-full text-sm text-gray-600 file:mr-3 file:py-1.5 file:px-3 file:rounded-lg file:border-0 file:text-sm file:font-medium file:bg-blue-50 file:text-blue-600 hover:file:bg-blue-100"
                />
              </div>

              {importResult && (
                <div className={`rounded-lg p-3 text-sm ${importResult.failed === 0 ? 'bg-green-50 text-green-700' : 'bg-yellow-50 text-yellow-700'}`}>
                  <p className="font-medium">
                    成功匯入 {importResult.success} 個，失敗 {importResult.failed} 個
                  </p>
                  {importResult.errors.length > 0 && (
                    <ul className="mt-1 list-disc list-inside text-xs space-y-0.5">
                      {importResult.errors.map((e, i) => <li key={i}>{e}</li>)}
                    </ul>
                  )}
                </div>
              )}

              <div className="flex gap-2 pt-1">
                <button
                  type="button"
                  onClick={() => setShowImportModal(false)}
                  className="flex-1 border border-gray-300 text-gray-600 text-sm font-medium py-2 rounded-lg hover:bg-gray-50 transition"
                >
                  關閉
                </button>
                <button
                  type="submit"
                  disabled={!importFile || importing}
                  className="flex-1 bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium py-2 rounded-lg transition disabled:opacity-50"
                >
                  {importing ? '匯入中...' : '開始匯入'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

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
