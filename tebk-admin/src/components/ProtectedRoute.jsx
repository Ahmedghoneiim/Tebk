import { Navigate } from 'react-router-dom'
import { AlertTriangle, RefreshCw } from 'lucide-react'
import { useAuthStore } from '@/store/authStore'

export function ProtectedRoute({ children }) {
  const { user, initializing, authError, initAuth } = useAuthStore()

  if (initializing) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="flex flex-col items-center gap-3">
          <div
            className="w-10 h-10 rounded-xl flex items-center justify-center"
            style={{ background: '#6366f1' }}
          >
            <span className="text-white font-bold text-lg">T</span>
          </div>
          <div className="w-5 h-5 border-2 border-primary border-t-transparent rounded-full animate-spin" />
        </div>
      </div>
    )
  }

  if (authError) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="text-center max-w-sm px-6">
          <div className="w-16 h-16 rounded-2xl bg-amber-50 flex items-center justify-center mx-auto mb-5">
            <AlertTriangle className="w-8 h-8 text-warning" />
          </div>
          <h2 className="text-lg font-semibold text-ink mb-2">Connection Error</h2>
          <p className="text-sm text-muted mb-6">{authError}</p>
          <button
            onClick={() => initAuth()}
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-primary text-white text-sm font-semibold hover:bg-primary-dark transition-colors"
          >
            <RefreshCw className="w-4 h-4" />
            Retry
          </button>
        </div>
      </div>
    )
  }

  if (!user) return <Navigate to="/login" replace />
  if (user.role !== 'admin') return <Navigate to="/forbidden" replace />

  return children
}
