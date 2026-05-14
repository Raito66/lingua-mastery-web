import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { getStats } from '../api/study'
import type { StatsResponse } from '../api/study'

export default function StatsPage() {
  const navigate = useNavigate()
  const email = localStorage.getItem('email')

  const [stats, setStats] = useState<StatsResponse | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    getStats()
      .then((res) => setStats(res.data))
      .catch(() => navigate('/books'))
      .finally(() => setLoading(false))
  }, [])

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white border-b px-6 py-4 flex justify-between items-center">
        <div className="flex items-center gap-3">
          <button onClick={() => navigate('/books')} className="text-gray-400 hover:text-gray-600 text-sm">
            ← 返回
          </button>
          <h1 className="text-xl font-bold text-gray-800">學習統計</h1>
        </div>
        <span className="text-sm text-gray-400">{email}</span>
      </header>

      <main className="max-w-sm mx-auto px-4 py-10">
        {loading ? (
          <p className="text-center text-gray-400 mt-20">載入中...</p>
        ) : !stats ? null : (
          <>
            {/* 正確率圓圈 */}
            <div className="bg-white rounded-2xl shadow-sm p-8 text-center mb-4">
              <p className="text-6xl font-bold text-blue-600">{stats.accuracy}%</p>
              <p className="text-gray-400 mt-2 text-sm">整體正確率</p>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="bg-white rounded-2xl shadow-sm p-6 text-center">
                <p className="text-3xl font-bold text-gray-800">{stats.totalStudied}</p>
                <p className="text-sm text-gray-400 mt-1">總學習次數</p>
              </div>
              <div className="bg-white rounded-2xl shadow-sm p-6 text-center">
                <p className="text-3xl font-bold text-green-500">{stats.totalCorrect}</p>
                <p className="text-sm text-gray-400 mt-1">答對次數</p>
              </div>
            </div>

            {stats.totalStudied === 0 && (
              <p className="text-center text-gray-400 mt-8 text-sm">
                還沒有學習紀錄，快去測驗吧！
              </p>
            )}
          </>
        )}
      </main>
    </div>
  )
}
