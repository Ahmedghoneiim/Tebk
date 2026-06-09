import { Outlet } from 'react-router-dom'
import { Navbar } from '@/components/shared/Navbar'
import { Sidebar } from '@/components/shared/Sidebar'
import { MobileBottomNav } from '@/components/shared/MobileBottomNav'
import { ToastContainer } from '@/components/shared/ToastContainer'

export function DashboardLayout() {
  return (
    <div className="min-h-screen flex flex-col bg-background dark:bg-slate-900">
      <Navbar />
      <div className="flex flex-1 items-start">
        <Sidebar />
        <main className="flex-1 min-w-0 pb-16 lg:pb-0">
          <div className="page-container py-8">
            <Outlet />
          </div>
        </main>
      </div>
      <MobileBottomNav />
      <ToastContainer />
    </div>
  )
}
