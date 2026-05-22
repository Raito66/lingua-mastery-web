import { useState } from 'react'
import { useSearchParams, useNavigate, Link } from 'react-router-dom'
import { resetPassword } from '../api/auth'

export default function ResetPasswordPage() {
  const [searchParams] = useSearchParams()
  const navigate = useNavigate()
  const token = searchParams.get('token') ?? ''

  const [password, setPassword] = useState('')
  const [confirm, setConfirm] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!/^(?=.*[A-Za-z])(?=.*\d).{8,}$/.test(password)) {
      setError('密碼至少 8 碼，須包含英文字母與數字')
      return
    }
    if (password !== confirm) {
      setError('兩次密碼不一致')
      return
    }
    setError('')
    setLoading(true)
    try {
      await resetPassword(token, password)
      navigate('/login', { state: { message: '密碼重設成功，請重新登入' } })
    } catch (err: any) {
      setError(err.response?.data?.message ?? '重設失敗，連結可能已過期')
    } finally {
      setLoading(false)
    }
  }

  if (!token) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="bg-white p-8 rounded-2xl shadow-md w-full max-w-sm text-center">
          <p className="text-4xl mb-4">⚠️</p>
          <p className="text-gray-500 text-sm mb-4">無效的重設連結</p>
          <Link to="/forgot-password" className="text-blue-600 text-sm hover:underline">重新申請</Link>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center">
      <div className="bg-white p-8 rounded-2xl shadow-md w-full max-w-sm">
        <h1 className="text-xl font-bold text-gray-800 mb-1">設定新密碼</h1>
        <p className="text-gray-500 text-sm mb-6">請輸入您的新密碼</p>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">新密碼</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="至少 8 碼，含英文與數字"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">確認新密碼</label>
            <input
              type="password"
              value={confirm}
              onChange={(e) => setConfirm(e.target.value)}
              required
              className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="再次輸入新密碼"
            />
          </div>

          {error && <p className="text-red-500 text-sm">{error}</p>}

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 rounded-lg text-sm transition disabled:opacity-50"
          >
            {loading ? '設定中...' : '確認設定'}
          </button>
        </form>
      </div>
    </div>
  )
}
