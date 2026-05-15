import { useState } from 'react'
import { useNavigate, Link, useLocation } from 'react-router-dom'
import { login, resendVerification } from '../api/auth'

export default function LoginPage() {
  const navigate = useNavigate()
  const location = useLocation()
  const successMessage = (location.state as any)?.message as string | undefined
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const [unverified, setUnverified] = useState(false)
  const [resendMsg, setResendMsg] = useState('')
  const [resending, setResending] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setUnverified(false)
    setResendMsg('')
    setLoading(true)
    try {
      const res = await login(email, password)
      localStorage.setItem('token', res.data.token)
      localStorage.setItem('email', res.data.email)
      navigate('/books')
    } catch (err: any) {
      const msg = err.response?.data?.message ?? ''
      if (msg === 'EMAIL_NOT_VERIFIED') {
        setUnverified(true)
      } else {
        setError('Email 或密碼錯誤')
      }
    } finally {
      setLoading(false)
    }
  }

  const handleResend = async () => {
    setResending(true)
    setResendMsg('')
    try {
      await resendVerification(email)
      setResendMsg('驗證信已重新寄出，請查收信箱')
    } catch {
      setResendMsg('寄送失敗，請稍後再試')
    } finally {
      setResending(false)
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center">
      <div className="bg-white p-8 rounded-2xl shadow-md w-full max-w-sm">
        <h1 className="text-2xl font-bold text-center text-gray-800 mb-2">LinguaMastery</h1>
        <p className="text-center text-gray-500 text-sm mb-6">登入帳號</p>

        {successMessage && (
          <div className="bg-green-50 border border-green-200 rounded-lg p-3 mb-4 text-sm text-green-700 text-center">
            ✅ {successMessage}
          </div>
        )}

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
              className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="••••••"
            />
          </div>

          {error && <p className="text-red-500 text-sm">{error}</p>}

          {unverified && (
            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3 text-sm">
              <p className="text-yellow-800 font-medium">Email 尚未驗證</p>
              <p className="text-yellow-600 text-xs mt-1">請查收 {email} 的驗證信</p>
              <button
                type="button"
                onClick={handleResend}
                disabled={resending}
                className="mt-2 text-blue-600 text-xs hover:underline disabled:opacity-50"
              >
                {resending ? '寄送中...' : '重新寄送驗證信'}
              </button>
              {resendMsg && <p className="text-green-600 text-xs mt-1">{resendMsg}</p>}
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 rounded-lg text-sm transition disabled:opacity-50"
          >
            {loading ? '登入中...' : '登入'}
          </button>
        </form>

        <div className="flex justify-between items-center mt-4">
          <p className="text-sm text-gray-500">
            還沒有帳號？{' '}
            <Link to="/register" className="text-blue-600 hover:underline">註冊</Link>
          </p>
          <Link to="/forgot-password" className="text-sm text-gray-400 hover:text-gray-600 hover:underline">
            忘記密碼
          </Link>
        </div>
      </div>
    </div>
  )
}
