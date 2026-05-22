import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { getProfile, updateProfile, changePassword } from '../api/profile'

export default function ProfilePage() {
  const navigate = useNavigate()
  const [email, setEmail] = useState('')
  const [displayName, setDisplayName] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)

  // Edit name modal
  const [showEditName, setShowEditName] = useState(false)
  const [nameInput, setNameInput] = useState('')
  const [savingName, setSavingName] = useState(false)
  const [nameError, setNameError] = useState('')

  // Change password modal
  const [showChangePw, setShowChangePw] = useState(false)
  const [currentPw, setCurrentPw] = useState('')
  const [newPw, setNewPw] = useState('')
  const [savingPw, setSavingPw] = useState(false)
  const [pwError, setPwError] = useState('')
  const [pwSuccess, setPwSuccess] = useState('')

  // Show/hide password toggles
  const [showCurrentPw, setShowCurrentPw] = useState(false)
  const [showNewPw, setShowNewPw] = useState(false)

  useEffect(() => {
    getProfile()
      .then((res) => {
        setEmail(res.data.email)
        setDisplayName(res.data.displayName)
      })
      .catch(() => {
        navigate('/books')
      })
      .finally(() => setLoading(false))
  }, [navigate])

  const initials = (displayName || email || '?')
    .split(/[\s@]+/)[0]
    .slice(0, 2)
    .toUpperCase()

  const handleSaveName = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!nameInput.trim()) {
      setNameError('顯示名稱不能為空')
      return
    }
    setNameError('')
    setSavingName(true)
    try {
      const res = await updateProfile(nameInput.trim())
      setDisplayName(res.data.displayName)
      setShowEditName(false)
    } catch (err: unknown) {
      const msg =
        (err as { response?: { data?: { message?: string } } })?.response?.data?.message ??
        '儲存失敗，請稍後再試'
      setNameError(msg)
    } finally {
      setSavingName(false)
    }
  }

  const handleChangePw = async (e: React.FormEvent) => {
    e.preventDefault()
    setPwError('')
    setPwSuccess('')
    if (!/^(?=.*[A-Za-z])(?=.*\d).{8,}$/.test(newPw)) {
      setPwError('新密碼至少 8 碼，須包含英文字母與數字')
      return
    }
    setSavingPw(true)
    try {
      await changePassword(currentPw, newPw)
      setPwSuccess('密碼已更新')
      setCurrentPw('')
      setNewPw('')
      setTimeout(() => {
        setShowChangePw(false)
        setPwSuccess('')
      }, 1500)
    } catch (err: unknown) {
      const msg =
        (err as { response?: { data?: { message?: string } } })?.response?.data?.message ??
        '更改失敗，請稍後再試'
      setPwError(msg)
    } finally {
      setSavingPw(false)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <p className="text-gray-400">載入中...</p>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white border-b px-6 py-4 flex items-center gap-3">
        <button onClick={() => navigate('/books')} className="text-gray-400 hover:text-gray-600">
          ←
        </button>
        <h1 className="text-lg font-semibold text-gray-800">會員專區</h1>
      </header>

      <main className="max-w-lg mx-auto px-4 py-8 space-y-4">
        {/* Avatar + name */}
        <div className="bg-white rounded-2xl border p-6 flex flex-col items-center gap-3">
          <div className="w-20 h-20 rounded-full bg-blue-600 flex items-center justify-center text-white text-2xl font-bold select-none">
            {initials}
          </div>
          <div className="text-center">
            <p className="text-lg font-semibold text-gray-800">
              {displayName || '（未設定顯示名稱）'}
            </p>
            <p className="text-sm text-gray-400 mt-0.5">{email}</p>
          </div>
          <button
            onClick={() => {
              setNameInput(displayName ?? '')
              setNameError('')
              setShowEditName(true)
            }}
            className="text-sm text-blue-600 hover:underline"
          >
            編輯顯示名稱
          </button>
        </div>

        {/* Account settings */}
        <div className="bg-white rounded-2xl border divide-y">
          <button
            onClick={() => {
              setCurrentPw('')
              setNewPw('')
              setPwError('')
              setPwSuccess('')
              setShowCurrentPw(false)
              setShowNewPw(false)
              setShowChangePw(true)
            }}
            className="w-full px-5 py-4 flex justify-between items-center text-left hover:bg-gray-50 transition"
          >
            <span className="text-sm font-medium text-gray-700">更改密碼</span>
            <span className="text-gray-400 text-sm">›</span>
          </button>
        </div>

        {/* About */}
        <div className="bg-white rounded-2xl border px-5 py-5 space-y-3">
          <h2 className="text-sm font-semibold text-gray-500 uppercase tracking-wide">關於</h2>
          <div className="space-y-2 text-sm text-gray-700">
            <div className="flex items-center gap-3">
              <span className="text-gray-400 w-16 shrink-0">製作者</span>
              <span className="font-medium">萊特 Light</span>
            </div>
            <div className="flex items-center gap-3">
              <span className="text-gray-400 w-16 shrink-0">GitHub</span>
              <a
                href="https://github.com/Raito66"
                target="_blank"
                rel="noreferrer"
                className="text-blue-600 hover:underline"
              >
                github.com/Raito66
              </a>
            </div>
            <div className="flex items-center gap-3">
              <span className="text-gray-400 w-16 shrink-0">Email</span>
              <a href="mailto:tfy4942@gmail.com" className="text-blue-600 hover:underline">
                tfy4942@gmail.com
              </a>
            </div>
          </div>
        </div>

        {/* Logout */}
        <button
          onClick={() => {
            localStorage.removeItem('token')
            localStorage.removeItem('email')
            navigate('/login')
          }}
          className="w-full bg-white border border-red-200 text-red-500 text-sm font-medium py-3 rounded-2xl hover:bg-red-50 transition"
        >
          登出
        </button>
      </main>

      {/* Edit name modal */}
      {showEditName && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
          <div className="bg-white rounded-2xl shadow-xl p-6 w-full max-w-sm mx-4">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">編輯顯示名稱</h3>
            <form onSubmit={handleSaveName} className="space-y-4">
              <input
                type="text"
                value={nameInput}
                onChange={(e) => setNameInput(e.target.value)}
                maxLength={50}
                placeholder="輸入顯示名稱"
                className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              {nameError && <p className="text-sm text-red-500">{nameError}</p>}
              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={() => setShowEditName(false)}
                  className="flex-1 border border-gray-300 text-gray-600 text-sm font-medium py-2 rounded-lg hover:bg-gray-50 transition"
                >
                  取消
                </button>
                <button
                  type="submit"
                  disabled={savingName}
                  className="flex-1 bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium py-2 rounded-lg transition disabled:opacity-50"
                >
                  {savingName ? '儲存中...' : '儲存'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Change password modal */}
      {showChangePw && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
          <div className="bg-white rounded-2xl shadow-xl p-6 w-full max-w-sm mx-4">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">更改密碼</h3>
            <form onSubmit={handleChangePw} className="space-y-4">
              <div className="relative">
                <input
                  type={showCurrentPw ? 'text' : 'password'}
                  value={currentPw}
                  onChange={(e) => setCurrentPw(e.target.value)}
                  placeholder="目前密碼"
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm pr-10 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <button
                  type="button"
                  onClick={() => setShowCurrentPw((v) => !v)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 text-xs"
                >
                  {showCurrentPw ? '隱藏' : '顯示'}
                </button>
              </div>
              <div className="relative">
                <input
                  type={showNewPw ? 'text' : 'password'}
                  value={newPw}
                  onChange={(e) => setNewPw(e.target.value)}
                  placeholder="新密碼（至少 8 碼，含英文與數字）"
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm pr-10 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <button
                  type="button"
                  onClick={() => setShowNewPw((v) => !v)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 text-xs"
                >
                  {showNewPw ? '隱藏' : '顯示'}
                </button>
              </div>
              {pwError && <p className="text-sm text-red-500">{pwError}</p>}
              {pwSuccess && <p className="text-sm text-green-600">{pwSuccess}</p>}
              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={() => setShowChangePw(false)}
                  className="flex-1 border border-gray-300 text-gray-600 text-sm font-medium py-2 rounded-lg hover:bg-gray-50 transition"
                >
                  取消
                </button>
                <button
                  type="submit"
                  disabled={savingPw}
                  className="flex-1 bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium py-2 rounded-lg transition disabled:opacity-50"
                >
                  {savingPw ? '更新中...' : '確認更改'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}
