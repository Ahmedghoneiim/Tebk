import { useNavigate } from 'react-router-dom'
import { ShieldOff, LogOut } from 'lucide-react'
import { useAuthStore } from '@/store/authStore'

export function ForbiddenPage() {
  const navigate  = useNavigate()
  const { logout } = useAuthStore()

  const handleSignOut = async () => {
    await logout()
    navigate('/login', { replace: true })
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-background">
      <div className="text-center max-w-sm px-6">
        <div className="w-20 h-20 rounded-3xl bg-red-50 flex items-center justify-center mx-auto mb-6">
          <ShieldOff className="w-10 h-10 text-danger" />
        </div>
        <h1 className="text-3xl font-bold text-ink mb-2">403</h1>
        <h2 className="text-lg font-semibold text-ink mb-3">Access Denied</h2>
        <p className="text-muted text-sm mb-8">
          You don't have admin privileges to access this panel. Please sign in with an administrator account.
        </p>
        <button
          onClick={handleSignOut}
          className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-danger text-white text-sm font-semibold hover:bg-red-600 transition-colors"
        >
          <LogOut className="w-4 h-4" />
          Sign Out
        </button>
      </div>
    </div>
  )
}
