import { Outlet } from 'react-router-dom'
import { Navbar } from '@/components/shared/Navbar'
import { Sidebar } from '@/components/shared/Sidebar'
import { ToastContainer } from '@/components/shared/ToastContainer'

export function AdminLayout() {
  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Navbar />
      <div className="flex flex-1 items-start">
        <Sidebar />
        <main className="flex-1 min-w-0">
          <div className="page-container py-8">
            <Outlet />
          </div>
        </main>
      </div>
      <ToastContainer />
    </div>
  )
}
