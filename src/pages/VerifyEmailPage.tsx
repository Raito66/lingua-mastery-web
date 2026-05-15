import { useEffect, useState } from 'react'
import { useSearchParams, Link } from 'react-router-dom'
import { verifyEmail } from '../api/auth'

type Status = 'loading' | 'success' | 'error'

export default function VerifyEmailPage() {
  const [searchParams] = useSearchParams()
  const [status, setStatus] = useState<Status>('loading')
  const [message, setMessage] = useState('')

  useEffect(() => {
    const token = searchParams.get('token')
    if (!token) {
      setStatus('error')
      setMessage('無效的驗證連結')
      return
    }
    verifyEmail(token)
      .then((res) => {
        setMessage(res.data.message)
        setStatus('success')
      })
      .catch((err) => {
        setMessage(err.response?.data?.message ?? '驗證失敗，請重新申請')
        setStatus('error')
      })
  }, [searchParams])

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center">
      <div className="bg-white p-8 rounded-2xl shadow-md w-full max-w-sm text-center">
        {status === 'loading' && (
          <>
            <div className="w-10 h-10 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin mx-auto mb-4" />
            <p className="text-gray-500 text-sm">驗證中，請稍候...</p>
          </>
        )}

        {status === 'success' && (
          <>
            <p className="text-5xl mb-4">✅</p>
            <h2 className="text-xl font-bold text-gray-800 mb-2">驗證成功！</h2>
            <p className="text-gray-500 text-sm mb-6">{message}</p>
            <Link
              to="/login"
              className="w-full inline-block bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-6 rounded-lg text-sm transition"
            >
              前往登入
            </Link>
          </>
        )}

        {status === 'error' && (
          <>
            <p className="text-5xl mb-4">❌</p>
            <h2 className="text-xl font-bold text-gray-800 mb-2">驗證失敗</h2>
            <p className="text-gray-500 text-sm mb-6">{message}</p>
            <Link to="/login" className="text-blue-600 text-sm hover:underline">
              回到登入頁
            </Link>
          </>
        )}
      </div>
    </div>
  )
}
