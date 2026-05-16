import { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { getStudyWords, submitResult } from '../api/study'
import { getBooks } from '../api/books'
import type { Word } from '../api/words'
import type { WordBook } from '../api/books'
import { speak } from '../utils/tts'

type Phase = 'loading' | 'question' | 'answer' | 'result'

export default function StudyPage() {
  const { bookId } = useParams<{ bookId: string }>()
  const navigate = useNavigate()
  const id = Number(bookId)

  const [book, setBook] = useState<WordBook | null>(null)
  const [words, setWords] = useState<Word[]>([])
  const [index, setIndex] = useState(0)
  const [phase, setPhase] = useState<Phase>('loading')
  const [correct, setCorrect] = useState(0)
  const [wrong, setWrong] = useState(0)

  useEffect(() => {
    const load = async () => {
      try {
        const [booksRes, wordsRes] = await Promise.all([getBooks(), getStudyWords(id)])
        const found = booksRes.data.find((b) => b.id === id)
        if (!found) { navigate('/books'); return }
        if (wordsRes.data.length === 0) { navigate(`/books/${id}/words`); return }
        setBook(found)
        setWords(wordsRes.data)
        setPhase('question')
      } catch {
        navigate('/books')
      }
    }
    load()
  }, [id])

  const currentWord = words[index]
  const total = words.length

  // 每次進入 question 階段自動朗讀
  useEffect(() => {
    if (phase === 'question' && currentWord && book) {
      speak(currentWord.word, book.language)
    }
  }, [index, phase])

  const handleReveal = () => setPhase('answer')

  const handleAnswer = async (isCorrect: boolean) => {
    await submitResult(currentWord.id, isCorrect)
    if (isCorrect) setCorrect((c) => c + 1)
    else setWrong((w) => w + 1)

    if (index + 1 >= total) {
      setPhase('result')
    } else {
      setIndex((i) => i + 1)
      setPhase('question')
    }
  }

  if (phase === 'loading') {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <p className="text-gray-400">載入中...</p>
      </div>
    )
  }

  if (phase === 'result') {
    const accuracy = total > 0 ? Math.round((correct / total) * 100) : 0
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="bg-white rounded-2xl shadow-md p-8 w-full max-w-sm mx-4 text-center">
          <p className="text-4xl mb-4">
            {accuracy >= 80 ? '🎉' : accuracy >= 50 ? '💪' : '📖'}
          </p>
          <h2 className="text-xl font-bold text-gray-800 mb-6">本次測驗結果</h2>

          <div className="grid grid-cols-3 gap-4 mb-6">
            <div className="bg-gray-50 rounded-xl p-3">
              <p className="text-2xl font-bold text-gray-800">{total}</p>
              <p className="text-xs text-gray-400 mt-1">總題數</p>
            </div>
            <div className="bg-green-50 rounded-xl p-3">
              <p className="text-2xl font-bold text-green-600">{correct}</p>
              <p className="text-xs text-gray-400 mt-1">答對</p>
            </div>
            <div className="bg-red-50 rounded-xl p-3">
              <p className="text-2xl font-bold text-red-400">{wrong}</p>
              <p className="text-xs text-gray-400 mt-1">答錯</p>
            </div>
          </div>

          <p className="text-3xl font-bold text-blue-600 mb-1">{accuracy}%</p>
          <p className="text-sm text-gray-400 mb-6">正確率</p>

          <div className="flex gap-2">
            <button
              onClick={() => navigate('/books')}
              className="flex-1 border border-gray-300 text-gray-600 text-sm font-medium py-2 rounded-lg hover:bg-gray-50 transition"
            >
              回單字本
            </button>
            <button
              onClick={() => {
                setIndex(0)
                setCorrect(0)
                setWrong(0)
                setPhase('loading')
                getStudyWords(id).then((res) => {
                  setWords(res.data)
                  setPhase('question')
                })
              }}
              className="flex-1 bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium py-2 rounded-lg transition"
            >
              再來一次
            </button>
          </div>
        </div>
      </div>
    )
  }

  if (!currentWord) return null

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white border-b px-6 py-4 flex justify-between items-center">
        <button onClick={() => navigate('/books')} className="text-gray-400 hover:text-gray-600 text-sm">
          ← 離開
        </button>
        <p className="text-sm text-gray-500">{book?.name}</p>
        <p className="text-sm text-gray-400">{index + 1} / {total}</p>
      </header>

      {/* 進度條 */}
      <div className="bg-gray-200 h-1">
        <div
          className="bg-blue-500 h-1 transition-all"
          style={{ width: `${((index) / total) * 100}%` }}
        />
      </div>

      <main className="max-w-sm mx-auto px-4 py-12 flex flex-col items-center">
        {/* 單字卡 */}
        <div className="bg-white rounded-2xl shadow-md w-full p-8 text-center mb-6 min-h-52 flex flex-col items-center justify-center">
          <p className="text-3xl font-bold text-gray-800 mb-2">{currentWord.word}</p>
          {currentWord.reading && (
            <p className="text-lg text-gray-400 mb-2">{currentWord.reading}</p>
          )}
          <button
            onClick={() => speak(currentWord.word, book?.language ?? 'ENGLISH')}
            className="mt-1 text-gray-300 hover:text-blue-400 transition text-xl"
            title="播放發音"
          >
            🔊
          </button>

          {phase === 'answer' && (
            <div className="mt-4 pt-4 border-t w-full">
              <p className="text-xl text-gray-700 font-medium">{currentWord.translation}</p>
              {currentWord.example && (
                <p className="text-sm text-gray-400 mt-2 italic">{currentWord.example}</p>
              )}
            </div>
          )}
        </div>

        {phase === 'question' ? (
          <button
            onClick={handleReveal}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-3 rounded-xl text-sm transition"
          >
            顯示答案
          </button>
        ) : (
          <div className="flex gap-3 w-full">
            <button
              onClick={() => handleAnswer(false)}
              className="flex-1 bg-red-50 hover:bg-red-100 text-red-500 font-medium py-3 rounded-xl text-sm transition border border-red-200"
            >
              ✗ 不會
            </button>
            <button
              onClick={() => handleAnswer(true)}
              className="flex-1 bg-green-50 hover:bg-green-100 text-green-600 font-medium py-3 rounded-xl text-sm transition border border-green-200"
            >
              ✓ 會了
            </button>
          </div>
        )}
      </main>
    </div>
  )
}
