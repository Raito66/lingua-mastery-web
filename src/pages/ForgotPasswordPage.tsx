import { useState } from 'react'
import { Link } from 'react-router-dom'
import { forgotPassword } from '../api/auth'

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState('')
  const [loading, setLoading] = useState(false)
  const [done, setDone] = useState(false)
  const [error, setError] = useState('')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setLoading(true)
    try {
      await forgotPassword(email)
      setDone(true)
    } catch {
      setError('發生錯誤，請稍後再試')
    } finally {
      setLoading(false)
    }
  }

  if (done) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="bg-white p-8 rounded-2xl shadow-md w-full max-w-sm text-center">
          <p className="text-4xl mb-4">📨</p>
          <h2 className="text-xl font-bold text-gray-800 mb-2">重設密碼信已寄出</h2>
          <p className="text-gray-500 text-sm mb-1">若 <span className="font-medium text-gray-700">{email}</span> 已完成註冊</p>
          <p className="text-gray-400 text-xs mb-6">連結將在 15 分鐘後失效</p>
          <Link to="/login" className="text-blue-600 text-sm hover:underline">← 回到登入</Link>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center">
      <div className="bg-white p-8 rounded-2xl shadow-md w-full max-w-sm">
        <h1 className="text-xl font-bold text-gray-800 mb-1">忘記密碼</h1>
        <p className="text-gray-500 text-sm mb-6">輸入您的 Email，我們將寄送重設密碼連結</p>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="your@email.com"
            />
          </div>

          {error && <p className="text-red-500 text-sm">{error}</p>}

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 rounded-lg text-sm transition disabled:opacity-50"
          >
            {loading ? '寄送中...' : '寄送重設連結'}
          </button>
        </form>

        <p className="text-center text-sm text-gray-400 mt-4">
          <Link to="/login" className="hover:underline">← 回到登入</Link>
        </p>
      </div>
    </div>
  )
}
