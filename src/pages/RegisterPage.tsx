import { useState } from 'react'
import { Link } from 'react-router-dom'
import { register } from '../api/auth'

export default function RegisterPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const [done, setDone] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setLoading(true)
    try {
      await register(email, password)
      setDone(true)
    } catch (err: any) {
      setError(err.response?.data?.message ?? '註冊失敗，請再試一次')
    } finally {
      setLoading(false)
    }
  }

  if (done) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="bg-white p-8 rounded-2xl shadow-md w-full max-w-sm text-center">
          <p className="text-4xl mb-4">📬</p>
          <h2 className="text-xl font-bold text-gray-800 mb-2">驗證信已寄出！</h2>
          <p className="text-gray-500 text-sm mb-1">請查收 <span className="font-medium text-gray-700">{email}</span> 的收件匣</p>
          <p className="text-gray-400 text-xs mb-6">點擊信中的連結完成驗證後，即可登入</p>
          <Link to="/login" className="text-blue-600 text-sm hover:underline">前往登入 →</Link>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center">
      <div className="bg-white p-8 rounded-2xl shadow-md w-full max-w-sm">
        <h1 className="text-2xl font-bold text-center text-gray-800 mb-2">LinguaMastery</h1>
        <p className="text-center text-gray-500 text-sm mb-6">建立帳號</p>

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

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">密碼</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              minLength={6}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="至少 6 個字元"
            />
          </div>

          {error && <p className="text-red-500 text-sm">{error}</p>}

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 rounded-lg text-sm transition disabled:opacity-50"
          >
            {loading ? '註冊中...' : '建立帳號'}
          </button>
        </form>

        <p className="text-center text-sm text-gray-500 mt-4">
          已有帳號？{' '}
          <Link to="/login" className="text-blue-600 hover:underline">登入</Link>
        </p>
      </div>
    </div>
  )
}
