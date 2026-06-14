import { Outlet } from 'react-router-dom'
import { ToastContainer } from '@/components/shared/ToastContainer'

export function AuthLayout() {
  return (
    <div className="min-h-screen">
      <Outlet />
      <ToastContainer />
    </div>
  )
}
