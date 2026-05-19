import { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { getQuizQuestions, type QuizQuestion } from '../api/quiz'
import { submitResult } from '../api/study'
import { getBooks } from '../api/books'
import type { WordBook } from '../api/books'
import { speak } from '../utils/tts'

type Phase = 'loading' | 'question' | 'answered' | 'result'

export default function QuizPage() {
  const { bookId } = useParams<{ bookId: string }>()
  const navigate = useNavigate()
  const id = Number(bookId)

  const [book, setBook] = useState<WordBook | null>(null)
  const [questions, setQuestions] = useState<QuizQuestion[]>([])
  const [index, setIndex] = useState(0)
  const [phase, setPhase] = useState<Phase>('loading')
  const [selected, setSelected] = useState<number | null>(null)
  const [correct, setCorrect] = useState(0)
  const [wrong, setWrong] = useState(0)

  const loadQuiz = async () => {
    try {
      const [booksRes, quizRes] = await Promise.all([getBooks(), getQuizQuestions(id)])
      const found = booksRes.data.find((b) => b.id === id)
      if (!found) { navigate('/books'); return }
      if (quizRes.data.length === 0) { navigate(`/books/${id}/words`); return }
      setBook(found)
      setQuestions(quizRes.data)
      setIndex(0)
      setCorrect(0)
      setWrong(0)
      setSelected(null)
      setPhase('question')
    } catch {
      navigate('/books')
    }
  }

  useEffect(() => { loadQuiz() }, [id])

  const currentQ = questions[index]
  const total = questions.length

  useEffect(() => {
    if (phase === 'question' && currentQ && book) {
      speak(currentQ.word, book.language)
    }
  }, [index, phase])

  const handleSelect = async (optionIndex: number) => {
    if (phase !== 'question') return
    setSelected(optionIndex)
    setPhase('answered')

    const isCorrect = optionIndex === currentQ.correctIndex
    await submitResult(currentQ.wordId, isCorrect)
    if (isCorrect) setCorrect((c) => c + 1)
    else setWrong((w) => w + 1)
  }

  const handleNext = () => {
    if (index + 1 >= total) {
      setPhase('result')
    } else {
      setIndex((i) => i + 1)
      setSelected(null)
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
              onClick={loadQuiz}
              className="flex-1 bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium py-2 rounded-lg transition"
            >
              再來一次
            </button>
          </div>
        </div>
      </div>
    )
  }

  if (!currentQ) return null

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white border-b px-6 py-4 flex justify-between items-center">
        <button onClick={() => navigate('/books')} className="text-gray-400 hover:text-gray-600 text-sm">
          ← 離開
        </button>
        <p className="text-sm text-gray-500">{book?.name}</p>
        <p className="text-sm text-gray-400">{index + 1} / {total}</p>
      </header>

      <div className="bg-gray-200 h-1">
        <div
          className="bg-blue-500 h-1 transition-all"
          style={{ width: `${(index / total) * 100}%` }}
        />
      </div>

      <main className="max-w-sm mx-auto px-4 py-8">
        {/* 單字卡 */}
        <div className="bg-white rounded-2xl shadow-md w-full p-8 text-center mb-6">
          <p className="text-3xl font-bold text-gray-800 mb-2">{currentQ.word}</p>
          {currentQ.reading && (
            <p className="text-lg text-gray-400 mb-2">{currentQ.reading}</p>
          )}
          <button
            onClick={() => speak(currentQ.word, book?.language ?? 'ENGLISH')}
            className="text-gray-300 hover:text-blue-400 transition text-xl"
            title="播放發音"
          >
            🔊
          </button>
        </div>

        {/* 4 個選項 */}
        <div className="space-y-3">
          {currentQ.options.map((option, i) => {
            let style = 'bg-white border border-gray-200 text-gray-700 hover:bg-gray-50'
            let icon = ''
            if (phase === 'answered') {
              if (i === currentQ.correctIndex) {
                style = 'bg-green-100 border-2 border-green-500 text-green-800 font-semibold'
                icon = '✓'
              } else if (i === selected) {
                style = 'bg-red-100 border-2 border-red-500 text-red-700 font-semibold'
                icon = '✗'
              } else {
                style = 'bg-gray-50 border border-gray-200 text-gray-300'
              }
            }
            return (
              <button
                key={i}
                onClick={() => handleSelect(i)}
                disabled={phase === 'answered'}
                className={`w-full flex justify-between items-center px-4 py-3 rounded-xl text-sm font-medium transition ${style}`}
              >
                <span>{option}</span>
                {icon && <span className="text-base">{icon}</span>}
              </button>
            )
          })}
        </div>

        {phase === 'answered' && (
          <button
            onClick={handleNext}
            className="w-full mt-4 bg-blue-600 hover:bg-blue-700 text-white font-medium py-3 rounded-xl text-sm transition"
          >
            {index + 1 >= total ? '查看結果' : '下一題 →'}
          </button>
        )}
      </main>
    </div>
  )
}
