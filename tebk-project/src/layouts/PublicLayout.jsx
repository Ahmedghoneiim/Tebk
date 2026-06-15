import { Outlet } from 'react-router-dom'
import { Navbar } from '@/components/shared/Navbar'
import { Footer } from '@/components/shared/Footer'
import { MobileBottomNav } from '@/components/shared/MobileBottomNav'
import { ToastContainer } from '@/components/shared/ToastContainer'

export function PublicLayout() {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-1 pb-16 lg:pb-0 pt-20">
        <Outlet />
      </main>
      <Footer />
      <MobileBottomNav />
      <ToastContainer />
    </div>
  )
}
