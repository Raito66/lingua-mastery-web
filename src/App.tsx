import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import LoginPage from './pages/LoginPage'
import RegisterPage from './pages/RegisterPage'
import VerifyEmailPage from './pages/VerifyEmailPage'
import ForgotPasswordPage from './pages/ForgotPasswordPage'
import ResetPasswordPage from './pages/ResetPasswordPage'
import BooksPage from './pages/BooksPage'
import WordsPage from './pages/WordsPage'
import StudyPage from './pages/StudyPage'
import ReviewPage from './pages/ReviewPage'
import StatsPage from './pages/StatsPage'

function PrivateRoute({ children }: { children: React.ReactNode }) {
  const token = localStorage.getItem('token')
  return token ? <>{children}</> : <Navigate to="/login" />
}

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/verify-email" element={<VerifyEmailPage />} />
        <Route path="/forgot-password" element={<ForgotPasswordPage />} />
        <Route path="/reset-password" element={<ResetPasswordPage />} />
        <Route path="/books" element={<PrivateRoute><BooksPage /></PrivateRoute>} />
        <Route path="/books/:bookId/words" element={<PrivateRoute><WordsPage /></PrivateRoute>} />
        <Route path="/books/:bookId/study" element={<PrivateRoute><StudyPage /></PrivateRoute>} />
        <Route path="/books/:bookId/review" element={<PrivateRoute><ReviewPage /></PrivateRoute>} />
        <Route path="/stats" element={<PrivateRoute><StatsPage /></PrivateRoute>} />
        <Route path="*" element={<Navigate to="/login" />} />
      </Routes>
    </BrowserRouter>
  )
}
