import { Navigate } from 'react-router-dom'
import { useAuthStore } from '@/store/authStore'
import { hasRole } from '@/utils/permissions'

export function RoleRoute({ children, roles }) {
  const { user } = useAuthStore()

  if (!user || !hasRole(user, roles)) {
    return <Navigate to="/dashboard" replace />
  }

  return children
}
