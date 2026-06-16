import { Outlet } from 'react-router-dom'
import { Navbar } from '@/components/shared/Navbar'
import { ToastContainer } from '@/components/shared/ToastContainer'

export function AssistantLayout() {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100vh', paddingTop: '80px', boxSizing: 'border-box' }}>
      <Navbar />
      <main style={{ flex: 1, minHeight: 0, overflow: 'hidden' }}>
        <Outlet />
      </main>
      <ToastContainer />
    </div>
  )
}
